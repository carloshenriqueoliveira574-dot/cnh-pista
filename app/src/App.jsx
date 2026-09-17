import { useEffect, useState } from 'react'
import Login from './screens/Login'
import Onboarding from './screens/onboarding/Onboarding'
import Diagnostic from './screens/Diagnostic'
import DiagnosticResult from './screens/DiagnosticResult'
import Paywall from './screens/Paywall'
import Home from './screens/Home'
import Question from './screens/Question'
import Correct from './screens/Correct'
import ErrorExplanation from './screens/ErrorExplanation'
import Macete from './screens/Macete'
import Simulado from './screens/Simulado'
import SimuladoResult from './screens/SimuladoResult'
import RevisaoIntro from './screens/RevisaoIntro'
import MeusMacetes from './screens/MeusMacetes'
import Perfil from './screens/Perfil'
import { QUESTIONS, pickForCategory } from './data/questions'
import { supabase } from './lib/supabaseClient'
import {
  fetchQuestions,
  saveOnboarding,
  saveDiagnosticAttempt,
  saveStudyAnswer,
  saveMacete,
  saveSimulado,
  startCheckout,
  loadUserState,
} from './lib/backend'
import styles from './App.module.css'

const SESSION_TOTAL = 5
const REVIEW_TOTAL = 5

const INITIAL_STATE = {
  screen: 'login',
  userId: null,
  userEmail: null,
  displayName: null,
  diagnosticAnswers: [],
  focusCategory: null,
  strong: null,
  weak: null,
  readinessPct: 0,
  premium: false,
  session: { questions: [], index: 0, selectedIndex: null },
  macetes: {},
  wrongCounts: {},
  lastSimulado: null,
  simuladoView: null,
  simuladosCount: 0,
  checkoutLoading: false,
  checkoutError: '',
}

function scoreByCategory(entries) {
  const byCategory = {}
  for (const { category, correct } of entries) {
    if (!byCategory[category]) byCategory[category] = { correct: 0, total: 0 }
    byCategory[category].total += 1
    if (correct) byCategory[category].correct += 1
  }
  return Object.entries(byCategory)
    .map(([category, { correct, total }]) => ({ label: category, pct: Math.round((correct / total) * 100) }))
    .sort((a, b) => a.pct - b.pct)
}

export default function App() {
  const [state, setState] = useState(INITIAL_STATE)
  const [questionPool, setQuestionPool] = useState(null)

  useEffect(() => {
    fetchQuestions().then((remote) => {
      if (remote) setQuestionPool(remote)
    })
  }, [])

  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!supabase) return

    if (window.location.hash.includes('error=')) {
      const params = new URLSearchParams(window.location.hash.slice(1))
      const description = params.get('error_description')
      setAuthError(
        description
          ? decodeURIComponent(description.replace(/\+/g, ' '))
          : 'Não foi possível confirmar o login. Tente enviar o link de novo.'
      )
      window.history.replaceState(null, '', window.location.pathname)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) hydrateFromSession(data.session)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) hydrateFromSession(session)
    })

    return () => subscription.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!supabase) return
    if (new URLSearchParams(window.location.search).get('mp') !== 'return') return
    window.history.replaceState(null, '', window.location.pathname)

    let cancelled = false
    async function pollPremium() {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const { data } = await supabase.auth.getSession()
        if (!data?.session || cancelled) return
        const userState = await loadUserState(data.session.user.id)
        if (userState?.profile?.premium) {
          setState((s) => ({ ...s, premium: true }))
          return
        }
      }
    }
    pollPremium()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function hydrateFromSession(session) {
    const userId = session.user.id
    const pool = questionPool ?? QUESTIONS
    const userState = await loadUserState(userId)

    const wrongCounts = {}
    for (const [qid, entry] of Object.entries(userState?.wrongCounts ?? {})) {
      const q = pool.find((x) => x.id === qid)
      wrongCounts[qid] = { category: q?.category ?? 'Geral', count: entry.count }
    }

    const onboarded = Boolean(userState?.profile?.study_level)
    const diag = userState?.lastDiagnostic
    const scored = diag?.answers ? scoreByCategory(diag.answers) : null

    setState((s) => ({
      ...s,
      userId,
      userEmail: session.user.email ?? null,
      displayName: userState?.profile?.display_name ?? null,
      premium: userState?.profile?.premium ?? false,
      wrongCounts,
      macetes: userState?.macetes ?? {},
      simuladosCount: userState?.simuladosCount ?? 0,
      lastSimulado: userState?.lastSimulado ?? null,
      focusCategory: diag?.weak_category ?? s.focusCategory,
      readinessPct: diag?.overall_pct ?? s.readinessPct,
      weak: scored?.[0] ?? s.weak,
      strong: scored?.[scored.length - 1] ?? s.strong,
      screen: onboarded ? 'home' : 'onboarding',
    }))
  }

  async function reset() {
    if (supabase) await supabase.auth.signOut()
    setState(INITIAL_STATE)
  }

  async function handleLoginComplete() {
    if (!supabase) {
      setState((s) => ({ ...s, screen: 'onboarding' }))
      return
    }
    const { data } = await supabase.auth.getSession()
    if (data?.session) {
      await hydrateFromSession(data.session)
    } else {
      setState((s) => ({ ...s, screen: 'onboarding' }))
    }
  }

  function handleOnboardingComplete(profile) {
    if (state.userId) saveOnboarding(state.userId, profile).catch(() => {})
    setState((s) => ({ ...s, screen: 'diagnostic' }))
  }

  function handleDiagnosticComplete(answers) {
    setState((s) => ({ ...s, diagnosticAnswers: answers, screen: 'diagnostic-result' }))
  }

  function handleDiagnosticResultContinue(weakestCategory) {
    const scored = scoreByCategory(state.diagnosticAnswers)
    const weak = scored[0]
    const strong = scored[scored.length - 1]
    const overallPct = Math.round(scored.reduce((sum, s) => sum + s.pct, 0) / scored.length)

    if (state.userId) {
      saveDiagnosticAttempt(state.userId, {
        answers: state.diagnosticAnswers,
        overallPct,
        weakCategory: weakestCategory,
        strongCategory: strong?.label ?? null,
      }).catch(() => {})
    }

    setState((s) => ({
      ...s,
      screen: 'paywall',
      focusCategory: weakestCategory,
      strong,
      weak,
      readinessPct: overallPct,
    }))
  }

  function goHome() {
    setState((s) => ({ ...s, screen: 'home' }))
  }

  async function handleSubscribe() {
    setState((s) => ({ ...s, checkoutLoading: true, checkoutError: '' }))
    try {
      const initPoint = await startCheckout()
      window.location.href = initPoint
    } catch (err) {
      setState((s) => ({ ...s, checkoutLoading: false, checkoutError: err.message || 'Não foi possível iniciar a assinatura.' }))
    }
  }

  function handleSkipPaywall() {
    setState((s) => ({ ...s, screen: 'home' }))
  }

  function startStudySession() {
    const pool = questionPool ?? QUESTIONS
    const questions = pickForCategory(state.focusCategory, SESSION_TOTAL, pool)
    setState((s) => ({ ...s, screen: 'question', session: { questions, index: 0, selectedIndex: null } }))
  }

  function startRevisaoSession(ids) {
    const pool = questionPool ?? QUESTIONS
    const questions = ids.map((id) => pool.find((q) => q.id === id)).filter(Boolean)
    setState((s) => ({ ...s, screen: 'question', session: { questions, index: 0, selectedIndex: null } }))
  }

  function handleConfirmAnswer(selectedIndex) {
    const question = state.session.questions[state.session.index]
    const correct = selectedIndex === question.correctIndex

    if (state.userId) {
      saveStudyAnswer(state.userId, { questionId: question.id, correct }).catch(() => {})
    }

    setState((s) => {
      const wrongCounts = correct
        ? s.wrongCounts
        : {
            ...s.wrongCounts,
            [question.id]: {
              category: question.category,
              count: (s.wrongCounts[question.id]?.count || 0) + 1,
            },
          }
      return {
        ...s,
        screen: correct ? 'correct' : 'error',
        session: { ...s.session, selectedIndex },
        wrongCounts,
      }
    })
  }

  function enterMacete() {
    const question = state.session.questions[state.session.index]

    if (state.userId && !state.macetes[question.id]) {
      saveMacete(state.userId, {
        questionId: question.id,
        category: question.category,
        quote: question.macete.quote,
      }).catch(() => {})
    }

    setState((s) => ({
      ...s,
      screen: 'macete',
      macetes: s.macetes[question.id]
        ? s.macetes
        : { ...s.macetes, [question.id]: { id: question.id, category: question.category, quote: question.macete.quote } },
    }))
  }

  function retrySameQuestion() {
    setState((s) => ({ ...s, screen: 'question' }))
  }

  function advanceSession() {
    setState((s) => {
      const nextIndex = s.session.index + 1
      if (nextIndex >= s.session.questions.length) {
        return { ...s, screen: 'home', session: { questions: [], index: 0, selectedIndex: null } }
      }
      return { ...s, screen: 'question', session: { ...s.session, index: nextIndex, selectedIndex: null } }
    })
  }

  function startSimulado() {
    setState((s) => ({ ...s, screen: 'simulado' }))
  }

  function handleSimuladoComplete({ answers, elapsedSeconds }) {
    const correct = answers.filter((a) => a.correct).length
    const total = answers.length
    const scored = scoreByCategory(answers)
    const strong = scored[scored.length - 1]?.label ?? null
    const weak = scored[0]?.label ?? null

    if (state.userId) {
      saveSimulado(state.userId, { correct, total, elapsedSeconds, answers }).catch(() => {})
    }

    setState((s) => {
      const wrongCounts = { ...s.wrongCounts }
      for (const a of answers) {
        if (a.correct) continue
        wrongCounts[a.id] = { category: a.category, count: (wrongCounts[a.id]?.count || 0) + 1 }
      }
      const recurringCount = answers.filter((a) => !a.correct && (wrongCounts[a.id]?.count || 0) >= 2).length

      return {
        ...s,
        wrongCounts,
        lastSimulado: { correct, total, elapsedSeconds },
        simuladosCount: s.simuladosCount + 1,
        simuladoView: { result: { correct, total, elapsedSeconds }, previous: s.lastSimulado, strong, weak, recurringCount },
        screen: 'simulado-result',
      }
    })
  }

  function wrongByCategoryList() {
    const byCategory = {}
    for (const { category, count } of Object.values(state.wrongCounts)) {
      byCategory[category] = (byCategory[category] || 0) + count
    }
    return Object.entries(byCategory)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }

  function openRevisao() {
    setState((s) => ({ ...s, screen: 'revisao-intro' }))
  }

  function reviewAllErrors() {
    const ids = Object.entries(state.wrongCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([id]) => id)
      .slice(0, REVIEW_TOTAL)
    startRevisaoSession(ids)
  }

  function openMacetes() {
    setState((s) => ({ ...s, screen: 'meus-macetes' }))
  }

  function openPerfil() {
    setState((s) => ({ ...s, screen: 'perfil' }))
  }

  function handleNavigate(key) {
    if (key === 'estudar') startStudySession()
    else if (key === 'simulado') startSimulado()
    else if (key === 'revisar') openRevisao()
    else if (key === 'perfil') openPerfil()
    else if (key === 'inicio') goHome()
  }

  const question = state.session.questions[state.session.index]

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <span className={styles.badge}>Fase 01 · Pista</span>
        <h1 className={styles.title}>CNH — Direção Pista</h1>
        <button type="button" className={styles.resetLink} onClick={reset}>
          reiniciar fluxo
        </button>
      </header>

      <main className={styles.stage}>
        {state.screen === 'login' && <Login onComplete={handleLoginComplete} externalError={authError} />}

        {state.screen === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}

        {state.screen === 'diagnostic' && <Diagnostic onComplete={handleDiagnosticComplete} pool={questionPool ?? undefined} />}

        {state.screen === 'diagnostic-result' && (
          <DiagnosticResult answers={state.diagnosticAnswers} onContinue={handleDiagnosticResultContinue} />
        )}

        {state.screen === 'paywall' && (
          <Paywall
            weakCategories={scoreByCategory(state.diagnosticAnswers).slice(0, 3).map((s) => s.label)}
            onSubscribe={handleSubscribe}
            onSkip={handleSkipPaywall}
            loading={state.checkoutLoading}
            error={state.checkoutError}
          />
        )}

        {state.screen === 'home' && (
          <Home
            readinessPct={state.readinessPct}
            readinessLabel={state.readinessPct >= 80 ? 'PRONTO' : state.readinessPct >= 50 ? 'QUASE LÁ' : 'AINDA NÃO'}
            focusCategory={state.focusCategory ? `${state.focusCategory} · pratique agora` : 'Preferência em cruzamentos'}
            strong={state.strong}
            weak={state.weak}
            lastSimulado={state.lastSimulado}
            displayName={state.displayName}
            userEmail={state.userEmail}
            onContinue={startStudySession}
            onOpenMacetes={openMacetes}
            onNavigate={handleNavigate}
          />
        )}

        {state.screen === 'question' && (
          <Question
            question={question}
            sessionIndex={state.session.index}
            sessionTotal={state.session.questions.length}
            onConfirm={handleConfirmAnswer}
          />
        )}

        {state.screen === 'correct' && <Correct question={question} onContinue={advanceSession} />}

        {state.screen === 'error' && (
          <ErrorExplanation question={question} selectedIndex={state.session.selectedIndex} onContinue={enterMacete} />
        )}

        {state.screen === 'macete' && (
          <Macete
            question={question}
            unlockedCount={Object.keys(state.macetes).length}
            onSave={advanceSession}
            onRetry={retrySameQuestion}
          />
        )}

        {state.screen === 'simulado' && <Simulado onComplete={handleSimuladoComplete} pool={questionPool ?? undefined} />}

        {state.screen === 'simulado-result' && state.simuladoView && (
          <SimuladoResult
            result={state.simuladoView.result}
            previous={state.simuladoView.previous}
            strong={state.simuladoView.strong}
            weak={state.simuladoView.weak}
            recurringCount={state.simuladoView.recurringCount}
            onReviewErrors={openRevisao}
            onBackHome={goHome}
          />
        )}

        {state.screen === 'revisao-intro' && (
          <RevisaoIntro wrongByCategory={wrongByCategoryList()} onReviewAll={reviewAllErrors} onBackHome={goHome} />
        )}

        {state.screen === 'meus-macetes' && (
          <MeusMacetes macetes={Object.values(state.macetes)} onBackHome={goHome} />
        )}

        {state.screen === 'perfil' && (
          <Perfil
            readinessPct={state.readinessPct}
            macetesCount={Object.keys(state.macetes).length}
            simuladosCount={state.simuladosCount}
            premium={state.premium}
            userEmail={state.userEmail}
            displayName={state.displayName}
            onOpenMacetes={openMacetes}
            onSignOut={reset}
            onNavigate={handleNavigate}
            onSubscribe={handleSubscribe}
            checkoutLoading={state.checkoutLoading}
            checkoutError={state.checkoutError}
          />
        )}
      </main>
    </div>
  )
}

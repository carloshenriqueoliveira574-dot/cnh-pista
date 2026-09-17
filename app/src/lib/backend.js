import { supabase } from './supabaseClient'

function mapQuestionRow(row) {
  return {
    id: row.id,
    category: row.category,
    prompt: row.prompt,
    scene: row.scene,
    sceneVariant: row.scene_variant ?? undefined,
    options: row.options,
    correctIndex: row.correct_index,
    lead: row.lead,
    explanation: row.explanation,
    trap: row.trap,
    wrongNotes: row.wrong_notes ?? {},
    macete: { quote: row.macete_quote, hint: row.macete_hint },
  }
}

export async function fetchQuestions() {
  if (!supabase) return null
  const { data, error } = await supabase.from('questions').select('*')
  if (error || !data || data.length === 0) return null
  return data.map(mapQuestionRow)
}

export async function saveOnboarding(userId, { examTiming, estado, studyLevel }) {
  if (!supabase) return
  await supabase
    .from('profiles')
    .update({ exam_timing: examTiming, estado, study_level: studyLevel })
    .eq('id', userId)
}

export async function saveDiagnosticAttempt(userId, { answers, overallPct, weakCategory, strongCategory }) {
  if (!supabase) return
  await supabase.from('diagnostic_attempts').insert({
    user_id: userId,
    answers,
    overall_pct: overallPct,
    weak_category: weakCategory,
    strong_category: strongCategory,
  })
}

export async function saveStudyAnswer(userId, { questionId, correct }) {
  if (!supabase) return
  await supabase.from('study_answers').insert({ user_id: userId, question_id: questionId, correct })
}

export async function saveMacete(userId, { questionId, category, quote }) {
  if (!supabase) return
  await supabase
    .from('macetes_unlocked')
    .upsert({ user_id: userId, question_id: questionId, category, quote }, { onConflict: 'user_id,question_id' })
}

export async function saveSimulado(userId, { correct, total, elapsedSeconds, answers }) {
  if (!supabase) return
  await supabase.from('simulados').insert({ user_id: userId, correct, total, elapsed_seconds: elapsedSeconds, answers })
}

export async function startCheckout() {
  if (!supabase) throw new Error('Supabase não configurado')
  const { data } = await supabase.auth.getSession()
  const accessToken = data?.session?.access_token
  if (!accessToken) throw new Error('Sessão inválida')

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body?.error?.message || 'Não foi possível iniciar a assinatura')
  return body.init_point
}

export async function cancelSubscription() {
  if (!supabase) throw new Error('Supabase não configurado')
  const { data } = await supabase.auth.getSession()
  const accessToken = data?.session?.access_token
  if (!accessToken) throw new Error('Sessão inválida')

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body?.error?.message || 'Não foi possível cancelar a assinatura')
}

export async function loadUserState(userId) {
  if (!supabase) return null

  const [{ data: profile }, { data: studyAnswers }, { data: macetesRows }, { data: simulados }, { data: diagnostics }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('study_answers').select('question_id, correct'),
      supabase.from('macetes_unlocked').select('question_id, category, quote'),
      supabase.from('simulados').select('correct, total, elapsed_seconds, created_at').order('created_at', { ascending: false }),
      supabase
        .from('diagnostic_attempts')
        .select('answers, overall_pct, weak_category, strong_category, created_at')
        .order('created_at', { ascending: false })
        .limit(1),
    ])

  const wrongCounts = {}
  for (const row of studyAnswers ?? []) {
    if (row.correct) continue
    // question category isn't stored on study_answers; filled in by caller once questions load
    wrongCounts[row.question_id] = { count: (wrongCounts[row.question_id]?.count || 0) + 1 }
  }

  const macetes = {}
  for (const row of macetesRows ?? []) {
    macetes[row.question_id] = { id: row.question_id, category: row.category, quote: row.quote }
  }

  const lastSimulado = simulados && simulados.length > 0
    ? { correct: simulados[0].correct, total: simulados[0].total, elapsedSeconds: simulados[0].elapsed_seconds }
    : null

  const lastDiagnostic = diagnostics && diagnostics.length > 0 ? diagnostics[0] : null

  return {
    profile: profile ?? null,
    wrongCounts,
    macetes,
    simuladosCount: simulados?.length ?? 0,
    lastSimulado,
    lastDiagnostic,
  }
}

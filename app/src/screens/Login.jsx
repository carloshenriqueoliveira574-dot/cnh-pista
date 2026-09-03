import { useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import { supabase } from '../lib/supabaseClient'
import styles from './Login.module.css'

export default function Login({ onComplete, externalError }) {
  const [mode, setMode] = useState('start') // 'start' | 'email' | 'sent'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(externalError || '')
  const [showCodeField, setShowCodeField] = useState(false)

  useEffect(() => {
    if (externalError) setError(externalError)
  }, [externalError])

  async function handleGoogle() {
    if (!supabase) {
      onComplete()
      return
    }
    setError('')
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (authError) setError('Login com Google indisponível no momento. Tente por e-mail.')
  }

  async function handleSubmitEmail(e) {
    e.preventDefault()
    if (!supabase) {
      onComplete()
      return
    }
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: window.location.href },
    })
    setLoading(false)
    if (authError) {
      setError('Não foi possível enviar o e-mail. Confira o endereço e tente de novo.')
      return
    }
    setMode('sent')
  }

  async function handleSubmitCode(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    setLoading(false)
    if (authError) {
      setError('Código inválido ou expirado. Confira e tente de novo.')
      return
    }
    onComplete()
  }

  return (
    <PhoneFrame label={mode === 'start' ? 'Login' : mode === 'email' ? 'Login · e-mail' : 'Login · confirmação'}>
      <div className={styles.wrap}>
        <div className={styles.brand}>CNH · PISTA</div>
        <h1 className={styles.title}>Pare de decorar respostas.</h1>
        <p className={styles.subtitle}>Entenda a prova teórica de verdade.</p>

        {mode === 'start' && (
          <div className={styles.actions}>
            <button type="button" className={styles.google} onClick={handleGoogle}>
              Continuar com Google
            </button>
            <button type="button" className={styles.emailLink} onClick={() => setMode('email')}>
              Continuar com e-mail
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}

        {mode === 'email' && (
          <form className={styles.actions} onSubmit={handleSubmitEmail}>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.google} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
            <button type="button" className={styles.emailLink} onClick={() => setMode('start')}>
              Voltar
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        )}

        {mode === 'sent' && (
          <div className={styles.actions}>
            <p className={styles.subtitle}>
              Enviamos um e-mail para {email}. Abra a caixa de entrada e clique no link — esta tela atualiza sozinha
              assim que você confirmar.
            </p>

            {!showCodeField && (
              <button type="button" className={styles.emailLink} onClick={() => setShowCodeField(true)}>
                Recebi um código em vez de um link
              </button>
            )}

            {showCodeField && (
              <form className={styles.actions} onSubmit={handleSubmitCode}>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="000000"
                  className={styles.input}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit" className={styles.google} disabled={loading}>
                  {loading ? 'Confirmando...' : 'Entrar com o código'}
                </button>
              </form>
            )}

            <button type="button" className={styles.emailLink} onClick={() => setMode('email')}>
              Usar outro e-mail
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}

        <p className={styles.terms}>Ao continuar, você concorda com os Termos e a Privacidade.</p>
      </div>
    </PhoneFrame>
  )
}

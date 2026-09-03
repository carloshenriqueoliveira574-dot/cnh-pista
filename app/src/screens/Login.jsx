import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import { supabase } from '../lib/supabaseClient'
import styles from './Login.module.css'

export default function Login({ onComplete }) {
  const [mode, setMode] = useState('start') // 'start' | 'email' | 'code'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      options: { shouldCreateUser: true },
    })
    setLoading(false)
    if (authError) {
      setError('Não foi possível enviar o código. Confira o e-mail e tente de novo.')
      return
    }
    setMode('code')
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
    <PhoneFrame label={mode === 'start' ? 'Login' : mode === 'email' ? 'Login · e-mail' : 'Login · código'}>
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

        {mode === 'code' && (
          <form className={styles.actions} onSubmit={handleSubmitCode}>
            <p className={styles.subtitle}>Enviamos um código de 6 dígitos para {email}.</p>
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
              {loading ? 'Confirmando...' : 'Entrar'}
            </button>
            <button type="button" className={styles.emailLink} onClick={() => setMode('email')}>
              Voltar
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        )}

        <p className={styles.terms}>Ao continuar, você concorda com os Termos e a Privacidade.</p>
      </div>
    </PhoneFrame>
  )
}

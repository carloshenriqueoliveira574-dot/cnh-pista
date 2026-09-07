import PhoneFrame from '../components/PhoneFrame'
import styles from './Paywall.module.css'

const BENEFITS = [
  'Revisão inteligente dos seus erros',
  'Todos os simulados, sem limite',
  'Explicações visuais completas',
  'Macetes de todas as categorias',
  'Histórico completo de estudo',
  'Plano de estudo personalizado',
]

export default function Paywall({ weakCategories, onSubscribe, onSkip, loading, error }) {
  return (
    <PhoneFrame label="Paywall">
      <div className={styles.wrap}>
        <div className={styles.teaser}>
          <div className={styles.teaserLabel}>O que encontramos</div>
          <p className={styles.teaserText}>
            Identificamos {weakCategories.length} assunto{weakCategories.length === 1 ? '' : 's'} que podem te fazer
            perder pontos:
          </p>
          <ul className={styles.teaserList}>
            {weakCategories.map((c) => (
              <li key={c} className={styles.teaserItem}>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.body}>
          <h1 className={styles.title}>Continue sua preparação completa</h1>
          <div className={styles.planBadge}>Plano Premium</div>
          <ul className={styles.benefits}>
            {BENEFITS.map((b) => (
              <li key={b} className={styles.benefitItem}>
                <span className={styles.check}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cta} onClick={onSubscribe} disabled={loading}>
            {loading ? 'ABRINDO PAGAMENTO...' : 'ASSINAR PREMIUM · R$ 19,90/MÊS'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          <button type="button" className={styles.skip} onClick={onSkip}>
            Continuar no plano grátis
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

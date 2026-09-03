import PhoneFrame from '../components/PhoneFrame'
import styles from './Macete.module.css'

export default function Macete({ question, unlockedCount, onSave, onRetry }) {
  return (
    <PhoneFrame label="Moedinha do Macete">
      <header className={styles.header}>
        <span>{question.category}</span>
      </header>

      <div className={styles.understood}>
        <div className={styles.understoodRow}>
          <span className={styles.check}>✓</span>
          ENTENDIDO
        </div>
        <p className={styles.understoodText}>{question.explanation}</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.coinWrap}>
          <div className={styles.coinGlow} />
          <div className={styles.coin}>
            <div className={styles.coinInner}>M</div>
          </div>
        </div>
        <div className={styles.unlocked}>Macete bônus desbloqueado</div>
        <div className={styles.question}>Quer lembrar disso na prova?</div>
        <div className={styles.goldRule} />
        <p className={styles.quote}>{question.macete.quote}</p>
        <p className={styles.hint}>{question.macete.hint}</p>
        <div className={styles.counter}>
          {unlockedCount}º macete · Meus Macetes
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.primary} onClick={onSave}>
          GUARDAR E CONTINUAR
        </button>
        <button type="button" className={styles.secondary} onClick={onRetry}>
          TESTAR DE NOVO AGORA
        </button>
      </div>
    </PhoneFrame>
  )
}

import PhoneFrame from '../components/PhoneFrame'
import styles from './SimuladoResult.module.css'

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function SimuladoResult({ result, previous, strong, weak, recurringCount, onReviewErrors, onBackHome }) {
  const { correct, total, elapsedSeconds } = result
  const passed = correct / total >= 0.7

  let deltaNote = 'Seu primeiro simulado.'
  if (previous) {
    const delta = correct - previous.correct
    if (delta > 0) deltaNote = `+${delta} acertos que o último`
    else if (delta < 0) deltaNote = `${delta} acertos em relação ao último`
    else deltaNote = 'Igual ao seu último simulado'
  }

  return (
    <PhoneFrame label="Resultado do simulado">
      <div className={styles.wrap}>
        <div className={styles.scoreRow}>
          <span className={styles.score}>
            {correct}/{total}
          </span>
        </div>
        <p className={passed ? styles.verdictGood : styles.verdictBad}>
          {passed ? 'Você passaria neste simulado.' : 'Ainda não dessa vez — mas dá pra virar.'}
        </p>

        <div className={styles.statGrid}>
          <div className={styles.statCell}>
            <div className={styles.statLabel}>Comparado ao último</div>
            <div className={styles.statValue}>{deltaNote}</div>
          </div>
          <div className={styles.statCell}>
            <div className={styles.statLabel}>Tempo</div>
            <div className={styles.statValue}>{formatTime(elapsedSeconds)}</div>
          </div>
          {strong && (
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Seu ponto forte</div>
              <div className={styles.statValue}>{strong}</div>
            </div>
          )}
          {weak && (
            <div className={styles.statCell}>
              <div className={styles.statLabel}>Seu ponto fraco</div>
              <div className={styles.statValue}>{weak}</div>
            </div>
          )}
          <div className={styles.statCell}>
            <div className={styles.statLabel}>Erros recorrentes</div>
            <div className={styles.statValue}>{recurringCount}</div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cta} onClick={onReviewErrors}>
            REVISAR MEUS ERROS
          </button>
          <button type="button" className={styles.secondary} onClick={onBackHome}>
            VOLTAR PARA O INÍCIO
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

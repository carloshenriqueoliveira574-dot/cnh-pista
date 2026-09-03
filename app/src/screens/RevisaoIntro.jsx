import PhoneFrame from '../components/PhoneFrame'
import styles from './RevisaoIntro.module.css'

export default function RevisaoIntro({ wrongByCategory, onReviewAll, onBackHome }) {
  const isEmpty = wrongByCategory.length === 0

  if (isEmpty) {
    return (
      <PhoneFrame label="Revisão · vazio">
        <div className={styles.empty}>
          <h1 className={styles.emptyTitle}>Nada para revisar 🎉</h1>
          <p className={styles.emptyNote}>Continue estudando e seus pontos de atenção aparecerão aqui.</p>
          <button type="button" className={styles.secondary} onClick={onBackHome}>
            VOLTAR PARA O INÍCIO
          </button>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame label="Revisão de erros">
      <div className={styles.wrap}>
        <h1 className={styles.title}>Vamos atacar seus erros.</h1>

        <div className={styles.list}>
          {wrongByCategory.map((item) => (
            <div key={item.category} className={styles.card}>
              <div className={styles.cardTitle}>{item.category}</div>
              <div className={styles.cardNote}>
                Você errou {item.count} {item.count === 1 ? 'vez' : 'vezes'}.
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cta} onClick={onReviewAll}>
            REVISAR AGORA
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

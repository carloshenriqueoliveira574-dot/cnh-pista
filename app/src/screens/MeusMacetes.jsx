import PhoneFrame from '../components/PhoneFrame'
import styles from './MeusMacetes.module.css'

export default function MeusMacetes({ macetes, onBackHome }) {
  const isEmpty = macetes.length === 0

  return (
    <PhoneFrame label="Meus Macetes">
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>🪙 Meus Macetes</h1>
          <button type="button" className={styles.backLink} onClick={onBackHome}>
            início
          </button>
        </div>

        {isEmpty ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Seus macetes aparecerão aqui.</p>
            <p className={styles.emptyNote}>Estude algumas questões para desbloquear os primeiros.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {macetes.map((m) => (
              <div key={m.id} className={styles.card}>
                <div className={styles.cardCategory}>{m.category}</div>
                <div className={styles.cardQuote}>{m.quote}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}

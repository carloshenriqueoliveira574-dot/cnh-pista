import PhoneFrame from '../components/PhoneFrame'
import styles from './DiagnosticResult.module.css'

function scoreByCategory(answers) {
  const byCategory = {}
  for (const { category, correct } of answers) {
    if (!byCategory[category]) byCategory[category] = { correct: 0, total: 0 }
    byCategory[category].total += 1
    if (correct) byCategory[category].correct += 1
  }
  return Object.entries(byCategory).map(([category, { correct, total }]) => ({
    category,
    pct: Math.round((correct / total) * 100),
  }))
}

export default function DiagnosticResult({ answers, onContinue }) {
  const scores = scoreByCategory(answers).sort((a, b) => a.pct - b.pct)
  const weakest = scores[0]

  return (
    <PhoneFrame label="Resultado do diagnóstico">
      <div className={styles.wrap}>
        <h1 className={styles.title}>Seu mapa inicial</h1>

        <div className={styles.list}>
          {scores.map((s) => (
            <div key={s.category} className={styles.row}>
              <div className={styles.rowHead}>
                <span className={styles.rowLabel}>{s.category}</span>
                <span className={s.pct < 60 ? styles.rowPctBad : styles.rowPctGood}>{s.pct}%</span>
              </div>
              <div className={styles.bar}>
                <div
                  className={s.pct < 60 ? styles.barFillBad : styles.barFillGood}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cta} onClick={() => onContinue(weakest?.category)}>
            COMEÇAR PELO QUE MAIS PRECISA
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

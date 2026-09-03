import PhoneFrame from '../components/PhoneFrame'
import BottomNav from '../components/BottomNav'
import styles from './Home.module.css'

export default function Home({
  readinessPct = 72,
  readinessLabel = 'QUASE LÁ',
  focusCategory = 'Preferência em cruzamentos',
  strong = { label: 'Sinalização', pct: 88 },
  weak = { label: 'Infrações', pct: 52 },
  lastSimulado = null,
  onContinue,
  onOpenMacetes,
  onNavigate,
}) {
  return (
    <PhoneFrame statusBarRight="3 DIAS SEGUIDOS" label="Home · indicador de preparo no topo">
      <header className={styles.readiness}>
        <div className={styles.kicker}>Bom dia, Camila</div>
        <div className={styles.kicker}>Estou pronto?</div>
        <div className={styles.status}>
          <span className={styles.statusLabel}>{readinessLabel}</span>
          <span className={styles.statusPct}>{readinessPct}%</span>
        </div>
        <div className={styles.bar}>
          <div className={styles.barFill} style={{ width: `${readinessPct}%` }} />
        </div>
        <p className={styles.statusNote}>
          Você vai bem. Falta revisar <strong>{weak.label.toLowerCase()}</strong>.
        </p>
      </header>

      <section className={styles.continue}>
        <div className={styles.eyebrow}>Continue estudando</div>
        <h2 className={styles.continueTitle}>{focusCategory}</h2>
        <div className={styles.continueMeta}>7 min restantes</div>
        <button type="button" className={styles.cta} onClick={onContinue}>
          CONTINUAR
        </button>
      </section>

      <div className={styles.rule} />

      <section className={styles.stats}>
        <div className={`${styles.stat} ${styles.statGood}`}>
          <div className={styles.statLabel}>Ponto forte</div>
          <div className={styles.statTitle}>{strong.label}</div>
          <div className={styles.statValueGood}>{strong.pct}%</div>
        </div>
        <div className={`${styles.stat} ${styles.statBad}`}>
          <div className={styles.statLabelBad}>Reforçar</div>
          <div className={styles.statTitle}>{weak.label}</div>
          <div className={styles.statValueBad}>{weak.pct}%</div>
        </div>
      </section>

      <section className={styles.lastRun}>
        {lastSimulado ? (
          <button type="button" className={styles.lastRunCard} onClick={() => onNavigate('simulado')}>
            <div>
              <div className={styles.eyebrow}>Último simulado</div>
              <div className={styles.lastRunValue}>
                {lastSimulado.correct} / {lastSimulado.total}
              </div>
            </div>
            <div className={styles.lastRunBadge}>REFAZER</div>
          </button>
        ) : (
          <button type="button" className={styles.lastRunCard} onClick={() => onNavigate('simulado')}>
            <div>
              <div className={styles.eyebrow}>Nenhum simulado ainda</div>
              <div className={styles.lastRunValue}>Fazer meu primeiro simulado</div>
            </div>
            <div className={styles.lastRunBadge}>COMEÇAR</div>
          </button>
        )}
        <button type="button" className={styles.macetesLink} onClick={onOpenMacetes}>
          🪙 Meus Macetes
        </button>
      </section>

      <BottomNav active="inicio" onNavigate={onNavigate} />
    </PhoneFrame>
  )
}

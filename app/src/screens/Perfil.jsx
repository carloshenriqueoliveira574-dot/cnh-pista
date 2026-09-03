import PhoneFrame from '../components/PhoneFrame'
import BottomNav from '../components/BottomNav'
import styles from './Perfil.module.css'

export default function Perfil({
  readinessPct,
  macetesCount,
  simuladosCount,
  premium,
  onOpenMacetes,
  onSignOut,
  onNavigate,
}) {
  return (
    <PhoneFrame label="Perfil">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.avatar}>C</div>
          <div>
            <div className={styles.name}>Camila</div>
            <div className={styles.email}>camila@email.com</div>
          </div>
          {premium && <div className={styles.premiumBadge}>PREMIUM</div>}
        </header>

        <div className={styles.rule} />

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{readinessPct}%</div>
            <div className={styles.statLabel}>Preparo</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{macetesCount}</div>
            <div className={styles.statLabel}>Macetes</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{simuladosCount}</div>
            <div className={styles.statLabel}>Simulados</div>
          </div>
        </div>

        <div className={styles.rule} />

        <button type="button" className={styles.row} onClick={onOpenMacetes}>
          🪙 Meus Macetes
        </button>

        <div className={styles.spacer} />

        <button type="button" className={styles.signOut} onClick={onSignOut}>
          Sair
        </button>

        <BottomNav active="perfil" onNavigate={onNavigate} />
      </div>
    </PhoneFrame>
  )
}

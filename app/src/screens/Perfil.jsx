import PhoneFrame from '../components/PhoneFrame'
import BottomNav from '../components/BottomNav'
import styles from './Perfil.module.css'

export default function Perfil({
  readinessPct,
  macetesCount,
  simuladosCount,
  premium,
  userEmail,
  displayName,
  onOpenMacetes,
  onSignOut,
  onNavigate,
  onSubscribe,
  checkoutLoading,
  checkoutError,
}) {
  const name = displayName || userEmail?.split('@')[0] || 'Você'
  return (
    <PhoneFrame label="Perfil">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.avatar}>{name.charAt(0).toUpperCase()}</div>
          <div>
            <div className={styles.name}>{name}</div>
            <div className={styles.email}>{userEmail}</div>
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

        {!premium && (
          <>
            <button type="button" className={styles.upgrade} onClick={onSubscribe} disabled={checkoutLoading}>
              {checkoutLoading ? 'Abrindo pagamento...' : '⭐ Assinar Premium · R$ 19,90/mês'}
            </button>
            {checkoutError && <p className={styles.error}>{checkoutError}</p>}
          </>
        )}

        <div className={styles.spacer} />

        <button type="button" className={styles.signOut} onClick={onSignOut}>
          Sair
        </button>

        <BottomNav active="perfil" onNavigate={onNavigate} />
      </div>
    </PhoneFrame>
  )
}

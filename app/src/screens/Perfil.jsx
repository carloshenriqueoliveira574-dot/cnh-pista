import { useState } from 'react'
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
  onCancelSubscription,
  cancelLoading,
  cancelError,
  onOpenPrivacidade,
  onOpenTermos,
}) {
  const name = displayName || userEmail?.split('@')[0] || 'Você'
  const [confirmingCancel, setConfirmingCancel] = useState(false)
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

        {premium && !confirmingCancel && (
          <button type="button" className={styles.cancel} onClick={() => setConfirmingCancel(true)}>
            Cancelar assinatura
          </button>
        )}

        {premium && confirmingCancel && (
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              Tem certeza? Você perde o acesso Premium imediatamente e a cobrança recorrente é encerrada.
            </p>
            <button type="button" className={styles.cancel} onClick={onCancelSubscription} disabled={cancelLoading}>
              {cancelLoading ? 'Cancelando...' : 'Sim, cancelar assinatura'}
            </button>
            <button type="button" className={styles.row} onClick={() => setConfirmingCancel(false)} disabled={cancelLoading}>
              Manter assinatura
            </button>
            {cancelError && <p className={styles.error}>{cancelError}</p>}
          </div>
        )}

        <button type="button" className={styles.row} onClick={onOpenPrivacidade}>
          🔒 Política de Privacidade
        </button>

        <button type="button" className={styles.row} onClick={onOpenTermos}>
          📄 Termos de Uso
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

import styles from './BottomNav.module.css'

const ITEMS = [
  { key: 'inicio', label: 'Início' },
  { key: 'estudar', label: 'Estudar' },
  { key: 'simulado', label: 'Simulado' },
  { key: 'revisar', label: 'Revisar' },
  { key: 'perfil', label: 'Perfil' },
]

export default function BottomNav({ active = 'inicio', onNavigate }) {
  return (
    <nav className={styles.nav}>
      {ITEMS.map((item) => {
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            type="button"
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => onNavigate?.(item.key)}
          >
            <span className={styles.icon} />
            {item.label.toUpperCase()}
          </button>
        )
      })}
    </nav>
  )
}

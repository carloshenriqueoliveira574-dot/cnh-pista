import styles from './ReadinessGauge.module.css'

const R = 84
const CX = 100
const CY = 96
const ARC_LEN = Math.PI * R

function zoneColor(pct) {
  if (pct >= 80) return 'var(--color-success)'
  if (pct >= 50) return 'var(--color-accent)'
  return 'var(--color-error)'
}

function tickPoint(pct, radius) {
  const angle = Math.PI - (pct / 100) * Math.PI
  return {
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  }
}

export default function ReadinessGauge({ pct, label }) {
  const clamped = Math.max(0, Math.min(100, pct))
  const color = zoneColor(clamped)
  const filled = (clamped / 100) * ARC_LEN
  const ticks = [0, 50, 80, 100]

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 200 112" className={styles.svg} role="img" aria-label={`Preparo: ${clamped}%, ${label}`}>
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          className={styles.track}
          fill="none"
        />
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${ARC_LEN}`}
          className={styles.fill}
        />
        {ticks.map((t) => {
          const inner = tickPoint(t, R - 14)
          const outer = tickPoint(t, R - 6)
          return (
            <line
              key={t}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              className={styles.tick}
            />
          )
        })}
      </svg>
      <div className={styles.readout}>
        <span className={styles.pct}>{clamped}%</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  )
}

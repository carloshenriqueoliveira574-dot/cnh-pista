import PhoneFrame from '../../components/PhoneFrame'
import styles from './OnboardingStep.module.css'

export default function OnboardingStep({ step, total, title, options, selected, onSelect, onNext, ctaLabel, label }) {
  return (
    <PhoneFrame label={label}>
      <div className={styles.wrap}>
        <div className={styles.progress}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`${styles.tick} ${i < step ? styles.tickDone : ''}`} />
          ))}
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.options}>
          {options.map((opt) => {
            const isSelected = opt.value === selected
            return (
              <button
                key={opt.value}
                type="button"
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                onClick={() => onSelect(opt.value)}
                aria-pressed={isSelected}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cta} onClick={onNext} disabled={!selected}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

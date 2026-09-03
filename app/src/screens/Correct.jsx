import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import styles from './Correct.module.css'

export default function Correct({ question, onContinue }) {
  const [open, setOpen] = useState(false)

  return (
    <PhoneFrame label="Acerto">
      <header className={styles.header}>
        <div className={styles.check}>✔</div>
        <h2 className={styles.title}>Você acertou.</h2>
      </header>

      <div className={styles.body}>
        <button
          type="button"
          className={styles.disclosure}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span>Por que?</span>
          <span className={styles.disclosureIcon}>{open ? '−' : '+'}</span>
        </button>

        {open && (
          <p className={styles.explain}>
            {question.explanation}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.confirm} onClick={onContinue}>
          CONTINUAR
        </button>
      </div>
    </PhoneFrame>
  )
}

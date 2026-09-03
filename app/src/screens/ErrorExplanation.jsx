import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import IntersectionScene from './IntersectionScene'
import GenericScene from './GenericScene'
import styles from './ErrorExplanation.module.css'

export default function ErrorExplanation({ question, selectedIndex, onContinue }) {
  const [open, setOpen] = useState(false)

  const wrongOptions = question.options
    .map((text, i) => ({ letter: String.fromCharCode(65 + i), text, i }))
    .filter(({ i }) => i !== question.correctIndex)

  return (
    <PhoneFrame label="Erro + explicação visual">
      <header className={styles.header}>
        <div className={styles.eyebrow}>Você marcou {String.fromCharCode(65 + selectedIndex)}</div>
        <h2 className={styles.title}>Quase. Olha isso.</h2>
      </header>

      <div className={styles.scene}>
        {question.scene === 'intersection' ? (
          <IntersectionScene danger />
        ) : (
          <GenericScene danger variant={question.sceneVariant} />
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.lead}>
          Você marcou “{question.options[selectedIndex]}”. {question.lead}
        </p>
        <div className={styles.rule} />
        <div className={styles.eyebrow}>Entenda</div>
        <p className={styles.explain}>{question.explanation}</p>
        <div className={styles.trap}>
          <div className={styles.trapLabel}>Pegadinha</div>
          <div className={styles.trapText}>{question.trap}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.disclosure}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span>Por que as outras estão erradas?</span>
          <span className={styles.disclosureIcon}>{open ? '−' : '+'}</span>
        </button>

        {open && (
          <ul className={styles.wrongList}>
            {wrongOptions.map((opt) => (
              <li key={opt.letter} className={styles.wrongItem}>
                <span className={styles.wrongLetter}>{opt.letter}</span>
                <div>
                  <div className={styles.wrongText}>{opt.text}</div>
                  <div className={styles.wrongNote}>{question.wrongNotes[opt.i]}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.confirmWrap}>
          <button type="button" className={styles.confirm} onClick={onContinue}>
            ENTENDI, CONTINUAR
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

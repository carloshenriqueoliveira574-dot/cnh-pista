import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import IntersectionScene from './IntersectionScene'
import GenericScene from './GenericScene'
import styles from './Question.module.css'

export default function Question({ question, sessionIndex, sessionTotal, onConfirm }) {
  const [selected, setSelected] = useState(null)

  return (
    <PhoneFrame label={`Questão · ${question.category}`}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span>{question.category}</span>
          <span>
            {sessionIndex + 1} / {sessionTotal}
          </span>
        </div>
        <div className={styles.progress}>
          {Array.from({ length: sessionTotal }, (_, i) => (
            <div key={i} className={`${styles.tick} ${i <= sessionIndex ? styles.tickDone : ''}`} />
          ))}
        </div>
      </header>

      <div className={styles.body}>
        <p className={styles.prompt}>{question.prompt}</p>

        <div className={styles.scene}>
          {question.scene === 'intersection' ? (
            <IntersectionScene />
          ) : (
            <GenericScene variant={question.sceneVariant} />
          )}
        </div>

        <div className={styles.options}>
          {question.options.map((text, i) => {
            const isSelected = i === selected
            return (
              <button
                key={i}
                type="button"
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                <span className={styles.optionText}>{text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.confirm}
          disabled={selected === null}
          onClick={() => onConfirm(selected)}
        >
          CONFIRMAR
        </button>
      </div>
    </PhoneFrame>
  )
}

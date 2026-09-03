import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import IntersectionScene from './IntersectionScene'
import GenericScene from './GenericScene'
import { pickUnique } from '../data/questions'
import styles from './Diagnostic.module.css'

const TOTAL = 10

export default function Diagnostic({ onComplete, pool }) {
  const [started, setStarted] = useState(false)
  const [set] = useState(() => pickUnique(TOTAL, pool))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [flash, setFlash] = useState(null)

  if (!started) {
    return (
      <PhoneFrame label="Diagnóstico · intro">
        <div className={styles.intro}>
          <h1 className={styles.introTitle}>Vamos descobrir onde você está.</h1>
          <p className={styles.introMeta}>10 perguntas · ~4 minutos</p>
          <p className={styles.introNote}>Sem certo ou errado na hora — só depois, no seu mapa inicial.</p>
          <button type="button" className={styles.cta} onClick={() => setStarted(true)}>
            COMEÇAR
          </button>
        </div>
      </PhoneFrame>
    )
  }

  const question = set[index]

  function pick(optionIndex) {
    if (flash !== null) return
    setFlash(optionIndex)
    const isCorrect = optionIndex === question.correctIndex
    const nextAnswers = [...answers, { category: question.category, correct: isCorrect }]
    setTimeout(() => {
      setFlash(null)
      if (index + 1 >= TOTAL) {
        onComplete(nextAnswers)
      } else {
        setAnswers(nextAnswers)
        setIndex(index + 1)
      }
    }, 260)
  }

  return (
    <PhoneFrame label={`Diagnóstico · ${index + 1} de ${TOTAL}`}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span>Diagnóstico</span>
          <span>
            {index + 1} / {TOTAL}
          </span>
        </div>
        <div className={styles.progress}>
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className={`${styles.tick} ${i <= index ? styles.tickDone : ''}`} />
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
          {question.options.map((text, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.option} ${flash === i ? styles.optionFlash : ''}`}
              onClick={() => pick(i)}
            >
              <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.text}>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}

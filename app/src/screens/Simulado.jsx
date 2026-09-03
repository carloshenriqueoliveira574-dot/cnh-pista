import { useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import { pickUnique } from '../data/questions'
import styles from './Simulado.module.css'

const TOTAL = 20

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function Simulado({ onComplete, pool }) {
  const [started, setStarted] = useState(false)
  const [set] = useState(() => pickUnique(TOTAL, pool))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(t)
  }, [startTime])

  if (!started) {
    return (
      <PhoneFrame label="Simulado · intro">
        <div className={styles.intro}>
          <div className={styles.introKicker}>Modo simulado</div>
          <h1 className={styles.introTitle}>Agora é prova.</h1>
          <p className={styles.introNote}>
            {TOTAL} questões, sem macetes, sem explicações e sem feedback até o final.
          </p>
          <button
            type="button"
            className={styles.cta}
            onClick={() => {
              setStartTime(Date.now())
              setStarted(true)
            }}
          >
            COMEÇAR SIMULADO
          </button>
        </div>
      </PhoneFrame>
    )
  }

  const question = set[index]
  const isLast = index === set.length - 1

  function finish(finalAnswers) {
    onComplete({ answers: finalAnswers, elapsedSeconds: elapsed })
  }

  function next() {
    const withThis = [...answers, { id: question.id, category: question.category, correct: selected === question.correctIndex }]
    if (isLast) {
      finish(withThis)
    } else {
      setAnswers(withThis)
      setIndex(index + 1)
      setSelected(null)
    }
  }

  function finishEarly() {
    const withThis =
      selected !== null
        ? [...answers, { id: question.id, category: question.category, correct: selected === question.correctIndex }]
        : answers
    finish(withThis)
  }

  return (
    <PhoneFrame label={`Simulado · ${index + 1} de ${set.length}`}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span>
            Questão {index + 1}/{set.length}
          </span>
          <span className={styles.timer}>{formatTime(elapsed)}</span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${((index + 1) / set.length) * 100}%` }} />
        </div>
      </header>

      <div className={styles.body}>
        <p className={styles.prompt}>{question.prompt}</p>

        <div className={styles.options}>
          {question.options.map((text, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.option} ${selected === i ? styles.optionSelected : ''}`}
              onClick={() => setSelected(i)}
            >
              <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.text}>{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.finishLink} onClick={finishEarly}>
          Finalizar prova agora
        </button>
        <button type="button" className={styles.confirm} disabled={selected === null} onClick={next}>
          {isLast ? 'FINALIZAR PROVA' : 'PRÓXIMA'}
        </button>
      </div>
    </PhoneFrame>
  )
}

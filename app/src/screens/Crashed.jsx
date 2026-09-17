import PhoneFrame from '../components/PhoneFrame'
import styles from './Crashed.module.css'

export default function Crashed({ resetError }) {
  function handleReload() {
    resetError()
    window.location.reload()
  }

  return (
    <PhoneFrame label="Ops">
      <div className={styles.wrap}>
        <div className={styles.emoji}>😕</div>
        <h1 className={styles.title}>Algo deu errado</h1>
        <p className={styles.text}>
          Tivemos um erro inesperado aqui. Já registramos o problema. Tente recarregar — na maioria das vezes
          resolve.
        </p>
        <button type="button" className={styles.cta} onClick={handleReload}>
          RECARREGAR
        </button>
      </div>
    </PhoneFrame>
  )
}

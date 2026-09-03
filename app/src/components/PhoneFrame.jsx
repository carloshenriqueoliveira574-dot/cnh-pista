import styles from './PhoneFrame.module.css'

export default function PhoneFrame({ children, statusBarRight, label }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <div className={styles.statusBar}>
          <span>9:41</span>
          <span>{statusBarRight}</span>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      {label && <figcaption className={styles.caption}>{label}</figcaption>}
    </figure>
  )
}

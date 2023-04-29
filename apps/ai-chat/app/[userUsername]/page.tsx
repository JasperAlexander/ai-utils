import styles from './page.module.css'

export default function Page({ params }: { params: { userUsername: string } }) {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{params.userUsername}</h2>
    </div>
  )
}

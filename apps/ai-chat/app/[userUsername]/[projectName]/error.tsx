'use client'

import styles from './page.module.css'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <h2 className={styles.title}>Something went wrong!</h2>
        <button onClick={() => reset()} className={styles.primaryButton}>
          Try again
        </button>
      </div>
    </main>
  )
}

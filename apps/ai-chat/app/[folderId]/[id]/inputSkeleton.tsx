import styles from './page.module.css'

export function InputSkeleton() {
  return (
    <div className={styles.inputContainer}>
      <textarea
        className={styles.inputTextarea}
        placeholder='Type and/or drop files here...'
      />
      <button type='button' className={styles.inputSubmitButton}>
        <svg
          className={styles.inputSubmitButtonSvg}
          strokeWidth='2'
          viewBox='0 0 24 24'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='22' y1='2' x2='11' y2='13'></line>
          <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
        </svg>
      </button>
    </div>
  )
}

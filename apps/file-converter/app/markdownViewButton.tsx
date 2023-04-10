'use client'

import { Dispatch, SetStateAction } from 'react'
import { Tooltip } from 'react-tooltip'
import styles from './page.module.css'
import 'react-tooltip/dist/react-tooltip.css'

export function MarkdownViewButton({
  showMarkdown,
  setShowMarkdown,
}: {
  showMarkdown: boolean
  setShowMarkdown: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <button
      type='button'
      className={`${styles.textHeaderButton} ${
        showMarkdown && styles.textHeaderButtonActive
      }`}
      onClick={() => {
        if (showMarkdown) {
          setShowMarkdown(false)
        } else {
          setShowMarkdown(true)
        }
      }}
      data-tooltip-id='markdown-tooltip'
    >
      <svg
        viewBox='0 0 16 16'
        className={styles.textHeaderButtonSvg}
        style={{ scale: 1.4 }}
      >
        <g strokeLinecap='round' strokeLinejoin='round' />
        <g>
          <path d='M6.345 5h2.1v6.533H6.993l.055-5.31-1.774 5.31H4.072l-1.805-5.31c.04.644.06 5.31.06 5.31H1V5h2.156s1.528 4.493 1.577 4.807L6.345 5zm6.71 3.617v-3.5H11.11v3.5H9.166l2.917 2.916L15 8.617h-1.945z'></path>
        </g>
      </svg>
      <Tooltip
        id='markdown-tooltip'
        content={'Toggle markdown view'}
        place='bottom'
        className={styles.tooltip}
      />
    </button>
  )
}

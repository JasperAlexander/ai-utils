'use client'

import styles from './page.module.css'
import { Tooltip } from 'react-tooltip'
import { Fragment, useCallback, useEffect, useState } from 'react'

export function CopyMessageButton({
  localMessageId,
  contentWithoutFileNames,
}: {
  localMessageId: string
  contentWithoutFileNames: string
}) {
  const [copiedFilesText, setCopiedFilesText] = useState(false)
  const [copiedFilesTextError, setCopiedFilesTextError] = useState(false)

  const copyFilesText = useCallback(() => {
    if (!contentWithoutFileNames) {
      setCopiedFilesTextError(true)
      return
    }
    navigator.clipboard.writeText(contentWithoutFileNames)
    setCopiedFilesText(true)
  }, [contentWithoutFileNames])

  useEffect(() => {
    if (copiedFilesText) {
      const timer = setTimeout(() => {
        setCopiedFilesText(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (copiedFilesTextError) {
      const timer = setTimeout(() => {
        setCopiedFilesTextError(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [copiedFilesText, copiedFilesTextError])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => copyFilesText()}
        className={`
        ${styles.messageHeaderButton}
        ${copiedFilesText && styles.copyButtonActive}
        ${copiedFilesTextError && styles.copyButtonError}`}
        data-tooltip-id={`copy-tooltip-${localMessageId}`}
      >
        {copiedFilesText ? (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.messageHeaderButtonSvg}
          >
            <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
          </svg>
        ) : copiedFilesTextError ? (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.messageHeaderButtonSvg}
          >
            <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
          </svg>
        ) : (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.messageHeaderButtonSvg}
          >
            <path d='M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z'></path>
            <path d='M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z'></path>
          </svg>
        )}
      </button>
      <Tooltip
        id={`copy-tooltip-${localMessageId}`}
        content={
          copiedFilesText
            ? 'Copied!'
            : copiedFilesTextError
            ? 'Copying failed'
            : 'Copy plain text'
        }
        place='bottom'
      />
    </Fragment>
  )
}

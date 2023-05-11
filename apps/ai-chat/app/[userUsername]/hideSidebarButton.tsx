'use client'

import styles from './page.module.css'
import { Fragment, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'

export function HideSidebarButton() {
  const [documentReady, setDocumentReady] = useState(false)

  useEffect(() => {
    const onReady = () => setDocumentReady(true)

    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      onReady()
    } else {
      document.addEventListener('DOMContentLoaded', onReady)
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', onReady)
    }
  }, [])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => {
          if (
            !documentReady ||
            document.getElementById('sidebar') === null ||
            document.getElementById('sidebarButtonOn') === null
          )
            return
          document.getElementById('sidebar')!.style.display = 'none'
          document.getElementById('sidebarButtonOn')!.style.display = 'flex'
        }}
        className={styles.hideSidebarButton}
        data-tooltip-id={'hidesidebar-tooltip'}
      >
        <svg
          aria-hidden='true'
          viewBox='0 0 16 16'
          className={styles.hideSidebarButtonSvg}
        >
          <path d='m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z'></path>
          <path d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z'></path>
        </svg>
      </button>
      <Tooltip
        id={'hidesidebar-tooltip'}
        content={'Hide sidebar'}
        place='bottom'
      />
    </Fragment>
  )
}

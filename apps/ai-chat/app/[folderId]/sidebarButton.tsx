'use client'

import styles from './page.module.css'
import { Tooltip } from 'react-tooltip'
import { Fragment, useEffect, useRef, useState } from 'react'

export function SidebarButton() {
  const sidebarButtonOn = useRef<HTMLButtonElement>(null)

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
            !document.getElementById('sidebar') ||
            !sidebarButtonOn.current
          )
            return
          document.getElementById('sidebar')!.style.display = 'flex'
          sidebarButtonOn.current.style.display = 'none'
        }}
        className={styles.sidebarOpenButton}
        ref={sidebarButtonOn}
        id='sidebarButtonOn'
        data-tooltip-id={'showsidebar-tooltip'}
      >
        <svg
          aria-hidden='true'
          viewBox='0 0 16 16'
          className={styles.sidebarOpenButtonSvg}
        >
          <path d='M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z'></path>
          <path d='M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z'></path>
        </svg>
      </button>
      <Tooltip
        id={'showsidebar-tooltip'}
        content={'Show sidebar'}
        place='bottom'
      />
    </Fragment>
  )
}

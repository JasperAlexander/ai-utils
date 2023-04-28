'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'

export function Resizer() {
  const [isResizing, setIsResizing] = useState(false)
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || document.getElementById('sidebar') === null) return
      const newWidth =
        e.clientX - document.getElementById('sidebar')!.offsetLeft
      document
        .getElementById('sidebar')!
        .style.setProperty('--pane-width', newWidth + 'px')
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'auto'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <div
      className={styles.resizer}
      onMouseDown={() => {
        setIsResizing(true)
        if (documentReady) document.body.style.cursor = 'col-resize'
      }}
    />
  )
}

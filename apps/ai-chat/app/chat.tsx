'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { DragEvent } from 'react'
import { useParams } from 'next/navigation'

export function Chat({
  id,
  folderId,
  title,
}: {
  id: string
  folderId: string | undefined
  title: string
}) {
  const params = useParams()

  function onDragStart(chatId: string) {
    // Implement any visual effect or state update while dragging
  }

  const handleDragStart = (e: DragEvent<HTMLLIElement>) => {
    e.dataTransfer.setData('chatId', id)
    onDragStart(id)
  }

  return (
    <li
      className={styles.chat}
      draggable
      onDragStart={handleDragStart}
      aria-current={params?.id === id ? 'true' : 'false'}
    >
      {folderId && <div className={styles.spacer} />}
      <div className={styles.chatButton} />
      <Link href={`/${folderId}/${id}`} className={styles.chatLink}>
        <svg viewBox='0 0 16 16' className={styles.chatLinkSvg}>
          <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
        </svg>
        <span className={styles.chatTitle}>{title}</span>
      </Link>
    </li>
  )
}

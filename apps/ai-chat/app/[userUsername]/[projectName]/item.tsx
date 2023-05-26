'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { DragEvent } from 'react'
import { useParams } from 'next/navigation'
import { ItemType } from '@/types'

export function Item({ item }: { item: ItemType }) {
  const params = useParams()

  const onDragStart = (e: DragEvent<HTMLLIElement>) => {
    e.dataTransfer.setData('itemId', item._id)
    e.dataTransfer.setData('folderId', item.folder_id)
    e.dataTransfer.dropEffect = 'move'
  }

  return (
    <li
      className={styles.chat}
      draggable={true}
      onDragStart={onDragStart}
      aria-current={params?.id === item._id ? 'true' : 'false'}
    >
      {item.folder_id && <div className={styles.spacer} />}
      <div className={styles.chatButton} />
      <Link
        href={`/${params.userUsername}/${params.projectName}/${item.folder_id}/${item._id}`}
        className={styles.chatLink}
      >
        {item.type === 'chat' ? (
          <svg viewBox='0 0 16 16' className={styles.chatLinkSvg}>
            <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
          </svg>
        ) : (
          <svg viewBox='0 0 16 16' className={styles.chatLinkSvg}>
            <path d='M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z'></path>
          </svg>
        )}
        <span className={styles.chatTitle}>{item.title}</span>
      </Link>
    </li>
  )
}

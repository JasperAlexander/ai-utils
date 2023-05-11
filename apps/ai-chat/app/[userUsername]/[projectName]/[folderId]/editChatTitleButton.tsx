'use client'

import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { ChatType } from '@/types'
import { Tooltip } from 'react-tooltip'

export function EditChatTitleButton({ chat }: { chat: ChatType }) {
  const router = useRouter()

  const [editingChatTitle, setEditingChatTitle] = useState(false)
  const [tempChatTitle, setTempChatTitle] = useState(chat.title)

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => {
          if (editingChatTitle) {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats/${chat._id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                title: tempChatTitle,
              }),
            })
          }
          setEditingChatTitle(!editingChatTitle)
          router.refresh()
        }}
        className={`${styles.chatEditButton} ${
          editingChatTitle && styles.chatEditButtonActive
        }`}
        data-tooltip-id={`editchatname-tooltip-${chat._id}`}
      >
        {editingChatTitle ? (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.chatEditButtonSvg}
          >
            <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
          </svg>
        ) : (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.chatEditButtonSvg}
          >
            <path d='M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z'></path>
          </svg>
        )}
      </button>
      <Tooltip
        id={`editchatname-tooltip-${chat._id}`}
        content={editingChatTitle ? 'Save chat name' : 'Edit chat name'}
        place='bottom'
      />
    </Fragment>
  )
}

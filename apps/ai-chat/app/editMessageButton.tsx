'use client'

import { Dispatch, SetStateAction, useId } from 'react'
import { Tooltip } from 'react-tooltip'
import { ChatMessage } from '@/types'
import styles from './page.module.css'
import 'react-tooltip/dist/react-tooltip.css'

export function EditMessageButton({
  content,
  role,
  editingMessage,
  setEditingMessage,
  newMessageContent,
  setAIMessages,
  setLocalMessages,
}: {
  content: string
  role: string
  editingMessage: boolean
  setEditingMessage: Dispatch<SetStateAction<boolean>>
  newMessageContent: string
  setAIMessages: Dispatch<SetStateAction<ChatMessage[]>>
  setLocalMessages: Dispatch<SetStateAction<ChatMessage[]>>
}) {
  const id = useId()

  return (
    <button
      type='button'
      onClick={() => {
        if (editingMessage) {
          setAIMessages((aiMessages) =>
            aiMessages.map((message) => {
              if (message.content === content && message.role === role) {
                return {
                  ...message,
                  content: newMessageContent,
                }
              }
              return message
            })
          )
          setLocalMessages((localMessages) =>
            localMessages.map((message) => {
              if (message.content === content && message.role === role) {
                return {
                  ...message,
                  content: newMessageContent,
                }
              }
              return message
            })
          )
          setEditingMessage(false)
        } else {
          setEditingMessage(true)
        }
      }}
      className={`
        ${styles.messageHeaderButton}
        ${editingMessage && styles.editMsgButtonActive}`}
      data-tooltip-id={`edit-tooltip-${id}`}
    >
      {editingMessage ? (
        <svg
          aria-hidden='true'
          viewBox='0 0 16 16'
          className={styles.messageHeaderButtonSvg}
        >
          <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
        </svg>
      ) : (
        <svg
          aria-hidden='true'
          viewBox='0 0 16 16'
          className={styles.messageHeaderButtonSvg}
        >
          <path d='M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z'></path>
        </svg>
      )}
      <Tooltip
        id={`edit-tooltip-${id}`}
        content={editingMessage ? 'Save message' : 'Edit message'}
        place='bottom'
        className={styles.tooltip}
        classNameArrow={styles.tooltipArrow}
      />
    </button>
  )
}

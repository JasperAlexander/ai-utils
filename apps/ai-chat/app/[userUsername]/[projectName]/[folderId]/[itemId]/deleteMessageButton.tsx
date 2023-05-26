'use client'

import styles from './page.module.css'
import { Tooltip } from 'react-tooltip'
import { Fragment, useEffect, useRef, useState } from 'react'
import { MessageType } from '@/types'
import { deleteMessageOfMessageTree } from '@/utils/deleteMessageOfMessageTree'

export function DeleteMessageButton({
  localMessage,
  localMessagesTree,
  setLocalMessagesTree,
  handleSiblingSwitch,
  selectedChildIndices,
}: {
  localMessage: MessageType
  localMessagesTree: MessageType[]
  setLocalMessagesTree: (newMessagesTree: MessageType[]) => void
  handleSiblingSwitch: (parentId: string, index: number) => void
  selectedChildIndices: {
    [id: string]: number
  }
}) {
  const [removeMessage, setRemoveMessage] = useState(false)

  const removeChatTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (removeMessage) {
      const timer = setTimeout(() => {
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${localMessage._id}`,
          {
            method: 'DELETE',
          }
        )

        if (localMessage.parent) {
          const childIndex = selectedChildIndices[localMessage.parent as string]
          handleSiblingSwitch(localMessage.parent as string, childIndex - 1)
        }

        let newMessagesTree = [...localMessagesTree]
        deleteMessageOfMessageTree(newMessagesTree, localMessage._id)
        setLocalMessagesTree(newMessagesTree)

        setRemoveMessage(false)
      }, 5000)

      removeChatTimer.current = timer
      return () => clearTimeout(removeChatTimer.current || undefined)
    }
  }, [
    removeMessage,
    localMessage._id,
    localMessage.parent,
    selectedChildIndices,
    handleSiblingSwitch,
    localMessagesTree,
    setLocalMessagesTree,
    removeChatTimer,
  ])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => {
          if (removeMessage) {
            clearTimeout(removeChatTimer.current || undefined)
            setRemoveMessage(false)
          } else {
            setRemoveMessage(true)
          }
        }}
        className={`
        ${styles.messageHeaderButton}
        ${removeMessage && styles.rmMsgButtonActive}`}
        data-tooltip-id={`rm-tooltip-${localMessage._id}`}
      >
        {removeMessage ? (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.messageHeaderButtonSvg}
          >
            <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
          </svg>
        ) : (
          <svg
            className={styles.messageHeaderButtonSvg}
            aria-hidden='true'
            viewBox='0 0 16 16'
            data-view-component='true'
          >
            <path d='M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z'></path>
          </svg>
        )}
      </button>
      <Tooltip
        id={`rm-tooltip-${localMessage._id}`}
        content={removeMessage ? 'Cancel within 5 sec' : 'Remove message'}
        place='bottom'
      />
    </Fragment>
  )
}

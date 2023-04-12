'use client'

import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { ChatMessage } from '@/types'
import styles from './page.module.css'
import 'react-tooltip/dist/react-tooltip.css'

export function RmMessageButton({
  content,
  role,
  setAIMessages,
  setLocalMessages,
}: {
  content: string
  role: string
  setAIMessages: Dispatch<SetStateAction<ChatMessage[]>>
  setLocalMessages: Dispatch<SetStateAction<ChatMessage[]>>
}) {
  const id = useId()

  const [removeMessage, setRemoveMessage] = useState(false)

  let timer: NodeJS.Timeout

  useEffect(() => {
    if (removeMessage) {
      timer = setTimeout(() => {
        setAIMessages((aiMessages) =>
          aiMessages.filter(function (msg) {
            return msg.content !== content && msg.role !== role
          })
        )
        setLocalMessages((localMessages) =>
          localMessages.filter(function (msg) {
            return msg.content !== content && msg.role !== role
          })
        )
        setRemoveMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [removeMessage, setRemoveMessage])

  return (
    <button
      type='button'
      onClick={() => {
        if (removeMessage) {
          clearTimeout(timer)
          setRemoveMessage(false)
        } else {
          setRemoveMessage(true)
        }
      }}
      className={`
        ${styles.messageHeaderButton}
        ${removeMessage && styles.rmMsgButtonActive}`}
      data-tooltip-id={`rm-tooltip-${id}`}
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
      <Tooltip
        id={`rm-tooltip-${id}`}
        content={removeMessage ? 'Cancel within 5 sec' : 'Remove message'}
        place='bottom'
        className={styles.tooltip}
        classNameArrow={styles.tooltipArrow}
      />
    </button>
  )
}

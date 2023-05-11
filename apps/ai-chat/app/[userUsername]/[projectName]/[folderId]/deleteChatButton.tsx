'use client'

import styles from './page.module.css'
import { ChatType } from '@/types'
import { Fragment, useState } from 'react'
import { Tooltip } from 'react-tooltip'

export function DeleteChatButton({ chat }: { chat: ChatType }) {
  const [removeChat, setRemoveChat] = useState(false)
  const [removeChatTimer, setRemoveChatTimer] = useState<NodeJS.Timeout>()

  return (
    <Fragment>
      <button
        type='button'
        className={`${styles.chatRemoveButton} ${
          removeChat && styles.chatRemoveButtonActive
        }`}
        onClick={async () => {
          if (removeChat) {
            clearTimeout(removeChatTimer)
            setRemoveChat(false)
          } else {
            setRemoveChat(true)
          }
        }}
        data-tooltip-id={`rmchat-tooltip-${chat._id}`}
      >
        {removeChat ? (
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.chatRemoveButtonSvg}
          >
            <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
          </svg>
        ) : (
          <svg
            className={styles.chatRemoveButtonSvg}
            aria-hidden='true'
            viewBox='0 0 16 16'
            data-view-component='true'
          >
            <path d='M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z'></path>
          </svg>
        )}
      </button>
      <Tooltip
        id={`rmchat-tooltip-${chat._id}`}
        content={removeChat ? 'Cancel within 5 sec' : 'Remove chat'}
        place='bottom'
      />
    </Fragment>
  )
}

'use client'

import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { ChatMessage } from '@/types'
import styles from './page.module.css'
import 'react-tooltip/dist/react-tooltip.css'

export function ResendMessageButton({
  index,
  cookie,
  AIMessages,
  setAIMessages,
  setLocalMessages,
}: {
  index: number
  cookie: any
  AIMessages: ChatMessage[]
  setAIMessages: Dispatch<SetStateAction<ChatMessage[]>>
  setLocalMessages: Dispatch<SetStateAction<ChatMessage[]>>
}) {
  const id = useId()

  const [loading, setLoading] = useState(false)

  return (
    <button
      type='button'
      onClick={async () => {
        setLoading(true)
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiUrl: 'https://api.openai.com/v1/chat/completions',
            user: cookie['ai-chat'],
            model: 'gpt-3.5-turbo',
            prompt: AIMessages.slice(0, -1),
            maxTokens: 32,
            stream: true,
          }),
        })
        if (!response.ok)
          throw new Error(`Error fetching data: ${response.statusText}`)

        const data = response.body
        if (!data) return

        const reader = data.getReader()
        const decoder = new TextDecoder()
        let done = false

        let lastMessage = ''

        while (!done) {
          const { value, done: doneReading } = await reader.read()
          done = doneReading

          if (value) {
            const chunkValue = decoder.decode(value)
            lastMessage = lastMessage + chunkValue
            setAIMessages((AIMessages) => {
              return [
                ...AIMessages.slice(0, index),
                {
                  role: 'assistant',
                  content: lastMessage,
                } as ChatMessage,
              ]
            })
            setLocalMessages((localMessages) => {
              return [
                ...localMessages.slice(0, index + 1),
                {
                  role: 'assistant',
                  content: lastMessage,
                } as ChatMessage,
              ]
            })
          }
        }
        setLoading(false)

        // setAIMessages((AIMessages) => {
        //   return [
        //     ...AIMessages.slice(0, index + 1),
        //     {
        //       role: 'assistant',
        //       content: 'Testing',
        //     } as ChatMessage,
        //   ]
        // })
        // setLocalMessages((localMessages) => {
        //   return [
        //     ...localMessages.slice(0, index + 1),
        //     {
        //       role: 'assistant',
        //       content: 'Testing',
        //     } as ChatMessage,
        //   ]
        // })
      }}
      className={`
        ${styles.messageHeaderButton}`}
      data-tooltip-id={`resend-tooltip-${id}`}
    >
      <svg
        aria-hidden='true'
        viewBox='0 0 16 16'
        className={`${styles.messageHeaderButtonSvg} ${
          loading && styles.resendMsgButtonActive
        }`}
      >
        <path d='M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z'></path>
      </svg>
      <Tooltip
        id={`resend-tooltip-${id}`}
        content={loading ? 'Resending' : 'Resend message'}
        place='bottom'
        className={styles.tooltip}
        classNameArrow={styles.tooltipArrow}
      />
    </button>
  )
}

'use client'

import styles from './page.module.css'
import { findDeepestMessageOfMessagesTree } from '@/utils/findDeepestMessageOfMessagesTree'
import { Tooltip } from 'react-tooltip'
import { findHistoryOfMessagesTree } from '@/utils/findHistoryOfMessagesTree'
import { MessageType } from '@/types'
import { useParams } from 'next/navigation'
import { Fragment, useState } from 'react'
import { insertMessageToMessagesTree } from '@/utils/insertMessageToMessagesTree'
import { updateMessageOfMessagesTree } from '@/utils/updateMessageOfMessagesTree'

export function ResendMessageButton({
  localMessage,
  localMessagesTree,
  setLocalMessagesTree,
  newMessageContent,
  handleSiblingSwitch,
}: {
  localMessage: MessageType
  localMessagesTree: MessageType[]
  setLocalMessagesTree: (newMessagesTree: MessageType[]) => void
  newMessageContent: string
  handleSiblingSwitch: (parentId: string, index: number) => void
}) {
  const params = useParams()

  const [loadingNewMessages, setLoadingNewMessages] = useState(false)

  const resendMessage = async () => {
    setLoadingNewMessages(true)

    const deepestMessageIdOfMessagesTree = findDeepestMessageOfMessagesTree({
      messagesTree: localMessagesTree,
      returnParentOfDeepestMessage: true,
    })
    const history = findHistoryOfMessagesTree(
      localMessagesTree,
      deepestMessageIdOfMessagesTree!
    )

    const getAIMessageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/langchain/call`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newMessageContent,
          folderId: params.folderId,
          history,
        }),
      }
    )

    if (!getAIMessageResponse.ok)
      throw new Error(`Error fetching data: ${getAIMessageResponse.statusText}`)

    const data = getAIMessageResponse.body
    if (!data) return

    const reader = data.getReader()
    const decoder = new TextDecoder()

    let done = false
    let lastMessage = ''

    const postAIMessageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          item_id: params.itemId,
          role: 'assistant',
          content: lastMessage,
          parent: localMessage._id,
        }),
      }
    )
    const AIMessageInsertedId = await postAIMessageResponse.json()

    let messagesTreeWithNewAIMessage = [...localMessagesTree]
    insertMessageToMessagesTree(
      messagesTreeWithNewAIMessage,
      localMessage._id,
      {
        _id: AIMessageInsertedId,
        item_id: params.itemId,
        role: 'assistant',
        content: lastMessage,
        parent: localMessage._id,
        children: [],
        updated_at: new Date().toString(),
        created_at: new Date().toString(),
      }
    )
    setLocalMessagesTree(messagesTreeWithNewAIMessage)
    handleSiblingSwitch(localMessage._id, localMessage.children.length - 1)

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading

      if (value) {
        const chunkValue = decoder.decode(value)
        lastMessage = lastMessage + chunkValue

        let updatedMessagesTreeWithNewAIMessage = [
          ...messagesTreeWithNewAIMessage,
        ]
        updateMessageOfMessagesTree(
          updatedMessagesTreeWithNewAIMessage,
          AIMessageInsertedId,
          lastMessage
        )
        setLocalMessagesTree(updatedMessagesTreeWithNewAIMessage)
      }
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${AIMessageInsertedId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          content: lastMessage,
        }),
      }
    )

    setLoadingNewMessages(false)
  }

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => resendMessage()}
        className={`
        ${styles.messageHeaderButton}`}
        data-tooltip-id={`resend-tooltip-${localMessage._id}`}
        disabled={loadingNewMessages}
      >
        <svg
          aria-hidden='true'
          viewBox='0 0 16 16'
          className={`${styles.messageHeaderButtonSvg} ${
            loadingNewMessages && styles.resendMsgButtonActive
          }`}
        >
          <path d='M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z'></path>
        </svg>
      </button>
      <Tooltip
        id={`resend-tooltip-${localMessage._id}`}
        content={loadingNewMessages ? 'Resending' : 'Resend message'}
        place='bottom'
      />
    </Fragment>
  )
}

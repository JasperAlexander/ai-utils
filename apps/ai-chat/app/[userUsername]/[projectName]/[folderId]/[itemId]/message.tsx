'use client'

import 'highlight.js/styles/github-dark.css'
import styles from './page.module.css'
import hljs from 'highlight.js'
import { marked } from 'marked'
import { extractFileNames } from '@/utils/extractFileNames'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { MessageType } from '@/types'
import { Tooltip } from 'react-tooltip'
import { useParams, useRouter } from 'next/navigation'
import { getSelectedNodes } from '@/utils/getSelectedNodes'
import { useSession } from 'next-auth/react'

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  },
  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
})

export function Message({
  index,
  messageTree,
  data,
  currentUserAllowedToChat,
  messages,
  setMessages,
  selectedChildIndices,
  setSelectedChildIndices,
}: {
  index: number
  messageTree: MessageType[]
  data: MessageType
  currentUserAllowedToChat: boolean
  messages: MessageType[]
  setMessages: (newMessages: MessageType[]) => void
  selectedChildIndices: {
    [id: string]: number
  }
  setSelectedChildIndices: (newSelectedChildIndices: {
    [id: string]: number
  }) => void
}) {
  const params = useParams()
  const router = useRouter()
  const session = useSession()

  const { _id, role, content, parent, children } = data

  const [editingMessage, setEditingMessage] = useState(false)
  const [loadingNewMessages, setLoadingNewMessages] = useState(false)
  const [newMessageContent, setNewMessageContent] = useState(content)
  const [removeMessage, setRemoveMessage] = useState(false)
  const [copiedFilesText, setCopiedFilesText] = useState(false)
  const [copiedFilesTextError, setCopiedFilesTextError] = useState(false)
  const [removeChatTimer, setRemoveChatTimer] = useState<NodeJS.Timeout>()

  const fileNames = extractFileNames(content)
  const selectedIndex = selectedChildIndices?.[_id] || 0
  const selectedChild =
    children && children.length > 0 ? children[selectedIndex] : null

  useEffect(() => {
    if (copiedFilesText) {
      const timer = setTimeout(() => {
        setCopiedFilesText(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (copiedFilesTextError) {
      const timer = setTimeout(() => {
        setCopiedFilesTextError(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [copiedFilesText, copiedFilesTextError])

  useEffect(() => {
    if (removeMessage) {
      const timer = setTimeout(async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/items/${_id}`, {
          method: 'DELETE',
        })
        setRemoveMessage(false)
        setMessages(messages.filter((_, i) => i !== index))
        router.refresh()
      }, 5000)
      setRemoveChatTimer(timer)
      return () => clearTimeout(removeChatTimer)
    }
  }, [
    removeMessage,
    _id,
    setRemoveMessage,
    setMessages,
    messages,
    index,
    router,
    removeChatTimer,
  ])

  const handleSiblingSwitch = (parentId: string, index: number) =>
    setSelectedChildIndices({ ...selectedChildIndices, [parentId]: index })

  const contentWithoutFileNames = content
    .replace(/file [^:]+: """[^"]*"""/g, '')
    .trim()
  const mdContentWithoutFileNames = useMemo(() => {
    return marked.parse(contentWithoutFileNames)
  }, [contentWithoutFileNames])

  const copyFilesText = useCallback(() => {
    if (!contentWithoutFileNames) {
      setCopiedFilesTextError(true)
      return
    }
    navigator.clipboard.writeText(contentWithoutFileNames)
    setCopiedFilesText(true)
  }, [contentWithoutFileNames])

  const resendMessage = async () => {
    setLoadingNewMessages(true)

    // Uncomment the following code to test
    // const newResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/messages`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     item_id: params.itemId,
    //     role: 'assistant',
    //     content: 'Testing',
    //     parent: _id,
    //   }),
    // })
    // const newInsertedId = await newResponse.json()
    // const newMessageArray = [
    //   ...messages,
    //   {
    //     _id: newInsertedId,
    //     item_id: params.itemId,
    //     role: 'assistant',
    //     content: 'Testing',
    //     parent: _id,
    //   },
    // ]
    // setMessages(newMessageArray)
    // handleSiblingSwitch(
    //   _id,
    //   (selectedIndex + 1) % (children.length + 1)
    // )

    // Comment the following code to test
    const selectedNodes = getSelectedNodes(messageTree[0], selectedChildIndices)
    const promptResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/openai`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiUrl: 'https://api.openai.com/v1/chat/completions',
          user: session.data?.user._id,
          model: 'gpt-3.5-turbo',
          prompt: selectedNodes.slice(0, index + 1),
          maxTokens: 32,
          stream: true,
        }),
      }
    )
    if (!promptResponse.ok)
      throw new Error(`Error fetching data: ${promptResponse.statusText}`)

    const openAIData = promptResponse.body
    if (!openAIData) return

    const reader = openAIData.getReader()
    const decoder = new TextDecoder()

    let lastMessage = ''
    let done = false
    let switched = false

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          item_id: params.itemId,
          role: 'assistant',
          content: lastMessage,
          parent: _id,
        }),
      }
    )
    const insertedId = await response.json()

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading

      if (value) {
        const chunkValue = decoder.decode(value)
        lastMessage = lastMessage + chunkValue
        const newMessageArray = [
          ...messages,
          {
            _id: insertedId,
            item_id: params.itemId,
            role: 'assistant',
            content: lastMessage,
            parent: _id,
            children: [],
            updated_at: new Date().toString(),
            created_at: new Date().toString(),
          },
        ]
        setMessages(newMessageArray)
        if (!switched) {
          handleSiblingSwitch(_id, children.length)
          switched = true
        }
      }
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${insertedId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          content: lastMessage,
        }),
      }
    )
    // Comment till here if you want to test

    setLoadingNewMessages(false)
  }

  return (
    <Fragment>
      <div
        className={`${styles.message} ${
          role === 'user' && styles.messageOfUser
        }`}
      >
        <div className={styles.messageHeader}>
          <div className={styles.messageHeaderText}>
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </div>
          <div className={styles.messageHeaderButtons}>
            {children && children.length > 1 && (
              <div className={styles.messageHeaderButtonsBranch}>
                <button
                  onClick={() =>
                    handleSiblingSwitch(
                      _id,
                      (selectedIndex - 1 + children.length) % children.length
                    )
                  }
                  className={styles.messageHeaderButton}
                  data-tooltip-id={`prevmsg-tooltip-${_id}`}
                >
                  <svg
                    viewBox='0 0 16 16'
                    className={styles.messageHeaderButtonSvg}
                  >
                    <path d='M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z'></path>
                  </svg>
                </button>
                <span>{selectedIndex + 1 + '/' + children.length}</span>
                <button
                  onClick={() =>
                    handleSiblingSwitch(
                      _id,
                      (selectedIndex + 1) % children.length
                    )
                  }
                  className={styles.messageHeaderButton}
                  data-tooltip-id={`nextmsg-tooltip-${_id}`}
                >
                  <svg
                    viewBox='0 0 16 16'
                    className={styles.messageHeaderButtonSvg}
                  >
                    <path d='M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z'></path>
                  </svg>
                </button>
              </div>
            )}

            {currentUserAllowedToChat && (
              <Fragment>
                <button
                  type='button'
                  onClick={async () => await resendMessage()}
                  className={`
        ${styles.messageHeaderButton}`}
                  data-tooltip-id={`resend-tooltip-${_id}`}
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

                <button
                  type='button'
                  onClick={async () => {
                    if (editingMessage) {
                      //  PATCH
                      fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${_id}`,
                        {
                          method: 'PATCH',
                          body: JSON.stringify({
                            content: newMessageContent,
                          }),
                        }
                      )
                      setMessages(
                        messages.map((message) => {
                          if (message._id === _id)
                            return {
                              ...message,
                              content: newMessageContent,
                            }

                          return message
                        })
                      )
                      router.refresh()

                      // POST, NOT WORKING YET
                      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/messages`, {
                      //   method: 'POST',
                      //   body: JSON.stringify({
                      //     item_id: params.itemId,
                      //     role: 'user',
                      //     content: newMessageContent,
                      //     parent: parent,
                      //   }),
                      // })
                      // const insertedId = await response.json()
                      // const newMessages = [
                      //   ...messages,
                      //   {
                      //     _id: insertedId,
                      //     item_id: params.itemId,
                      //     role: 'user',
                      //     content: newMessageContent,
                      //     parent: parent,
                      //   },
                      // ]
                      // setMessages(newMessages)
                      // await resendMessage()

                      setEditingMessage(false)
                    } else {
                      setEditingMessage(true)
                    }
                  }}
                  className={`
        ${styles.messageHeaderButton}
        ${editingMessage && styles.editMsgButtonActive}`}
                  data-tooltip-id={`edit-tooltip-${_id}`}
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
                </button>

                <button
                  type='button'
                  onClick={() => {
                    if (removeMessage) {
                      clearTimeout(removeChatTimer)
                      setRemoveMessage(false)
                    } else {
                      setRemoveMessage(true)
                    }
                  }}
                  className={`
        ${styles.messageHeaderButton}
        ${removeMessage && styles.rmMsgButtonActive}`}
                  data-tooltip-id={`rm-tooltip-${_id}`}
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
              </Fragment>
            )}

            <button
              type='button'
              onClick={() => copyFilesText()}
              className={`
        ${styles.messageHeaderButton}
        ${copiedFilesText && styles.copyButtonActive}
        ${copiedFilesTextError && styles.copyButtonError}`}
              data-tooltip-id={`copy-tooltip-${_id}`}
            >
              {copiedFilesText ? (
                <svg
                  aria-hidden='true'
                  viewBox='0 0 16 16'
                  className={styles.messageHeaderButtonSvg}
                >
                  <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
                </svg>
              ) : copiedFilesTextError ? (
                <svg
                  aria-hidden='true'
                  viewBox='0 0 16 16'
                  className={styles.messageHeaderButtonSvg}
                >
                  <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
                </svg>
              ) : (
                <svg
                  aria-hidden='true'
                  viewBox='0 0 16 16'
                  className={styles.messageHeaderButtonSvg}
                >
                  <path d='M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z'></path>
                  <path d='M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z'></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className={styles.messageContent}>
          {editingMessage ? (
            <div
              className={styles.messageContentTextarea}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => setNewMessageContent(e.currentTarget.innerText)}
            >
              {newMessageContent}
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: mdContentWithoutFileNames,
              }}
              className='markdown-body'
            />
          )}
          {fileNames.length > 0 && (
            <div className={styles.filesContainer}>
              <div className={styles.files}>
                {fileNames.map((fileName, index) => (
                  <div key={index} className={styles.file}>
                    <span>{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Tooltip
          id={`prevmsg-tooltip-${_id}`}
          content='Previous message'
          place='bottom'
        />
        <Tooltip
          id={`nextmsg-tooltip-${_id}`}
          content='Next message'
          place='bottom'
        />
        <Tooltip
          id={`resend-tooltip-${_id}`}
          content={loadingNewMessages ? 'Resending' : 'Resend message'}
          place='bottom'
        />
        <Tooltip
          id={`edit-tooltip-${_id}`}
          content={editingMessage ? 'Save message' : 'Edit message'}
          place='bottom'
        />
        <Tooltip
          id={`rm-tooltip-${_id}`}
          content={removeMessage ? 'Cancel within 5 sec' : 'Remove message'}
          place='bottom'
        />
        <Tooltip
          id={`copy-tooltip-${_id}`}
          content={
            copiedFilesText
              ? 'Copied!'
              : copiedFilesTextError
              ? 'Copying failed'
              : 'Copy plain text'
          }
          place='bottom'
        />
      </div>
      {selectedChild && (
        <Message
          index={index + 1}
          messageTree={messageTree}
          data={selectedChild}
          currentUserAllowedToChat={currentUserAllowedToChat}
          messages={messages}
          setMessages={setMessages}
          selectedChildIndices={selectedChildIndices}
          setSelectedChildIndices={setSelectedChildIndices}
        />
      )}
    </Fragment>
  )
}

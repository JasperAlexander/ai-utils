'use client'

import styles from './page.module.css'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { MessageType } from '@/types'
import { arrayToTree } from '@/utils/arrayToTree'
import { Message } from './message'
import { Tooltip } from 'react-tooltip'
import { useDropzone } from 'react-dropzone'
import { getLastItemInPath } from '@/utils/getLastItemInPath'
import { filesToText } from '@/utils/filesToText'
import { useParams } from 'next/navigation'
import { addMessageToMessagesTree } from '@/utils/addMessageToMessagesTree'
import { updateMessageOfMessagesTree } from '@/utils/updateMessageOfMessagesTree'
import { findDeepestMessageOfMessagesTree } from '@/utils/findDeepestMessageOfMessagesTree'
import { findHistoryOfMessagesTree } from '@/utils/findHistoryOfMessagesTree'

export function Messages({
  currentUserAllowedToChat,
  messages,
}: {
  currentUserAllowedToChat: boolean
  messages: MessageType[]
}) {
  const params = useParams()

  const [localMessagesTree, setLocalMessagesTree] = useState<MessageType[]>([])
  const [selectedChildIndices, setSelectedChildIndices] = useState<{
    [id: string]: number
  }>({})
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const bottomAnchor = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messagesElement = messagesRef.current
    if (!messagesElement) return

    const observer = new MutationObserver(() => {
      messagesElement.scrollTop = messagesElement.scrollHeight
    })

    observer.observe(messagesElement, { childList: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setLocalMessagesTree(arrayToTree(messages))
  }, [setLocalMessagesTree, messages])

  const sendMessage = async (message: string) => {
    const fileTexts = await filesToText(files)

    setInput('')
    setFiles([])

    const lastItemInPath = getLastItemInPath(
      localMessagesTree,
      selectedChildIndices
    )

    const postUserMessageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          item_id: params.itemId,
          role: 'user',
          content: message + fileTexts,
          parent: lastItemInPath?._id || null,
        }),
      }
    )
    const userMessageInsertedId = await postUserMessageResponse.json()

    let messagesTreeWithNewUserMessage = [...localMessagesTree]
    addMessageToMessagesTree(messagesTreeWithNewUserMessage, {
      _id: userMessageInsertedId,
      item_id: params.itemId,
      role: 'user',
      content: message + fileTexts,
      parent: lastItemInPath?._id || null,
      children: [],
      updated_at: new Date().toString(),
      created_at: new Date().toString(),
    })
    setLocalMessagesTree(messagesTreeWithNewUserMessage)

    const deepestMessageIdOfMessagesTree = findDeepestMessageOfMessagesTree({
      messagesTree: localMessagesTree,
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
          question: message,
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
          parent: userMessageInsertedId,
        }),
      }
    )
    const AIMessageInsertedId = await postAIMessageResponse.json()

    let messagesTreeWithNewAIMessage = [...messagesTreeWithNewUserMessage]
    addMessageToMessagesTree(messagesTreeWithNewAIMessage, {
      _id: AIMessageInsertedId,
      item_id: params.itemId,
      role: 'assistant',
      content: lastMessage,
      parent: userMessageInsertedId,
      children: [],
      updated_at: new Date().toString(),
      created_at: new Date().toString(),
    })
    setLocalMessagesTree(messagesTreeWithNewAIMessage)

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
  }

  const onDrop = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return
    setFiles((currentFiles) => [...currentFiles, ...newFiles])
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'text/*': [],
      'application/pdf': [],
      'application/json': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
    },
    onDrop,
    noClick: true,
  })

  return (
    <Fragment>
      <div className={styles.messages} ref={messagesRef}>
        {localMessagesTree.map((localMessage, index) => (
          <Message
            key={index}
            localMessage={localMessage}
            localMessagesTree={localMessagesTree}
            setLocalMessagesTree={setLocalMessagesTree}
            currentUserAllowedToChat={currentUserAllowedToChat}
            selectedChildIndices={selectedChildIndices}
            setSelectedChildIndices={setSelectedChildIndices}
          />
        ))}
        <div className={styles.anchor} ref={bottomAnchor} />
      </div>

      {currentUserAllowedToChat && (
        <div className={styles.footer}>
          <div
            {...getRootProps()}
            className={`${styles.inputContainer} ${
              isDragAccept && styles.inputAcceptFile
            } ${isDragReject && styles.inputRejectFile}`}
          >
            <input {...getInputProps()} />
            <textarea
              className={styles.inputTextarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isDragActive
                  ? 'Drop the files here...'
                  : 'Type and/or drop files here...'
              }
            />
            <button
              type='button'
              onClick={() => sendMessage(input)}
              className={styles.inputSubmitButton}
              disabled={files.length === 0 && input === ''}
              data-tooltip-id={'send-tooltip'}
            >
              <svg
                className={styles.inputSubmitButtonSvg}
                strokeWidth='2'
                viewBox='0 0 24 24'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='22' y1='2' x2='11' y2='13'></line>
                <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
              </svg>
            </button>

            <div className={styles.filesContainer}>
              <div className={styles.files}>
                {files &&
                  files.map((file, index) => (
                    <div key={index} className={styles.file}>
                      <span>{file.name}</span>
                      <button
                        type='button'
                        onClick={() =>
                          setFiles((oldFiles) =>
                            oldFiles.filter((oldFile) => {
                              return oldFile !== file
                            })
                          )
                        }
                        className={styles.fileRmButton}
                        data-tooltip-id={`rmfile-tooltip-${index}`}
                      >
                        <svg
                          className={styles.fileRmButtonSvg}
                          aria-hidden='true'
                          viewBox='0 0 16 16'
                          data-view-component='true'
                        >
                          <path d='M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z'></path>
                        </svg>
                      </button>
                      <Tooltip
                        id={`rmfile-tooltip-${index}`}
                        content={'Remove file'}
                        place='bottom'
                        positionStrategy='fixed'
                      />
                    </div>
                  ))}
              </div>
            </div>
            <Tooltip
              id={'send-tooltip'}
              content={'Send message'}
              place='bottom'
            />
          </div>
        </div>
      )}
    </Fragment>
  )
}

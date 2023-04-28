'use client'

import styles from './page.module.css'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { MessageType } from '@/types'
import { useCookies } from 'react-cookie'
import { arrayToTree } from '@/utils/arrayToTree'
import { Message } from './message'
import { Tooltip } from 'react-tooltip'
import { useDropzone } from 'react-dropzone'
import { getSelectedNodes } from '@/utils/getSelectedNodes'
import { getLastItemInPath } from '@/utils/getLastItemInPath'
import { filesToText } from '@/utils/filesToText'
import { useParams } from 'next/navigation'

const COOKIE_NAME = 'ai-chat'

export function Messages({ messages }: { messages: MessageType[] }) {
  const params = useParams()

  const [localMessages, setLocalMessages] = useState<MessageType[]>([])
  const [localMessagesTree, setLocalMessagesTree] = useState<MessageType[]>([])
  const [selectedChildIndices, setSelectedChildIndices] = useState<{
    [id: string]: number
  }>({})
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const bottomAnchor = useRef<HTMLDivElement>(null)

  const [cookie, setCookie] = useCookies([COOKIE_NAME])

  useEffect(() => {
    if (bottomAnchor.current) bottomAnchor.current.scrollIntoView()
  }, [])

  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    setLocalMessagesTree(arrayToTree(localMessages))
  }, [localMessages])

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  const sendMessage = async (message: string) => {
    const fileTexts = await filesToText(files)

    setInput('')
    setFiles([])

    const lastItemInPath = getLastItemInPath(
      localMessagesTree,
      selectedChildIndices
    )

    const response = await fetch(`http://localhost:3000/api/messages`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: params.id,
        role: 'user',
        content: message + fileTexts,
        parent: lastItemInPath?._id || null,
      }),
    })
    const insertedId = await response.json()
    const newMessages = [
      ...messages,
      {
        _id: insertedId,
        chat_id: params.id,
        role: 'user',
        content: message + fileTexts,
        parent: lastItemInPath?._id || null,
      },
    ]
    setLocalMessages(newMessages)

    // Uncomment the following code to test
    // const newResponse = await fetch(`/api/messages`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     chat_id: params.id,
    //     role: 'assistant',
    //     content: 'Testing',
    //     parent: insertedId,
    //   }),
    // })
    // const newInsertedId = await newResponse.json()
    // const newMessageArray = [
    //   ...newMessages,
    //   {
    //     _id: newInsertedId,
    //     chat_id: params.id,
    //     role: 'assistant',
    //     content: 'Testing',
    //     parent: insertedId,
    //   },
    // ]
    // setMessages(newMessageArray)

    // Comment the following code to test
    const newMessageTree = arrayToTree(newMessages)
    const selectedNodes = getSelectedNodes(
      newMessageTree[0],
      selectedChildIndices
    )

    const promptResponse = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        user: cookie[COOKIE_NAME],
        model: 'gpt-3.5-turbo',
        prompt: selectedNodes,
        maxTokens: 32,
        stream: true,
      }),
    })
    if (!promptResponse.ok)
      throw new Error(`Error fetching data: ${promptResponse.statusText}`)

    const data = promptResponse.body
    if (!data) return

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    let lastMessage = ''

    const newResponse = await fetch(`http://localhost:3000/api/messages`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: params.id,
        role: 'assistant',
        content: lastMessage,
        parent: insertedId,
      }),
    })
    const newInsertedId = await newResponse.json()

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading

      if (value) {
        const chunkValue = decoder.decode(value)
        lastMessage = lastMessage + chunkValue
        const newMessageArray = [
          ...newMessages,
          {
            _id: newInsertedId,
            chat_id: params.id,
            role: 'assistant',
            content: lastMessage,
            parent: insertedId,
          },
        ]
        setLocalMessages(newMessageArray)
      }
    }

    await fetch(`http://localhost:3000/api/messages/${newInsertedId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        content: lastMessage,
      }),
    })
    // Comment till here if you want to test
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
      <div className={styles.messages}>
        {localMessagesTree.map((message, index) => (
          <Message
            key={index}
            index={index}
            messageTree={localMessagesTree}
            data={message}
            cookie={cookie}
            messages={localMessages}
            setMessages={setLocalMessages}
            selectedChildIndices={selectedChildIndices}
            setSelectedChildIndices={setSelectedChildIndices}
          />
        ))}
        <div className={styles.anchor} ref={bottomAnchor} />
      </div>

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
    </Fragment>
  )
}

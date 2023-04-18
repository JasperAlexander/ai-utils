'use client'

import './markdown.css'
import styles from './page.module.css'
import { fileToText } from 'file-to-text'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCookies } from 'react-cookie'
import { Message } from './message'
import { Tooltip } from 'react-tooltip'
import { useGlobalStore } from '@/state/store'
import { useParams } from 'next/navigation'
import { MessageType } from '@/types'

const COOKIE_NAME = 'ai-chat'

export default function ChatPage() {
  const params = useParams()

  const chats = useGlobalStore((state) => state.chats)

  const title = chats.find((chat) => chat._id === params.id)?.title || 'Chat'

  const [messages, setMessages] = useState<MessageType[]>([])
  useEffect(() => {
    fetch(`http://localhost:3000/api/messages/${params.id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
  }, [params.id])

  const [cookie, setCookie] = useCookies([COOKIE_NAME])

  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const sidebarButtonOn = useRef<HTMLButtonElement>(null)
  const bottomAnchor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  useEffect(() => {
    if (bottomAnchor.current) bottomAnchor.current.scrollIntoView()
  }, [])

  const onDrop = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return
    setFiles((currentFiles) => [...currentFiles, ...newFiles])
  }, [])

  const sendMessage = async (message: string) => {
    let fileTexts = ''
    if (files.length > 0) {
      const fileTextPromises = files.map(async (file) => {
        const fileText = await fileToText(file)
        return ` file ${file.name}: """${fileText}"""`
      })
      const allFileTexts = await Promise.all(fileTextPromises)

      fileTexts = allFileTexts.join('\n\n')
    }

    const newMessages = [
      ...messages,
      {
        chat_id: params.id,
        role: 'user',
        content: message + fileTexts,
      },
    ]

    await fetch(`/api/messages`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: params.id,
        role: 'user',
        content: message + fileTexts,
      }),
    })

    setMessages(newMessages)
    setInput('')
    setFiles([])

    // Uncomment the following code to test
    // await fetch(`/api/messages`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     chat_id: params.id,
    //     role: 'assistant',
    //     content: 'Testing',
    //   }),
    // })
    // setMessages([
    //   ...newMessages,
    //   { chat_id: params.id, role: 'assistant', content: 'Testing' },
    // ])

    // Comment the following code to test
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        user: cookie[COOKIE_NAME],
        model: 'gpt-3.5-turbo',
        prompt: newMessages,
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
        setMessages([
          ...newMessages,
          { chat_id: params.id, role: 'assistant', content: lastMessage },
        ])
      }
    }

    await fetch(`/api/messages`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: params.id,
        role: 'assistant',
        content: lastMessage,
      }),
    })
    // Comment till here if you want to test
  }

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
    <div className={styles.chatPage}>
      <div className={styles.chatPageHeader}>
        <button
          type='button'
          onClick={() => {
            if (!sidebarButtonOn.current) return
            sidebarButtonOn.current.style.display = 'none'
            if (!document || !document.getElementById('sidebar')) return
            document.getElementById('sidebar')!.style.display = 'flex'
          }}
          className={styles.sidebarOpenButton}
          ref={sidebarButtonOn}
          id='sidebarButtonOn'
          data-tooltip-id={'showsidebar-tooltip'}
        >
          <svg
            aria-hidden='true'
            viewBox='0 0 16 16'
            className={styles.sidebarOpenButtonSvg}
          >
            <path d='M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z'></path>
            <path d='M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z'></path>
          </svg>
        </button>

        <span className={styles.chatPageHeaderTitle}>{title}</span>
      </div>
      <div className={styles.messages}>
        {messages.map(({ _id, content, role }, index) => (
          <Message
            key={index}
            index={index}
            id={_id!}
            content={content}
            role={role}
            cookie={cookie}
            messages={messages}
            setMessages={setMessages}
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
        </div>
      </div>
      <Tooltip
        id={'showsidebar-tooltip'}
        content={'Show sidebar'}
        place='bottom'
      />
      <Tooltip id={'send-tooltip'} content={'Send message'} place='bottom' />
    </div>
  )
}

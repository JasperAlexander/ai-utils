'use client'

import './markdown.css'
import styles from './page.module.css'
import { fileToText } from 'file-to-text'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCookies } from 'react-cookie'
import { ChatMessage } from '@/types'
import { Message } from './message'
import { Tooltip } from 'react-tooltip'

const COOKIE_NAME = 'ai-chat'

export default function IndexPage() {
  const [AIMessages, setAIMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: `An AI assistant that can have an inspiring and humorous conversation. 
          AI assistant is a brand new, powerful, human-like artificial intelligence. 
          The traits of AI include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. 
          AI is a well-behaved and well-mannered individual. 
          AI is not a therapist, but instead an engineer and developer. 
          AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user. 
          AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.`,
    },
  ])
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([
    {
      role: 'assistent',
      content: 'How can I help you?',
    },
  ])
  const [cookie, setCookie] = useCookies([COOKIE_NAME])
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])

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
    let filesNames = ''
    if (files.length > 0) {
      const fileTextPromises = files.map(async (file) => {
        const fileText = await fileToText(file)
        return `file ${file.name}: """${fileText}"""`
      })
      const allFileTexts = await Promise.all(fileTextPromises)

      fileTexts = allFileTexts.join('\n\n')
      filesNames = files.map((file) => `file: ${file.name}`).join('; ')
    }

    const newAIMessages = [
      ...AIMessages,
      {
        role: 'user',
        content: message + fileTexts,
      } as ChatMessage,
    ]
    const newLocalMessages = [
      ...localMessages,
      {
        role: 'user',
        content: message + filesNames,
      } as ChatMessage,
    ]

    setAIMessages(newAIMessages)
    setLocalMessages(newLocalMessages)
    setInput('')
    setFiles([])

    // Use the following code if you want to test
    // setAIMessages([
    //   ...newAIMessages,
    //   { role: 'assistant', content: 'Testing' } as ChatMessage,
    // ])
    // setLocalMessages([
    //   ...newLocalMessages,
    //   { role: 'assistant', content: 'Testing' } as ChatMessage,
    // ])

    // Comment the following code if you want to test
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        user: cookie[COOKIE_NAME],
        model: 'gpt-3.5-turbo',
        prompt: newAIMessages,
        maxTokens: 128,
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
        setAIMessages([
          ...newAIMessages,
          { role: 'assistant', content: lastMessage } as ChatMessage,
        ])
        setLocalMessages([
          ...newLocalMessages,
          { role: 'assistant', content: lastMessage } as ChatMessage,
        ])
      }
    }
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
    <div className={styles.container}>
      <div className={styles.messages}>
        {localMessages.map(({ content, role }, index) => (
          <Message key={index} content={content} role={role} />
        ))}
        <div className={styles.anchor} ref={bottomAnchor} />
      </div>

      <div className={styles.footer}>
        <div
          {...getRootProps()}
          className={`${styles.inputContainer} ${
            isDragAccept && styles.inputAcceptFile
          } ${isDragReject && styles.inputRejectFile} ${
            localMessages.length > 0 && styles.shrinkInputContainer
          }`}
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
          <Tooltip
            id={'send-tooltip'}
            content={'Send message'}
            place='bottom'
            className={styles.tooltip}
          />
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
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

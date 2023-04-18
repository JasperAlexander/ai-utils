'use client'

import 'highlight.js/styles/github-dark.css'
import styles from './page.module.css'
import hljs from 'highlight.js'
import { marked } from 'marked'
import { extractFileNames } from '@/utils/extractFileNames'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MessageType } from '@/types'
import { Tooltip } from 'react-tooltip'

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
  id,
  content,
  role,
  cookie,
  messages,
  setMessages,
}: {
  index: number
  id: string
  content: string
  role: string
  cookie: any
  messages: MessageType[]
  setMessages: Dispatch<SetStateAction<MessageType[]>>
}) {
  const [editingMessage, setEditingMessage] = useState(false)
  const [newMessageContent, setNewMessageContent] = useState(content)
  const [removeMessage, setRemoveMessage] = useState(false)
  const [copiedFilesText, setCopiedFilesText] = useState(false)
  const [copiedFilesTextError, setCopiedFilesTextError] = useState(false)
  const [removeChatTimer, setRemoveChatTimer] = useState<NodeJS.Timeout>()

  const fileNames = extractFileNames(content)

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
      const timer = setTimeout(() => {
        setMessages((messages) => messages.filter((_, i) => i !== index))
        setRemoveMessage(false)
      }, 5000)
      setRemoveChatTimer(timer)
      return () => clearTimeout(removeChatTimer)
    }
  }, [removeMessage, setRemoveMessage, setMessages, index, removeChatTimer])

  return (
    <div
      className={`${styles.message} ${role === 'user' && styles.messageOfUser}`}
    >
      <div className={styles.messageHeader}>
        <div className={styles.messageHeaderText}>
          <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
        <div className={styles.messageHeaderButtons}>
          <button
            type='button'
            onClick={() => {
              if (editingMessage) {
                fetch(`http://localhost:3000/api/messages/${id}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    content: newMessageContent,
                  }),
                })
                setMessages((messages) =>
                  messages.map((message) => {
                    if (message.content === content && message.role === role) {
                      return {
                        ...message,
                        content: newMessageContent,
                      }
                    }
                    return message
                  })
                )
                setEditingMessage(false)
              } else {
                setEditingMessage(true)
              }
            }}
            className={`
        ${styles.messageHeaderButton}
        ${editingMessage && styles.editMsgButtonActive}`}
            data-tooltip-id={`edit-tooltip-${id}`}
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
          </button>

          <button
            type='button'
            onClick={() => copyFilesText()}
            className={`
        ${styles.messageHeaderButton}
        ${copiedFilesText && styles.copyButtonActive}
        ${copiedFilesTextError && styles.copyButtonError}`}
            data-tooltip-id={`copy-tooltip-${id}`}
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
            onBlur={(e) => setNewMessageContent(e.currentTarget.innerText!)}
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
        id={`edit-tooltip-${id}`}
        content={editingMessage ? 'Save message' : 'Edit message'}
        place='bottom'
      />
      <Tooltip
        id={`rm-tooltip-${id}`}
        content={removeMessage ? 'Cancel within 5 sec' : 'Remove message'}
        place='bottom'
      />
      <Tooltip
        id={`copy-tooltip-${id}`}
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
  )
}

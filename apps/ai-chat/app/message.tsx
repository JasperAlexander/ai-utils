'use client'

import { marked } from 'marked'
import { CopyButton } from './copyButton'
import { extractFileNames } from '@/utils/extractFileNames'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { ChatMessage } from '@/types'
import { RmMessageButton } from './rmMessageButton'
import styles from './page.module.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

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
  const fileNames = extractFileNames(content)

  const contentWithoutFileNames = content.replace(/file: [^;]+;?/g, '').trim()
  const mdContentWithoutFileNames = useMemo(() => {
    return marked.parse(contentWithoutFileNames)
  }, [contentWithoutFileNames])

  return (
    <div
      className={`${styles.message} ${role === 'user' && styles.messageOfUser}`}
    >
      <div className={styles.messageHeader}>
        <div className={styles.messageHeaderText}>
          <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
        <div className={styles.messageHeaderButtons}>
          <RmMessageButton
            content={content}
            role={role}
            setAIMessages={setAIMessages}
            setLocalMessages={setLocalMessages}
          />
          <CopyButton filesText={contentWithoutFileNames} />
        </div>
      </div>
      <div className={styles.messageContent}>
        <div
          dangerouslySetInnerHTML={{
            __html: mdContentWithoutFileNames,
          }}
          className='markdown-body'
        />

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
    </div>
  )
}

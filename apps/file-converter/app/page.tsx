'use client'

import './markdown.css'
import styles from './page.module.css'
import { fileToText } from 'file-to-text'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CopyButton } from './copyButton'
import { marked } from 'marked'
import { MarkdownViewButton } from './markdownViewButton'
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
  breaks: true,
  sanitize: false,
  smartypants: false,
  xhtml: false,
})

export default function IndexPage() {
  const [filesTextPlain, setFilesTextPlain] = useState('')
  const [filesTextMarkdown, setFilesTextMarkdown] = useState('')

  const [showMarkdown, setShowMarkdown] = useState(false)

  const onDrop = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      const fileTextPromises = files.map(async (file) => {
        return await fileToText(file)
      })

      const allFileTexts = await Promise.all(fileTextPromises)
      const combinedFileTexts = allFileTexts.join('\n\n')

      const combinedFilesText = filesTextPlain
        ? filesTextPlain.concat('\n\n', combinedFileTexts)
        : combinedFileTexts
      setFilesTextPlain(combinedFilesText + '  ')

      const markdown = marked.parse(combinedFilesText)
      setFilesTextMarkdown(markdown)
    },
    [filesTextPlain, setFilesTextPlain, setFilesTextMarkdown]
  )

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        'text/*': [],
        'application/pdf': [],
        'application/json': [],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          [],
      },
      onDrop,
    })

  return (
    <div className={styles.container}>
      <div
        {...getRootProps()}
        className={`${styles.inputContainer} ${
          isDragAccept && styles.inputAcceptFile
        } ${isDragReject && styles.inputRejectFile} ${
          filesTextPlain && styles.shrinkInputContainer
        }`}
      >
        <input {...getInputProps()} />
        <span>Drop your files here</span>
      </div>
      <div
        className={
          filesTextPlain ? styles.textContainer : styles.textContainerEmpty
        }
      >
        <div className={styles.textHeader}>
          <MarkdownViewButton
            showMarkdown={showMarkdown}
            setShowMarkdown={setShowMarkdown}
          />
          <CopyButton filesText={filesTextPlain} />
        </div>
        <div className={styles.textContent}>
          {showMarkdown ? (
            <div
              dangerouslySetInnerHTML={{ __html: filesTextMarkdown }}
              className='markdown-body'
            />
          ) : (
            <span className={styles.textSpan}>{filesTextPlain}</span>
          )}
        </div>
      </div>
    </div>
  )
}

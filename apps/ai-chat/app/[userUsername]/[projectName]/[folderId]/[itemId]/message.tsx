'use client'

import 'highlight.js/styles/github-dark.css'
import styles from './page.module.css'
import hljs from 'highlight.js'
import { marked } from 'marked'
import { extractFileNames } from '@/utils/extractFileNames'
import { Fragment, useMemo, useState } from 'react'
import { MessageType } from '@/types'
import { Tooltip } from 'react-tooltip'
import { CopyMessageButton } from './copyMessageButton'
import { ResendMessageButton } from './resendMessageButton'
import { DeleteMessageButton } from './deleteMessageButton'
import { EditMessageButton } from './editMessageButton'

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
  localMessage,
  localMessagesTree,
  setLocalMessagesTree,
  currentUserAllowedToChat,
  selectedChildIndices,
  setSelectedChildIndices,
}: {
  localMessage: MessageType
  localMessagesTree: MessageType[]
  setLocalMessagesTree: (newMessagesTree: MessageType[]) => void
  currentUserAllowedToChat: boolean
  selectedChildIndices: {
    [id: string]: number
  }
  setSelectedChildIndices: (newSelectedChildIndices: {
    [id: string]: number
  }) => void
}) {
  const [editingMessage, setEditingMessage] = useState(false)
  const [newMessageContent, setNewMessageContent] = useState(
    localMessage.content
  )

  const fileNames = extractFileNames(localMessage.content)
  const selectedIndex = selectedChildIndices?.[localMessage._id] || 0
  const selectedChild =
    localMessage.children && localMessage.children.length > 0
      ? localMessage.children[selectedIndex]
      : null

  const handleSiblingSwitch = (parentId: string, index: number) =>
    setSelectedChildIndices({ ...selectedChildIndices, [parentId]: index })

  const contentWithoutFileNames = localMessage.content
    .replace(/file [^:]+: """[^"]*"""/g, '')
    .trim()
  const mdContentWithoutFileNames = useMemo(() => {
    return marked.parse(contentWithoutFileNames)
  }, [contentWithoutFileNames])

  return (
    <Fragment>
      <div
        className={`${styles.message} ${
          localMessage.role === 'user' && styles.messageOfUser
        }`}
      >
        <div className={styles.messageHeader}>
          <div className={styles.messageHeaderText}>
            <span>
              {localMessage.role.charAt(0).toUpperCase() +
                localMessage.role.slice(1)}
            </span>
          </div>
          <div className={styles.messageHeaderButtons}>
            {localMessage.children && localMessage.children.length > 1 && (
              <div className={styles.messageHeaderButtonsBranch}>
                <button
                  onClick={() =>
                    handleSiblingSwitch(
                      localMessage._id,
                      (selectedIndex - 1 + localMessage.children.length) %
                        localMessage.children.length
                    )
                  }
                  className={styles.messageHeaderButton}
                  data-tooltip-id={`prevmsg-tooltip-${localMessage._id}`}
                >
                  <svg
                    viewBox='0 0 16 16'
                    className={styles.messageHeaderButtonSvg}
                  >
                    <path d='M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z'></path>
                  </svg>
                </button>
                <Tooltip
                  id={`prevmsg-tooltip-${localMessage._id}`}
                  content='Previous message'
                  place='bottom'
                />
                <span>
                  {selectedIndex + 1 + '/' + localMessage.children.length}
                </span>
                <button
                  onClick={() =>
                    handleSiblingSwitch(
                      localMessage._id,
                      (selectedIndex + 1) % localMessage.children.length
                    )
                  }
                  className={styles.messageHeaderButton}
                  data-tooltip-id={`nextmsg-tooltip-${localMessage._id}`}
                >
                  <svg
                    viewBox='0 0 16 16'
                    className={styles.messageHeaderButtonSvg}
                  >
                    <path d='M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z'></path>
                  </svg>
                </button>
                <Tooltip
                  id={`nextmsg-tooltip-${localMessage._id}`}
                  content='Next message'
                  place='bottom'
                />
              </div>
            )}

            {currentUserAllowedToChat && (
              <Fragment>
                <ResendMessageButton
                  localMessage={localMessage}
                  localMessagesTree={localMessagesTree}
                  setLocalMessagesTree={setLocalMessagesTree}
                  newMessageContent={newMessageContent}
                  handleSiblingSwitch={handleSiblingSwitch}
                />
                <EditMessageButton
                  localMessageId={localMessage._id}
                  editingMessage={editingMessage}
                  setEditingMessage={setEditingMessage}
                  newMessageContent={newMessageContent}
                  localMessagesTree={localMessagesTree}
                  setLocalMessagesTree={setLocalMessagesTree}
                />
                <DeleteMessageButton
                  localMessage={localMessage}
                  localMessagesTree={localMessagesTree}
                  setLocalMessagesTree={setLocalMessagesTree}
                  handleSiblingSwitch={handleSiblingSwitch}
                  selectedChildIndices={selectedChildIndices}
                />
              </Fragment>
            )}

            <CopyMessageButton
              localMessageId={localMessage._id}
              contentWithoutFileNames={contentWithoutFileNames}
            />
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
      </div>
      {selectedChild && (
        <Message
          localMessage={selectedChild}
          localMessagesTree={localMessagesTree}
          setLocalMessagesTree={setLocalMessagesTree}
          currentUserAllowedToChat={currentUserAllowedToChat}
          selectedChildIndices={selectedChildIndices}
          setSelectedChildIndices={setSelectedChildIndices}
        />
      )}
    </Fragment>
  )
}

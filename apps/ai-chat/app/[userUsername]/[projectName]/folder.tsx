'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { ReactNode, DragEvent, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FolderType } from '@/types'
import { fileToText } from 'file-to-text'

export function Folder({
  children,
  folder,
}: {
  children: ReactNode
  folder: FolderType
}) {
  const params = useParams()
  const router = useRouter()
  const session = useSession()

  const [isOpen, setIsOpen] = useState(true)
  const toggleFolder = () => {
    setIsOpen(!isOpen)
  }
  const [draggedOver, setDraggedOver] = useState(false)

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggedOver(true)
  }

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggedOver(false)
  }

  const onDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggedOver(false)
  }

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const itemId = e.dataTransfer.getData('itemId')
    if (itemId === '') {
      if (e.dataTransfer.files.length === 0) return
      ;[...e.dataTransfer.files].map(async (file) => {
        if (
          !file.type.startsWith('text/') &&
          ![
            'application/pdf',
            'application/json',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.type)
        )
          return

        const fileContent = await fileToText(file)

        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/items`, {
          method: 'POST',
          body: JSON.stringify({
            type: 'document',
            title: file.name,
            content: fileContent,
            folder_id: folder._id,
            created_by: session.data?.user._id,
          }),
        })
      })

      router.refresh()
      setDraggedOver(false)
    } else {
      const folderId = e.dataTransfer.getData('folderId')
      if (folderId === folder._id) return

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          folder_id: folder._id,
        }),
      })

      router.refresh()
      setDraggedOver(false)
    }
  }

  return (
    <div
      className={`${styles.folder} ${draggedOver && styles.folderDraggedOver}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <div
        className={styles.folderTitle}
        aria-current={
          params?.folderId === folder.title && params?.id === undefined
            ? 'true'
            : 'false'
        }
      >
        {/* {!folderId && <div className={styles.spacer} />} */}
        <button
          type='button'
          onClick={toggleFolder}
          className={styles.folderTitleButton}
        >
          {isOpen ? (
            <svg
              aria-hidden='true'
              viewBox='0 0 12 12'
              className={styles.folderTitleButtonSvg}
            >
              <path d='M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z'></path>
            </svg>
          ) : (
            <svg
              aria-hidden='true'
              viewBox='0 0 12 12'
              className={styles.folderTitleButtonSvg}
            >
              <path d='M4.7 10c-.2 0-.4-.1-.5-.2-.3-.3-.3-.8 0-1.1L6.9 6 4.2 3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l3.3 3.2c.3.3.3.8 0 1.1L5.3 9.7c-.2.2-.4.3-.6.3Z'></path>
            </svg>
          )}
        </button>
        <Link
          href={`/${params.userUsername}/${params.projectName}/${folder._id}`}
          className={styles.folderTitleLink}
        >
          {isOpen ? (
            <svg
              aria-hidden='true'
              viewBox='0 0 16 16'
              className={styles.folderTitleLinkSvg}
            >
              <path d='M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z'></path>
            </svg>
          ) : (
            <svg
              aria-hidden='true'
              viewBox='0 0 16 16'
              className={styles.folderTitleLinkSvg}
            >
              <path d='M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z'></path>
            </svg>
          )}
          <span className={styles.folderTitleSpan}>{folder.title}</span>
        </Link>
      </div>
      {isOpen && <ul className={styles.folderChildren}>{children}</ul>}
    </div>
  )
}

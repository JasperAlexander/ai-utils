'use client'

import styles from './page.module.css'
import { useGlobalStore } from '@/state/store'
import { useParams } from 'next/navigation'
import { ChatRow } from './chat'
import { Tooltip } from 'react-tooltip'
import { useEffect, useRef, useState } from 'react'

export default function FolderPage() {
  const params = useParams()

  const chats = useGlobalStore((state) => state.chats)
  const folderChats = chats.filter((chat) => chat.folder_id === params.folderId)

  const folders = useGlobalStore((state) => state.folders)
  const folderTitle = folders.find(
    (folder) => folder._id === params.folderId
  )?.title

  const sidebarButtonOn = useRef<HTMLButtonElement>(null)

  const setFolders = useGlobalStore((state) => state.setFolders)

  const [editingFolderTitle, setEditingFolderTitle] = useState(false)
  const [tempFolderTitle, setTempFolderTitle] = useState(folderTitle)

  useEffect(() => {
    setTempFolderTitle(folderTitle)
  }, [folderTitle])

  return (
    <div className={styles.folderPage}>
      <div className={styles.folderPageHeader}>
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
        <Tooltip
          id={'showsidebar-tooltip'}
          content={'Show sidebar'}
          place='bottom'
        />

        {editingFolderTitle ? (
          <input
            type='text'
            value={tempFolderTitle}
            onChange={(e) => setTempFolderTitle(e.target.value)}
            className={styles.folderEditInput}
          />
        ) : (
          <h2 className={styles.folderPageTitle}>{folderTitle}</h2>
        )}

        <button
          type='button'
          onClick={() => {
            if (editingFolderTitle && tempFolderTitle) {
              fetch(`http://localhost:3000/api/folders/${params.folderId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                  title: tempFolderTitle,
                }),
              })
              setFolders(
                folders.map((folder) =>
                  folder._id === params.folderId
                    ? { ...folder, title: tempFolderTitle }
                    : folder
                )
              )
            }
            setEditingFolderTitle(!editingFolderTitle)
          }}
          className={`${styles.folderEditButton} ${
            editingFolderTitle && styles.folderEditButtonActive
          }`}
        >
          {editingFolderTitle ? (
            <svg
              aria-hidden='true'
              viewBox='0 0 16 16'
              className={styles.folderEditButtonSvg}
            >
              <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
            </svg>
          ) : (
            <svg
              aria-hidden='true'
              viewBox='0 0 16 16'
              className={styles.folderEditButtonSvg}
            >
              <path d='M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z'></path>
            </svg>
          )}
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderRowCell}>Name</th>
            <th className={styles.tableHeaderRowCell}>Last update</th>
            <th className={styles.tableHeaderRowCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {folderChats.map((chat) => (
            <ChatRow
              key={chat._id}
              id={chat._id!}
              folderId={params.folderId}
              title={chat.title}
              updatedAt={chat.updated_at}
              createdAt={chat.created_at!}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

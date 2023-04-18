'use client'

import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { Folder } from './folder'
import { Chat } from './chat'
import { useGlobalStore } from '@/state/store'

export function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null)

  const [isResizing, setIsResizing] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [tooltipMenuOpen, setTooltipMenuOpen] = useState(false)

  const folders = useGlobalStore((state) => state.folders)
  const setFolders = useGlobalStore((state) => state.setFolders)
  const chats = useGlobalStore((state) => state.chats)
  const setChats = useGlobalStore((state) => state.setChats)

  useEffect(() => {
    fetch(`http://localhost:3000/api/folders`)
      .then((res) => res.json())
      .then((data) => {
        setFolders(data)
      })

    fetch(`http://localhost:3000/api/chats`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data)
      })
  }, [setFolders, setChats])

  function handleChatDragStart(chatId: string) {
    // Implement any visual effect or state update while dragging
  }

  function handleFolderDrop(folderId: string | undefined, chatId: string) {
    fetch(`http://localhost:3000/api/chats/${chatId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        folder_id: folderId,
      }),
    })
    setChats(
      chats.map((chat) =>
        chat._id === chatId
          ? { ...chat, folder_id: folderId, updated_at: new Date().toString() }
          : chat
      )
    )
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return
      const newWidth = e.clientX - sidebarRef.current.offsetLeft
      sidebarRef.current.style.setProperty('--pane-width', newWidth + 'px')
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'auto'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebar} ref={sidebarRef} id='sidebar'>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <button
              type='button'
              onClick={() => {
                if (!sidebarRef.current) return
                sidebarRef.current.style.display = 'none'
                if (document.getElementById('sidebarButtonOn'))
                  document.getElementById('sidebarButtonOn')!.style.display =
                    'flex'
              }}
              className={styles.sidebarCloseButton}
              data-tooltip-id={'hidesidebar-tooltip'}
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                className={styles.sidebarCloseButtonSvg}
              >
                <path d='m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z'></path>
                <path d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z'></path>
              </svg>
            </button>
            <h2 className={styles.sidebarHeaderTitle}>Chats</h2>
            <button
              type='button'
              onClick={() => {
                setTooltipMenuOpen(true)
              }}
              className={styles.addChatButton}
              data-tooltip-id={'addchat-tooltip'}
            >
              <svg aria-hidden='true' viewBox='0 0 16 16'>
                <path d='M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z'></path>
              </svg>
            </button>
          </div>
          <div className={styles.searchbar}>
            <svg
              aria-hidden='true'
              viewBox='0 0 16 16'
              className={styles.searchbarSvg}
            >
              <path d='M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z'></path>
            </svg>
            <input
              type='text'
              placeholder='Go to chat'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchbarInput}
            />
          </div>
          <div className={styles.sidebarChats}>
            {/* <Folder
              title='Root'
              folderId={folderId}
              onDrop={(chatId: number) => handleFolderDrop(folderId, chatId)}
            > */}
            {folders.map((folder) => (
              <Folder
                key={folder._id}
                folderId={folder._id}
                title={folder.title}
                onDrop={(chatId: string) =>
                  handleFolderDrop(folder._id, chatId)
                }
              >
                {chats
                  .filter((chat) => chat.folder_id === folder._id)
                  .map((chat) => (
                    <Chat
                      key={chat._id}
                      id={chat._id!}
                      title={chat.title}
                      folderId={chat.folder_id}
                      onDragStart={handleChatDragStart}
                    />
                  ))}
              </Folder>
            ))}
            {/* {chats
              .filter((chat) => !chat.folder_id)
              .map((chat) => (
                <Chat
                  key={chat._id}
                  id={chat._id!}
                  title={chat.title}
                  folderId={undefined}
                  onDragStart={handleChatDragStart}
                />
              ))} */}
            {/* </Folder> */}
          </div>
        </div>
      </div>
      <div className={styles.resizerContainer}>
        <div
          className={styles.resizer}
          onMouseDown={() => {
            setIsResizing(true)
            document.body.style.cursor = 'col-resize'
          }}
        />
      </div>
      <Tooltip
        id={'hidesidebar-tooltip'}
        content={'Hide sidebar'}
        place='bottom'
      />
      <Tooltip
        id={'addchat-tooltip'}
        className={styles.tooltipMenu}
        offset={0}
        isOpen={tooltipMenuOpen}
        setIsOpen={setTooltipMenuOpen}
        openOnClick={true}
        closeOnEsc={true}
        clickable={true}
        place='bottom'
      >
        <ul className={styles.tooltipMenuList}>
          <li className={styles.tooltipMenuListItemContainer}>
            <button
              type='button'
              onClick={async () => {
                let folderId = folders[0]?._id
                if (folders.length === 0) {
                  const response = await fetch(
                    `http://localhost:3000/api/folders`,
                    {
                      method: 'POST',
                    }
                  )
                  folderId = await response.json()
                  setFolders([
                    ...folders,
                    {
                      _id: folderId,
                      title: 'New folder',
                    },
                  ])
                }

                const response = await fetch(
                  `http://localhost:3000/api/chats`,
                  {
                    method: 'POST',
                    body: JSON.stringify({
                      folder_id: folderId,
                    }),
                  }
                )
                const insertedId = await response.json()
                setChats([
                  ...chats,
                  {
                    _id: insertedId,
                    folder_id: folderId,
                    title: 'New chat',
                    updated_at: new Date().toString(),
                  },
                ])
                setTooltipMenuOpen(false)
              }}
              className={styles.tooltipMenuListItem}
            >
              <svg
                viewBox='0 0 16 16'
                className={styles.tooltipMenuListItemSvg}
              >
                <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
              </svg>
              <span>Add chat</span>
            </button>
          </li>
          <li className={styles.tooltipMenuListItemContainer}>
            <button
              type='button'
              onClick={async () => {
                const response = await fetch(
                  `http://localhost:3000/api/folders`,
                  {
                    method: 'POST',
                  }
                )
                const insertedId = await response.json()
                setFolders([
                  ...folders,
                  {
                    _id: insertedId,
                    title: 'New folder',
                  },
                ])
                setTooltipMenuOpen(false)
              }}
              className={styles.tooltipMenuListItem}
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                className={styles.tooltipMenuListItemSvg}
              >
                <path d='M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z'></path>
              </svg>
              <span>Add folder</span>
            </button>
          </li>
        </ul>
      </Tooltip>
    </aside>
  )
}

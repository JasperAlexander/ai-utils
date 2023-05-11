import styles from './page.module.css'
import Link from 'next/link'
import { ChatType, FolderType } from '@/types'
import { Resizer } from '../resizer'
import { Chat } from './chat'
import { Folder } from './folder'
import { Searchbar } from './searchbar'
import { AddButton } from './addButton'
import { Suspense } from 'react'
import { HideSidebarButton } from '../hideSidebarButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'

async function getFolders(created_by: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${created_by}/projects/${name}/folders`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch project folders')

  return res.json()
}

async function getChats(created_by: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${created_by}/projects/${name}/chats`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch project chats')

  return res.json()
}

export async function Sidebar({
  userUsername,
  projectName,
}: {
  userUsername: string
  projectName: string
}) {
  const session = await getServerSession(authOptions)

  const folders: FolderType[] = await getFolders(userUsername, projectName)
  const chats: ChatType[] = await getChats(userUsername, projectName)

  const projectCreatedByCurrentUser = userUsername === session?.user.username

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebar} id='sidebar'>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarHeaderTop}>
              <Suspense
                fallback={
                  <button type='button' className={styles.hideSidebarButton}>
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 16 16'
                      className={styles.hideSidebarButtonSvg}
                    >
                      <path d='m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z'></path>
                      <path d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z'></path>
                    </svg>
                  </button>
                }
              >
                <HideSidebarButton />
              </Suspense>
              <Link
                href={`/${userUsername}/${projectName}`}
                className={styles.sidebarHeaderTitle}
              >
                {projectName}
              </Link>
              {projectCreatedByCurrentUser && (
                <Suspense
                  fallback={
                    <button type='button' className={styles.addButton}>
                      <svg aria-hidden='true' viewBox='0 0 16 16'>
                        <path d='M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z'></path>
                      </svg>
                    </button>
                  }
                >
                  <AddButton folders={folders} />
                </Suspense>
              )}
            </div>
            <div className={styles.searchbar}>
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                className={styles.searchbarSvg}
              >
                <path d='M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z'></path>
              </svg>
              <Suspense
                fallback={
                  <input
                    type='text'
                    placeholder='Go to chat'
                    className={styles.searchbarInput}
                  />
                }
              >
                <Searchbar />
              </Suspense>
            </div>
          </div>
          <div className={styles.sidebarMain}>
            <Suspense>
              {folders.map((folder) => (
                <Folder
                  key={folder._id}
                  folderId={folder._id}
                  title={folder.title}
                >
                  <Suspense>
                    {chats
                      .filter((chat) => chat.folder_id === folder._id)
                      .map((chat) => (
                        <Chat
                          key={chat._id}
                          id={chat._id}
                          title={chat.title}
                          folderId={chat.folder_id}
                        />
                      ))}
                  </Suspense>
                </Folder>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
      <div className={styles.resizerContainer}>
        <Suspense fallback={<div className={styles.resizer} />}>
          <Resizer />
        </Suspense>
      </div>
    </aside>
  )
}

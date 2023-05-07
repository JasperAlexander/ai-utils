import styles from './page.module.css'
import { SidebarButton } from './sidebarButton'
import { FolderTitle } from './folderTitle'
import { Suspense } from 'react'
import { ChatType, FolderType } from '@/types'
import { ChatRow } from './chatRow'
import { SidebarButtonSkeleton } from './sidebarButtonSkeleton'
import { FolderTitleSkeleton } from './folderTitleSkeleton'
import { ChatRowSkeleton } from './chatRowSkeleton'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'

async function getFolder(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/folders/${id}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch folder')

  return res.json()
}

async function getChats(folder_id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/folders/${folder_id}/chats`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch chats')

  return res.json()
}

export default async function FolderPage({
  params,
}: {
  params: {
    userUsername: string
    folderId: string
  }
}) {
  const session = await getServerSession(authOptions)

  const folder: FolderType = await getFolder(params.folderId)
  const chats: ChatType[] = await getChats(params.folderId)

  const folderCreatedByCurrentUser =
    folder?.created_by === session?.user.username

  return (
    <div className={styles.folderPage}>
      <div className={styles.folderPageHeader}>
        <Suspense fallback={<SidebarButtonSkeleton />}>
          <SidebarButton />
        </Suspense>
        <Suspense fallback={<FolderTitleSkeleton folderTitle='Folder' />}>
          <FolderTitle
            folderTitle={folder?.title || 'Not found'}
            folderCreatedBy={folder?.created_by}
          />
        </Suspense>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderRowCell}>Name</th>
            <th className={styles.tableHeaderRowCell}>Last update</th>
            {folderCreatedByCurrentUser && (
              <th className={styles.tableHeaderRowCell}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          <Suspense>
            {chats.map((chat) => (
              <Suspense
                key={chat._id}
                fallback={
                  <ChatRowSkeleton
                    chat={chat}
                    folderId={params.folderId}
                    folderCreatedByCurrentUser={folderCreatedByCurrentUser}
                  />
                }
              >
                <ChatRow
                  key={chat._id}
                  chat={chat}
                  folderCreatedByCurrentUser={folderCreatedByCurrentUser}
                />
              </Suspense>
            ))}
          </Suspense>
        </tbody>
      </table>
    </div>
  )
}

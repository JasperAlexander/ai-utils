import styles from './page.module.css'
import { SidebarButton } from './sidebarButton'
import { FolderTitle } from './folderTitle'
import { Suspense } from 'react'
import { ChatType, FolderType } from '@/types'
import { ChatRow } from './chatRow'
import { SidebarButtonSkeleton } from './sidebarButtonSkeleton'
import { FolderTitleSkeleton } from './folderTitleSkeleton'
import { ChatRowSkeleton } from './chatRowSkeleton'

async function getFolder(id: string) {
  const res = await fetch(`http://localhost:3000/api/folders/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch folder')

  return res.json()
}

async function getChats() {
  const res = await fetch('http://localhost:3000/api/chats', {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch chats')

  return res.json()
}

export default async function FolderPage({
  params,
}: {
  params: { folderId: string }
}) {
  const folder: FolderType = await getFolder(params.folderId)
  const chats: ChatType[] = await getChats()

  const folderChats = chats.filter((chat) => chat.folder_id === params.folderId)

  return (
    <div className={styles.folderPage}>
      <div className={styles.folderPageHeader}>
        <Suspense fallback={<SidebarButtonSkeleton />}>
          <SidebarButton />
        </Suspense>
        <Suspense fallback={<FolderTitleSkeleton folderTitle={folder.title} />}>
          <FolderTitle folderTitle={folder.title} />
        </Suspense>
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
            <Suspense
              key={chat._id}
              fallback={
                <ChatRowSkeleton chat={chat} folderId={params.folderId} />
              }
            >
              <ChatRow key={chat._id} chat={chat} />
            </Suspense>
          ))}
        </tbody>
      </table>
    </div>
  )
}

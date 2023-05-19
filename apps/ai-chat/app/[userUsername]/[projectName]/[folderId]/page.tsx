import styles from './page.module.css'
import Link from 'next/link'
import { ShowSidebarButton } from '../showSidebarButton'
import { Suspense } from 'react'
import { ChatType, FolderType } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'
import { EditChatTitleButton } from './editChatTitleButton'
import { DeleteChatButton } from './deleteChatButton'
import { relativeTimeFormat } from '@/utils/relativeTimeFormat'

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
    projectName: string
    folderId: string
  }
}) {
  const session = await getServerSession(authOptions)

  const folder: FolderType = await getFolder(params.folderId)
  const chats: ChatType[] = await getChats(params.folderId)

  const folderCreatedByCurrentUser = folder?.created_by === session?.user._id

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <Suspense
            fallback={
              <button type='button' className={styles.showSidebarButton}>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 16 16'
                  className={styles.showSidebarButtonSvg}
                >
                  <path d='M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z'></path>
                  <path d='M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z'></path>
                </svg>
              </button>
            }
          >
            <ShowSidebarButton />
          </Suspense>
          <h2>{folder.title || 'Folder'}</h2>
        </div>
        {folderCreatedByCurrentUser && (
          <div>
            <Link
              href={`/${params.userUsername}/${params.projectName}/${params.folderId}/settings`}
              className={styles.primaryButton}
            >
              Settings
            </Link>
          </div>
        )}
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderRowCell}>Name</th>
            <th className={styles.tableHeaderRowCell}>Last update</th>
            <Suspense>
              {folderCreatedByCurrentUser && (
                <th className={styles.tableHeaderRowCell}>Actions</th>
              )}
            </Suspense>
          </tr>
        </thead>
        <tbody>
          <Suspense>
            {chats.map((chat) => (
              <tr key={chat._id} className={styles.tableBodyRow}>
                <td className={styles.tableBodyRowData}>
                  <div className={styles.tableBodyRowDataContent}>
                    <svg
                      viewBox='0 0 16 16'
                      className={styles.tableBodyRowDataContentSvg}
                    >
                      <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
                    </svg>
                    <Link
                      href={`/${params.userUsername}/${params.projectName}/${params.folderId}/${chat._id}`}
                      className={styles.tableBodyRowDataContentLink}
                    >
                      {chat.title}
                    </Link>
                  </div>
                </td>
                <td className={styles.tableBodyRowData}>
                  <div className={styles.tableBodyRowDataContent}>
                    <span className={styles.tableBodyRowDataContentSpan}>
                      {chat.updated_at &&
                        relativeTimeFormat(new Date(chat.updated_at))}
                    </span>
                  </div>
                </td>
                <Suspense>
                  {folderCreatedByCurrentUser && (
                    <td className={styles.tableBodyRowData}>
                      <div className={styles.tableBodyRowDataContent}>
                        <Suspense
                          fallback={
                            <button
                              type='button'
                              className={styles.chatEditButton}
                            >
                              <svg
                                aria-hidden='true'
                                viewBox='0 0 16 16'
                                className={styles.chatEditButtonSvg}
                              >
                                <path d='M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z'></path>
                              </svg>
                            </button>
                          }
                        >
                          <EditChatTitleButton chat={chat} />
                        </Suspense>
                        <Suspense
                          fallback={
                            <button
                              type='button'
                              className={styles.chatRemoveButton}
                            >
                              <svg
                                className={styles.chatRemoveButtonSvg}
                                aria-hidden='true'
                                viewBox='0 0 16 16'
                                data-view-component='true'
                              >
                                <path d='M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z'></path>
                              </svg>
                            </button>
                          }
                        >
                          <DeleteChatButton chat={chat} />
                        </Suspense>
                      </div>
                    </td>
                  )}
                </Suspense>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
    </div>
  )
}

import styles from './page.module.css'
import Link from 'next/link'
import { Fragment, Suspense } from 'react'
import { FolderType, ProjectType } from '@/types'
import { relativeTimeFormat } from '@/utils/relativeTimeFormat'
import { ShowSidebarButton } from './showSidebarButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Sidebar } from './sidebar'

async function getProject(username: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects/${name}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch project')

  return res.json()
}

async function getFolders(username: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects/${name}/folders`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch folders')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: {
    userUsername: string
    projectName: string
  }
}) {
  const session = await getServerSession(authOptions)

  const project: ProjectType = await getProject(
    params.userUsername,
    params.projectName
  )
  const folders: FolderType[] = await getFolders(
    params.userUsername,
    params.projectName
  )

  const projectOfCurrentUser = session?.user.username === params.userUsername

  return (
    <Fragment>
      {/* @ts-ignore */}
      <Sidebar
        userUsername={params.userUsername}
        projectName={params.projectName}
      />

      <main className={styles.main}>
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
              <h2>Project {params.projectName}</h2>
            </div>
            <div>
              <Suspense>
                {projectOfCurrentUser && (
                  <Link
                    href={`/${params.userUsername}/${params.projectName}/settings`}
                    className={styles.primaryButton}
                  >
                    Settings
                  </Link>
                )}
              </Suspense>
            </div>
          </div>
          <span className={styles.description}>{project.description}</span>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeaderRowCell}>Name</th>
                <th className={styles.tableHeaderRowCell}>Last update</th>
              </tr>
            </thead>
            <tbody>
              <Suspense>
                {folders.map((folder) => (
                  <tr key={folder._id} className={styles.tableBodyRow}>
                    <td className={styles.tableBodyRowData}>
                      <div className={styles.tableBodyRowDataContent}>
                        <svg
                          viewBox='0 0 16 16'
                          className={styles.tableBodyRowDataContentSvg}
                        >
                          <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
                        </svg>
                        <Link
                          href={`/${params.userUsername}/${params.projectName}/${folder._id}`}
                          className={styles.tableBodyRowDataContentLink}
                        >
                          {folder.title}
                        </Link>
                      </div>
                    </td>
                    <td className={styles.tableBodyRowData}>
                      <div className={styles.tableBodyRowDataContent}>
                        <span className={styles.tableBodyRowDataContentSpan}>
                          {folder.updated_at &&
                            relativeTimeFormat(new Date(folder.updated_at))}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </Suspense>
            </tbody>
          </table>
        </div>
      </main>
    </Fragment>
  )
}

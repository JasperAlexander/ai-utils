import styles from './page.module.css'
import Link from 'next/link'
import { CollaboratorType, ProjectType } from '@/types'
import { Suspense } from 'react'
import { relativeTimeFormat } from '@/utils/relativeTimeFormat'
import { AddCollaboratorButton } from './addCollaboratorButton'

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

async function getCollaborators(username: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects/${name}/collaborators`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch collaborators')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { userUsername: string; projectName: string }
}) {
  const project: ProjectType = await getProject(
    params.userUsername,
    params.projectName
  )
  const collaborators: CollaboratorType[] = await getCollaborators(
    params.userUsername,
    params.projectName
  )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.title}>Collaborators</h1>
        </div>
        <div>
          <Suspense
            fallback={
              <button type='button' className={styles.primaryButton}>
                Add collaborator
              </button>
            }
          >
            <AddCollaboratorButton project={project} />
          </Suspense>
        </div>
      </div>
      <div className={styles.main}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderRowCell}>Name</th>
              <th className={styles.tableHeaderRowCell}>Status</th>
              <th className={styles.tableHeaderRowCell}>Last update</th>
            </tr>
          </thead>
          <tbody>
            <Suspense>
              {collaborators.map((collaborator) => (
                <tr key={collaborator._id} className={styles.tableBodyRow}>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <svg
                        viewBox='0 0 16 16'
                        className={styles.tableBodyRowDataContentSvg}
                      >
                        <path d='M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z'></path>
                      </svg>
                      <Link
                        href={`/${collaborator.username}`}
                        className={styles.tableBodyRowDataContentLink}
                      >
                        {collaborator.username}
                      </Link>
                    </div>
                  </td>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <span className={styles.tableBodyRowDataContentSpan}>
                        {collaborator.status === 'pending'
                          ? 'Pending invite'
                          : collaborator.role.charAt(0).toUpperCase() +
                            collaborator.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <span className={styles.tableBodyRowDataContentSpan}>
                        {collaborator.updated_at &&
                          relativeTimeFormat(new Date(collaborator.updated_at))}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  )
}

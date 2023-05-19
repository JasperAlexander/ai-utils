import styles from './page.module.css'
import Link from 'next/link'
import { Fragment, Suspense } from 'react'
import {
  CollaboratorType,
  FolderType,
  ProjectType,
  UserOfStarType,
} from '@/types'
import { relativeTimeFormat } from '@/utils/relativeTimeFormat'
import { ShowSidebarButton } from './showSidebarButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Sidebar } from './sidebar'
import { StarProjectButton } from '../starProjectButton'

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

async function getStars(username: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects/${name}/stars`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch stars')

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
  const collaborators: CollaboratorType[] = await getCollaborators(
    params.userUsername,
    params.projectName
  )
  const usersOfStars: UserOfStarType[] = await getStars(
    params.userUsername,
    params.projectName
  )

  const collaboratorOfProject =
    session &&
    collaborators.some(
      (collaborator) =>
        collaborator.username === session.user.username &&
        collaborator.status !== 'pending'
    )
  const projectOfCurrentUser =
    session && session.user.username === params.userUsername

  return (
    <Fragment>
      {/* @ts-ignore */}
      <Sidebar
        userUsername={params.userUsername}
        projectName={params.projectName}
        project={project}
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
            <div className={styles.pageHeaderRight}>
              <Suspense
                fallback={
                  <button type='button' className={styles.primaryButton}>
                    <svg
                      viewBox='0 0 16 16'
                      className={styles.primaryButtonSvg}
                    >
                      <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z'></path>
                    </svg>
                    <span className={styles.primaryButtonText}>Star</span>
                  </button>
                }
              >
                <StarProjectButton
                  project={project}
                  usersOfStars={usersOfStars}
                />
              </Suspense>
              <Suspense>
                {(projectOfCurrentUser || collaboratorOfProject) && (
                  <Link
                    href={`/${params.userUsername}/${params.projectName}/settings`}
                    className={styles.primaryButton}
                  >
                    <svg
                      viewBox='0 0 16 16'
                      className={styles.primaryButtonSvg}
                    >
                      <path d='M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z'></path>
                    </svg>
                    <span className={styles.primaryButtonText}>Settings</span>
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

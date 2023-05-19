import styles from './page.module.css'
import { Fragment, ReactNode } from 'react'
import { Sidebar } from '../sidebar'
import { ProjectType } from '@/types'

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

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: {
    userUsername: string
    projectName: string
  }
}) {
  const project: ProjectType = await getProject(
    params.userUsername,
    params.projectName
  )

  return (
    <Fragment>
      {/* @ts-ignore */}
      <Sidebar
        project={project}
        userUsername={params.userUsername}
        projectName={params.projectName}
      />
      <main className={styles.main}>{children}</main>
    </Fragment>
  )
}

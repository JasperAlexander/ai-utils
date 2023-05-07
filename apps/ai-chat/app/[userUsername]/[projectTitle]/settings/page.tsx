import styles from './page.module.css'
import { ProjectType } from '@/types'

async function getProject(username: string, title: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects/${title}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch project')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: {
    userUsername: string
    projectTitle: string
  }
}) {
  const project: ProjectType = await getProject(
    params.userUsername,
    params.projectTitle
  )

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>
        Settings of project {params.projectTitle}
      </h2>
    </div>
  )
}

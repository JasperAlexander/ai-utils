import styles from './page.module.css'
import { Form } from './form'
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

export default async function Page({
  params,
}: {
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
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Project settings</h1>
      </div>
      <div className={styles.main}>
        <Form project={project} />
      </div>
    </div>
  )
}

import styles from './page.module.css'
import { Form } from './form'
import { FolderType } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

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

export default async function Page({
  params,
}: {
  params: { userUsername: string; projectName: string; folderId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session)
    redirect(`/${params.userUsername}/${params.projectName}/${params.folderId}`)

  const folder: FolderType = await getFolder(params.folderId)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Folder settings</h1>
      </div>
      <div className={styles.main}>
        <Form folder={folder} />
      </div>
    </div>
  )
}

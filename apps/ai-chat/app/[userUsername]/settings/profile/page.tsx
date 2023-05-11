import styles from './page.module.css'
import { Form } from './form'
import { UserType } from '@/types'

async function getUser(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch user')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { userUsername: string }
}) {
  const user: UserType = await getUser(params.userUsername)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile settings</h1>
      </div>
      <div className={styles.main}>
        <Form user={user} />
      </div>
    </div>
  )
}

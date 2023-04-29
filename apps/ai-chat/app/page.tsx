import styles from './page.module.css'
import { UserType } from '@/types'

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch users')

  return res.json()
}

export default async function Page() {
  const users: UserType[] = await getUsers()

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionLeft}>
          <h1 className={styles.title}>DeerChat</h1>
          <h2 className={styles.subtitle}>
            Harness the Power of AI Conversations
          </h2>
        </div>
        {/* <div className={styles.sectionRight}>

        </div> */}
      </section>
      {/* <h2 className={styles.title}>All users</h2>
      <div className={styles.userList}>
        {users.map((user) => (
          <Link href={`/${user.username}`}>{user.name}</Link>
        ))}
      </div> */}
    </div>
  )
}

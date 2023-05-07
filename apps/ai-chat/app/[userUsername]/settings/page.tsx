import styles from './page.module.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { UserType } from '@/types'
import { redirect } from 'next/navigation'

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
  const session = await getServerSession(authOptions)
  const settingsOfCurrentUser = params.userUsername === session?.user.username
  if (!settingsOfCurrentUser) redirect(`/${params.userUsername}`)

  const user: UserType = await getUser(params.userUsername)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Settings of user {params.userUsername}</h2>
    </div>
  )
}

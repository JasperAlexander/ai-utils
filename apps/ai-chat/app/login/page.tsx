import styles from './page.module.css'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { SignInButtons } from './signInButtons'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (session) redirect(`/${session.user.username}`)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Welcome to AI chat</h2>
      <SignInButtons />
    </div>
  )
}

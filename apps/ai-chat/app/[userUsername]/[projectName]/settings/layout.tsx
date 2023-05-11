import styles from './page.module.css'
import { Fragment, ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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
  const session = await getServerSession(authOptions)
  const settingsOfCurrentUser = params.userUsername === session?.user.username
  if (!settingsOfCurrentUser)
    redirect(`/${params.userUsername}/${params.projectName}`)

  return (
    <Fragment>
      {/* @ts-ignore */}
      <Sidebar
        username={params.userUsername}
        projectName={params.projectName}
      />
      <main className={styles.main}>{children}</main>
    </Fragment>
  )
}

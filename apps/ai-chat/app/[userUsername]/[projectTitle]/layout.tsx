import styles from './page.module.css'
import { Fragment, ReactNode, Suspense } from 'react'
import { SidebarSkeleton } from './sidebarSkeleton'
import { Sidebar } from './sidebar'

export default function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: {
    userUsername: string
    projectTitle: string
  }
}) {
  return (
    <Fragment>
      <Suspense
        fallback={
          <SidebarSkeleton
            userUsername={params.userUsername}
            projectTitle={params.projectTitle}
          />
        }
      >
        {/* @ts-ignore */}
        <Sidebar
          userUsername={params.userUsername}
          projectTitle={params.projectTitle}
        />
      </Suspense>
      <main className={styles.main}>{children}</main>
    </Fragment>
  )
}

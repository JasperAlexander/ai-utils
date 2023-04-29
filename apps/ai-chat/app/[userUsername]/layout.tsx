import styles from './page.module.css'
import { Fragment, ReactNode, Suspense } from 'react'
import { SidebarSkeleton } from './sidebarSkeleton'
import { Sidebar } from './sidebar'

export default function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: { userUsername: string }
}) {
  return (
    <Fragment>
      <Suspense
        fallback={<SidebarSkeleton userUsername={params.userUsername} />}
      >
        {/* @ts-ignore */}
        <Sidebar userUsername={params.userUsername} />
      </Suspense>
      <main className={styles.main}>{children}</main>
    </Fragment>
  )
}

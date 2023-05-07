import styles from './page.module.css'
import { Fragment, ReactNode } from 'react'
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
      {/* @ts-ignore */}
      <Sidebar username={params.userUsername} />
      <main className={styles.main}>{children}</main>
    </Fragment>
  )
}

import styles from './page.module.css'
import { Fragment, ReactNode } from 'react'
import { Sidebar } from '../sidebar'

export default function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: {
    userUsername: string
    projectName: string
  }
}) {
  return (
    <Fragment>
      {/* @ts-ignore */}
      <Sidebar
        userUsername={params.userUsername}
        projectName={params.projectName}
      />
      <main className={styles.main}>{children}</main>
    </Fragment>
  )
}

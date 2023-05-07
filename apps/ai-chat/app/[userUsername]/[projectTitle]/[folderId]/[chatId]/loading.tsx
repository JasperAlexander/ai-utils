import styles from './page.module.css'
import { SidebarButtonSkeleton } from '../sidebarButtonSkeleton'

export default function Loading() {
  return (
    <div className={styles.chatPage}>
      <div className={styles.chatPageHeader}>
        <SidebarButtonSkeleton />

        <span className={styles.chatPageHeaderTitle}>Chat</span>
      </div>
    </div>
  )
}

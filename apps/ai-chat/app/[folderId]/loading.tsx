import styles from './page.module.css'
import { FolderTitleSkeleton } from './folderTitleSkeleton'
import { SidebarButtonSkeleton } from './sidebarButtonSkeleton'

export default function Loading() {
  return (
    <div className={styles.folderPage}>
      <div className={styles.folderPageHeader}>
        <SidebarButtonSkeleton />
        <FolderTitleSkeleton folderTitle='Folder' />
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeaderRowCell}>Name</th>
            <th className={styles.tableHeaderRowCell}>Last update</th>
            <th className={styles.tableHeaderRowCell}>Actions</th>
          </tr>
        </thead>
        <tbody />
      </table>
    </div>
  )
}

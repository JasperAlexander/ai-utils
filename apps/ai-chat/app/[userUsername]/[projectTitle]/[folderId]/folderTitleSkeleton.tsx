import styles from './page.module.css'

export function FolderTitleSkeleton({
  folderTitle,
}: {
  folderTitle: string | undefined
}) {
  return <h2 className={styles.folderPageTitle}>{folderTitle}</h2>
}

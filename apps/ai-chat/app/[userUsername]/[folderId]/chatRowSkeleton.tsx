import styles from './page.module.css'
import Link from 'next/link'
import { ChatType } from '@/types'

export function ChatRowSkeleton({
  chat,
  folderId,
  folderCreatedByCurrentUser,
}: {
  chat: ChatType
  folderId: string
  folderCreatedByCurrentUser: boolean
}) {
  const { _id, title } = chat

  return (
    <tr className={styles.tableBodyRow}>
      <td className={styles.tableBodyRowData}>
        <div className={styles.chatTitle}>
          <svg viewBox='0 0 16 16' className={styles.chatSvg}>
            <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
          </svg>
          <Link href={`/${folderId}/${_id}`} className={styles.chatTitleLink}>
            {title}
          </Link>
        </div>
      </td>
      <td className={styles.tableBodyRowData}>
        <div className={styles.chatLastUpdate}>
          <span className={styles.chatLastUpdateSpan} />
        </div>
      </td>
      {folderCreatedByCurrentUser && (
        <td className={styles.tableBodyRowData}>
          <div className={styles.chatActions}>
            <button type='button' className={styles.chatEditButton}>
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                className={styles.chatEditButtonSvg}
              >
                <path d='M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z'></path>
              </svg>
            </button>
            <button type='button' className={styles.chatRemoveButton}>
              <svg
                className={styles.chatRemoveButtonSvg}
                aria-hidden='true'
                viewBox='0 0 16 16'
                data-view-component='true'
              >
                <path d='M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z'></path>
              </svg>
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}

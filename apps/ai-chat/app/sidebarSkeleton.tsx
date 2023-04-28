import styles from './page.module.css'

export function SidebarSkeleton() {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <button type='button' className={styles.sidebarCloseButton}>
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                className={styles.sidebarCloseButtonSvg}
              >
                <path d='m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z'></path>
                <path d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z'></path>
              </svg>
            </button>
            <h2 className={styles.sidebarHeaderTitle}>Chats</h2>

            <button type='button' className={styles.addChatButton}>
              <svg aria-hidden='true' viewBox='0 0 16 16'>
                <path d='M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z'></path>
              </svg>
            </button>
          </div>
          <div className={styles.searchbar}>
            <svg
              aria-hidden='true'
              viewBox='0 0 16 16'
              className={styles.searchbarSvg}
            >
              <path d='M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z'></path>
            </svg>
            <input
              type='text'
              placeholder='Go to chat'
              className={styles.searchbarInput}
            />
          </div>
          <div className={styles.sidebarChats}></div>
        </div>
      </div>
      <div className={styles.resizerContainer}>
        <div className={styles.resizer} />
      </div>
    </aside>
  )
}

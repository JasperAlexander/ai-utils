'use client'

import styles from './page.module.css'
import { Fragment, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/navigation'
import { FolderType, ProjectType } from '@/types'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'

export function AddButton({
  project,
  folders,
}: {
  project: ProjectType
  folders: FolderType[]
}) {
  const router = useRouter()
  const session = useSession()

  const [tooltipMenuOpen, setTooltipMenuOpen] = useState(false)
  const [documentReady, setDocumentReady] = useState(false)

  useEffect(() => {
    const onReady = () => setDocumentReady(true)

    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      onReady()
    } else {
      document.addEventListener('DOMContentLoaded', onReady)
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', onReady)
    }
  }, [])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => setTooltipMenuOpen(true)}
        className={styles.addButton}
        data-tooltip-id={'addchat-tooltip'}
      >
        <svg aria-hidden='true' viewBox='0 0 16 16'>
          <path d='M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z'></path>
        </svg>
      </button>
      {documentReady &&
        createPortal(
          <Tooltip
            id={'addchat-tooltip'}
            className={styles.tooltipMenu}
            offset={0}
            isOpen={tooltipMenuOpen}
            setIsOpen={setTooltipMenuOpen}
            openOnClick={true}
            closeOnEsc={true}
            clickable={true}
            place='bottom'
          >
            <ul className={styles.tooltipMenuList}>
              <li className={styles.tooltipMenuListItemContainer}>
                <button
                  type='button'
                  onClick={async () => {
                    let folderId = folders[0]?._id
                    if (folders.length === 0) {
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE}/api/folders`,
                        {
                          method: 'POST',
                          body: JSON.stringify({
                            part_of: project._id,
                            created_by: session.data?.user._id,
                          }),
                        }
                      )
                      folderId = await response.json()
                      router.refresh()
                    }

                    await fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE}/api/chats`,
                      {
                        method: 'POST',
                        body: JSON.stringify({
                          folder_id: folderId,
                          created_by: session.data?.user._id,
                        }),
                      }
                    )
                    setTooltipMenuOpen(false)
                    router.refresh()
                  }}
                  className={styles.tooltipMenuListItem}
                >
                  <svg
                    viewBox='0 0 16 16'
                    className={styles.tooltipMenuListItemSvg}
                  >
                    <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z'></path>
                  </svg>
                  <span className={styles.tooltipMenuListItemSpan}>
                    Add chat
                  </span>
                </button>
              </li>
              <li className={styles.tooltipMenuListItemContainer}>
                <button
                  type='button'
                  onClick={async () => {
                    await fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE}/api/folders`,
                      {
                        method: 'POST',
                        body: JSON.stringify({
                          created_by: session.data?.user._id,
                        }),
                      }
                    )
                    setTooltipMenuOpen(false)
                    router.refresh()
                  }}
                  className={styles.tooltipMenuListItem}
                >
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 16 16'
                    className={styles.tooltipMenuListItemSvg}
                  >
                    <path d='M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z'></path>
                  </svg>
                  <span className={styles.tooltipMenuListItemSpan}>
                    Add folder
                  </span>
                </button>
              </li>
            </ul>
          </Tooltip>,
          document.body
        )}
    </Fragment>
  )
}

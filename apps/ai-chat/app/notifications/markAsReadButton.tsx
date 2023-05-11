'use client'

import styles from './page.module.css'
import { NotificationType } from '@/types'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { Tooltip } from 'react-tooltip'

export function MarkAsReadButton({
  notification,
}: {
  notification: NotificationType
}) {
  const router = useRouter()

  return (
    <Fragment>
      <button
        type='button'
        className={styles.tableBodyRowDataContentButton}
        onClick={async () => {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/${notification._id}`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                read: !notification.read,
              }),
            }
          )
          router.refresh()
        }}
        data-tooltip-id={`marknotificationasread-tooltip-${notification._id}`}
      >
        {notification.read ? (
          <svg
            viewBox='0 0 16 16'
            className={styles.tableBodyRowDataContentButtonSvg}
          >
            <path d='M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z'></path>
          </svg>
        ) : (
          <svg
            viewBox='0 0 16 16'
            className={styles.tableBodyRowDataContentButtonSvg}
          >
            <path d='M7.115.65a1.752 1.752 0 0 1 1.77 0l6.25 3.663c.536.314.865.889.865 1.51v6.427A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25V5.823c0-.621.33-1.196.865-1.51Zm1.011 1.293a.252.252 0 0 0-.252 0l-5.72 3.353L6.468 7.76a2.748 2.748 0 0 1 3.066 0l4.312-2.464-5.719-3.353ZM13.15 12.5 8.772 9.06a1.25 1.25 0 0 0-1.544 0L2.85 12.5Zm1.35-5.85-3.687 2.106 3.687 2.897ZM5.187 8.756 1.5 6.65v5.003Z'></path>
          </svg>
        )}
      </button>
      <Tooltip
        id={`marknotificationasread-tooltip-${notification._id}`}
        content={notification.read ? 'Mark as unread' : 'Mark as read'}
        place='bottom'
      />
    </Fragment>
  )
}

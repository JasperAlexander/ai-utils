'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { NotificationType } from '@/types'

export function NotificationLink({
  notification,
}: {
  notification: NotificationType
}) {
  return (
    <Link
      href={`/${notification.project_created_by}/${notification.project_name}/invitations`}
      className={`${styles.tableBodyRowDataContentLink} ${
        notification.read && styles.notificationRead
      }`}
      onClick={() => {
        if (notification.read) return
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/notifications/${notification._id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              read: true,
            }),
          }
        )
      }}
    >
      You're invited by {notification.created_by} to collaborate on{' '}
      {notification.project_name}
    </Link>
  )
}

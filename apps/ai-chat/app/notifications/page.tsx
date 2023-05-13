import styles from './page.module.css'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { NotificationType } from '@/types'
import { Suspense } from 'react'
import { relativeTimeFormat } from '@/utils/relativeTimeFormat'
import { MarkAsReadButton } from './markAsReadButton'
import { DeleteNotificationButton } from './deleteNotificationButton'
import { NotificationLink } from './notificationLink'

async function getNotifications(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/notifications`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch notifications')

  return res.json()
}

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const notifications: NotificationType[] = await getNotifications(
    session.user.username!
  )

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h2>Notifications</h2>
          </div>
        </div>
        <span className={styles.description}>This are your notifications</span>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderRowCell}>Content</th>
              <th className={styles.tableHeaderRowCell}>Last update</th>
              <th className={styles.tableHeaderRowCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <Suspense>
              {notifications.map((notification) => (
                <tr key={notification._id} className={styles.tableBodyRow}>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <svg
                        viewBox='0 0 16 16'
                        className={styles.tableBodyRowDataContentSvg}
                      >
                        <path d='M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z'></path>
                      </svg>
                      {notification.type === 'collaboration' && (
                        <Suspense
                          fallback={
                            <Link
                              href={`/${notification.project_created_by}/${notification.project_name}/invitations`}
                              className={`${
                                styles.tableBodyRowDataContentLink
                              } ${
                                notification.read && styles.notificationRead
                              }`}
                            >
                              You're invited by {notification.created_by} to
                              collaborate on {notification.project_name}
                            </Link>
                          }
                        >
                          <NotificationLink notification={notification} />
                        </Suspense>
                      )}
                    </div>
                  </td>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <span className={styles.tableBodyRowDataContentSpan}>
                        {notification.updated_at &&
                          relativeTimeFormat(new Date(notification.updated_at))}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <Suspense
                        fallback={
                          <button
                            type='button'
                            className={styles.tableBodyRowDataContentButton}
                          >
                            <svg
                              viewBox='0 0 16 16'
                              className={
                                styles.tableBodyRowDataContentButtonSvg
                              }
                            >
                              <path d='M7.115.65a1.752 1.752 0 0 1 1.77 0l6.25 3.663c.536.314.865.889.865 1.51v6.427A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25V5.823c0-.621.33-1.196.865-1.51Zm1.011 1.293a.252.252 0 0 0-.252 0l-5.72 3.353L6.468 7.76a2.748 2.748 0 0 1 3.066 0l4.312-2.464-5.719-3.353ZM13.15 12.5 8.772 9.06a1.25 1.25 0 0 0-1.544 0L2.85 12.5Zm1.35-5.85-3.687 2.106 3.687 2.897ZM5.187 8.756 1.5 6.65v5.003Z'></path>
                            </svg>
                          </button>
                        }
                      >
                        <MarkAsReadButton notification={notification} />
                      </Suspense>
                      <Suspense
                        fallback={
                          <button
                            type='button'
                            className={styles.tableBodyRowDataContentButton}
                          >
                            <svg
                              viewBox='0 0 16 16'
                              className={
                                styles.tableBodyRowDataContentButtonSvg
                              }
                            >
                              <path d='M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z'></path>
                            </svg>
                          </button>
                        }
                      >
                        <DeleteNotificationButton notification={notification} />
                      </Suspense>
                    </div>
                  </td>
                </tr>
              ))}
            </Suspense>
          </tbody>
        </table>
      </div>
    </main>
  )
}

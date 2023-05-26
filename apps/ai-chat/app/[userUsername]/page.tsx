import styles from './page.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectType, ProjectOfStarType, UserType } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { Suspense } from 'react'
import { TabLink } from './tabLink'
import { Items } from './items'

async function getUser(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch user')

  return res.json()
}

async function getProjects(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch projects')

  return res.json()
}

async function getStars(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/stars`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch stars')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { userUsername: string }
}) {
  const session = await getServerSession(authOptions)

  const user: UserType = await getUser(params.userUsername)
  const usersProjects: ProjectType[] | undefined = await getProjects(
    params.userUsername
  )
  const projectsOfStars: ProjectOfStarType[] | undefined = await getStars(
    params.userUsername
  )

  const profileOfCurrentUser = session?.user.username === params.userUsername

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.pageLeft}>
          <Suspense>
            <Image
              src={user.image}
              alt='avatar'
              width={0}
              height={0}
              className={styles.avatar}
            />
          </Suspense>
          <div className={styles.userNames}>
            <Suspense>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userUsername}>{user.username}</span>
            </Suspense>
          </div>
          <Suspense>
            <span className={styles.userBio}>{user.bio}</span>
          </Suspense>
          <Suspense>
            {profileOfCurrentUser && (
              <Link
                href={`/${params.userUsername}/settings/profile`}
                className={styles.primaryButton}
              >
                Edit profile
              </Link>
            )}
          </Suspense>
        </div>
        <div className={styles.pageRight}>
          <div className={styles.pageRightHeader}>
            <h3 className={styles.subTitle}>Projects</h3>
            <Suspense>
              {profileOfCurrentUser && (
                <Link href='/create/project' className={styles.primaryButton}>
                  Create project
                </Link>
              )}
            </Suspense>
          </div>
          <div className={styles.tabs}>
            <Suspense>
              <TabLink tab='projects'>
                <div className={styles.tabContent}>
                  <svg viewBox='0 0 16 16' className={styles.tabSvg}>
                    <path d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 6.5v8h7.75a.25.25 0 0 0 .25-.25V6.5Zm8-1.5V1.75a.25.25 0 0 0-.25-.25H6.5V5Zm-13 1.5v7.75c0 .138.112.25.25.25H5v-8ZM5 5V1.5H1.75a.25.25 0 0 0-.25.25V5Z'></path>
                  </svg>
                  <span>Projects</span>
                </div>
              </TabLink>
            </Suspense>
            <Suspense>
              <TabLink tab='stars'>
                <div className={styles.tabContent}>
                  <svg viewBox='0 0 16 16' className={styles.tabSvg}>
                    <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z'></path>
                  </svg>
                  <span>Stars</span>
                </div>
              </TabLink>
            </Suspense>
          </div>
          <div className={styles.projects}>
            <Suspense>
              {/* @ts-ignore */}
              <Items
                projects={usersProjects}
                projectsOfStars={projectsOfStars}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

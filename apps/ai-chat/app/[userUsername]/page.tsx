import styles from './page.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectType, UserType } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { Suspense } from 'react'

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

  const profileOfCurrentUser = session?.user.username === params.userUsername

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.pageLeft}>
          <Suspense>
            <Image
              src={user.image}
              alt='Avatar of user'
              width={300}
              height={300}
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
          <div className={styles.projects}>
            <Suspense>
              {usersProjects?.map((project) => (
                <div key={project._id} className={styles.project}>
                  <div className={styles.projectTop}>
                    <Link
                      href={`/${params.userUsername}/${project.name}`}
                      className={styles.projectName}
                    >
                      {project.name}
                    </Link>
                  </div>
                  <div className={styles.projectBottom}>
                    <span className={styles.projectDescription}>
                      {project.description}
                    </span>
                  </div>
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

import styles from './page.module.css'
import { ProjectType, UserType } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

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

async function getUsersProjects(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch users projects')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { userUsername: string }
}) {
  const user: UserType = await getUser(params.userUsername)
  const usersProjects: ProjectType[] | undefined = await getUsersProjects(
    params.userUsername
  )

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.pageLeft}>
          <Image
            src={user.image}
            alt='Avatar of user'
            width={300}
            height={300}
            className={styles.avatar}
          />
          <div className={styles.userNames}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userUsername}>{user.username}</span>
          </div>
          <span className={styles.userBio}>{user.bio}</span>
        </div>
        <div className={styles.pageRight}>
          <div className={styles.pageRightHeader}>
            <h3 className={styles.subTitle}>Projects</h3>
            <Link href='/create/project' className={styles.primaryButton}>
              Create project
            </Link>
          </div>
          <div className={styles.projects}>
            {usersProjects?.map((project) => (
              <div key={project._id} className={styles.project}>
                <div className={styles.projectTop}>
                  <Link
                    href={`/${params.userUsername}/${project.title}`}
                    className={styles.projectTitle}
                  >
                    {project.title}
                  </Link>
                </div>
                <div className={styles.projectBottom}>
                  <span className={styles.projectDescription}>
                    {project.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

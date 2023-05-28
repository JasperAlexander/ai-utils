import styles from './page.module.css'
import Link from 'next/link'
import { Suspense } from 'react'
import { TrendingProjectType } from '@/types'

async function getTrendingProjects() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/projects/trending`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch trending projects')

  return res.json()
}

export default async function Page() {
  const trendingProjects: TrendingProjectType[] = await getTrendingProjects()

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <h2 className={styles.title}>Explore</h2>
        <span className={styles.subTitle}>Trending projects</span>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderRowCell}></th>
            </tr>
          </thead>
          <tbody>
            <Suspense>
              {trendingProjects.map((project) => (
                <tr key={project._id} className={styles.tableBodyRow}>
                  <td className={styles.tableBodyRowData}>
                    <div className={styles.tableBodyRowDataContent}>
                      <div className={styles.tableBodyRowDataContentTop}>
                        <div className={styles.projectTitle}>
                          <Link
                            href={`/${project.created_by}`}
                            className={styles.tableBodyRowDataContentLink}
                          >
                            {project.created_by}
                          </Link>
                          {' / '}
                          <Link
                            href={`/${project.created_by}/${project.name}`}
                            className={styles.tableBodyRowDataContentLink}
                          >
                            {project.name}
                          </Link>
                        </div>
                        <button type='button'>{project.stars}</button>
                      </div>
                      <div className={styles.tableBodyRowDataContentMiddle}>
                        <span className={styles.description}>
                          {project.description}
                        </span>
                      </div>
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

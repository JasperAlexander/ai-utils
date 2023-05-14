'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { ProjectType, ProjectOfStarType } from '@/types'
import { useParams, useSearchParams } from 'next/navigation'
import { StarProjectButton } from './starProjectButton'

export function Items({
  projects,
  projectsOfStars,
}: {
  projects: ProjectType[] | undefined
  projectsOfStars: ProjectOfStarType[] | undefined
}) {
  const params = useParams()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  if (currentTab === 'stars') {
    return projectsOfStars?.map((project) => (
      <div key={project._id} className={styles.project}>
        <div className={styles.projectTop}>
          <Link
            href={`/${params.userUsername}/${project.name}`}
            className={styles.projectName}
          >
            {project.name}
          </Link>
          <StarProjectButton
            project={project}
            projectsOfStars={projectsOfStars}
          />
        </div>
        <div className={styles.projectBottom}>
          <span className={styles.projectDescription}>
            {project.description}
          </span>
        </div>
      </div>
    ))
  } else {
    return projects?.map((project) => (
      <div key={project._id} className={styles.project}>
        <div className={styles.projectTop}>
          <Link
            href={`/${params.userUsername}/${project.name}`}
            className={styles.projectName}
          >
            {project.name}
          </Link>
          <StarProjectButton
            project={project}
            projectsOfStars={projectsOfStars}
          />
        </div>
        <div className={styles.projectBottom}>
          <span className={styles.projectDescription}>
            {project.description}
          </span>
        </div>
      </div>
    ))
  }
}

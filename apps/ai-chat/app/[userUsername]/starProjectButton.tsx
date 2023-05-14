'use client'

import styles from './page.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ProjectType, ProjectOfStarType, UserOfStarType } from '@/types'

export function StarProjectButton({
  project,
  projectsOfStars,
  usersOfStars,
}: {
  project: ProjectType | ProjectOfStarType
  projectsOfStars?: ProjectOfStarType[]
  usersOfStars?: UserOfStarType[]
}) {
  const router = useRouter()
  const session = useSession()

  const [submitted, setSubmitted] = useState(false)

  const starOfCurrentUser = projectsOfStars
    ? projectsOfStars.find(
        (projectsOfStar) =>
          projectsOfStar.created_by === session.data?.user.username &&
          projectsOfStar._id === project._id
      )
    : usersOfStars
    ? usersOfStars.find((user) => user.username === session.data?.user.username)
    : undefined

  return (
    <button
      type='button'
      onClick={() => {
        setSubmitted(true)
        if (starOfCurrentUser) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/api/stars/${starOfCurrentUser._id}`,
            {
              method: 'DELETE',
              body: JSON.stringify({
                project_id: project._id,
                created_by: session.data?.user.username,
              }),
            }
          )
        } else {
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/stars`, {
            method: 'POST',
            body: JSON.stringify({
              project_id: project._id,
              created_by: session.data?.user._id,
            }),
          })
        }
        router.refresh()
        setSubmitted(false)
      }}
      className={styles.primaryButton}
      disabled={submitted}
    >
      {starOfCurrentUser ? (
        <svg
          viewBox='0 0 16 16'
          className={`${styles.primaryButtonSvg} ${styles.starredSvg}`}
        >
          <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z'></path>
        </svg>
      ) : (
        <svg viewBox='0 0 16 16' className={styles.primaryButtonSvg}>
          <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z'></path>
        </svg>
      )}
      <span className={styles.primaryButtonText}>
        {starOfCurrentUser ? 'Starred' : 'Star'}
      </span>
      {projectsOfStars ? (
        <span className={styles.primaryButtonNumber}>
          {projectsOfStars.length}
        </span>
      ) : (
        usersOfStars && (
          <span className={styles.primaryButtonNumber}>
            {usersOfStars.length}
          </span>
        )
      )}
    </button>
  )
}

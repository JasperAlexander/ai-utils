'use client'

import styles from './page.module.css'
import { ProjectType, UserType } from '@/types'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Form({ project }: { project: ProjectType }) {
  const router = useRouter()
  const session = useSession()
  const params = useParams()

  const [username, setUsername] = useState('')
  const [searchResults, setSearchResults] = useState<UserType[]>([])

  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (username === '') return
    const timeout = setTimeout(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/search/users`,
        {
          method: 'POST',
          body: JSON.stringify({
            username,
          }),
        }
      )
      const foundUsers = await response.json()
      setSearchResults(foundUsers)
    }, 500)
    return () => clearTimeout(timeout)
  }, [username])

  return (
    <div className={styles.form}>
      <div className={styles.formSection}>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabel}>Name</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.textInput}
            spellCheck={false}
          />
        </div>

        <div className={styles.searchResults}>
          {searchResults?.map((result) => (
            <div key={result._id} className={styles.searchResult}>
              <span>{result.name}</span>
              <button
                type='button'
                onClick={async () => {
                  setSubmitted(true)
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/collaborators`,
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        project_id: project._id,
                        user_id: result._id,
                        role: 'collaborator',
                        created_by: session.data?.user._id,
                        user_username: params.userUsername,
                        project_name: project.name,
                      }),
                    }
                  )
                  await response.json()
                  router.refresh()
                  setSubmitted(false)
                }}
                className={styles.primaryButton}
                disabled={submitted}
              >
                Add collaborator
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

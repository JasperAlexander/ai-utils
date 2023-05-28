'use client'

import styles from './page.module.css'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const session = useSession()
  if (!session) redirect('/')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('private')

  const [usernameChecked, setUsernameChecked] = useState(false)
  const [usernameTaken, setUsernameTaken] = useState<boolean>(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (name === '') return
    const timeout = setTimeout(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/validate/project`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: name,
            description: description,
            visibility: visibility,
            created_by: session.data?.user.username,
          }),
        }
      )
      if (response.ok) {
        setUsernameTaken(false)
      } else {
        setUsernameTaken(true)
      }
      setUsernameChecked(true)
    }, 500)
    return () => clearTimeout(timeout)
  }, [name, description, visibility, session.data?.user.username])

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.form}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create a project</h1>
            <span className={styles.description}>
              A project contains all project files like chats and folders.
            </span>
          </div>
          <div className={styles.formSection}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Title</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.textInput}
              />
              {usernameChecked ? (
                name === '' ? (
                  <span className={styles.inputStatusError}>
                    Project name must not be blank
                  </span>
                ) : usernameTaken ? (
                  <span className={styles.inputStatusError}>
                    The project name already exists on this user
                  </span>
                ) : (
                  <span className={styles.inputStatusSuccess}>
                    The project name is available
                  </span>
                )
              ) : (
                ''
              )}
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Description</label>
              <input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>
          <div className={styles.formSection}>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxRow}>
                <input
                  type='radio'
                  value='private'
                  checked={visibility === 'private'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className={styles.checkboxInput}
                />
                <label className={styles.inputLabel}>Private</label>
              </div>
              <div className={styles.checkboxRow}>
                <input
                  type='radio'
                  value='public'
                  checked={visibility === 'public'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className={styles.checkboxInput}
                />
                <label className={styles.inputLabel}>Public</label>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <button
              type='button'
              onClick={async () => {
                setSubmitted(true)
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_BASE}/api/projects`,
                  {
                    method: 'POST',
                    body: JSON.stringify({
                      name,
                      description,
                      visibility,
                      created_by: session.data?.user.username,
                    }),
                  }
                )
                await response.json()
                router.push(`/${session.data?.user.username}/${name}`)
              }}
              disabled={
                !usernameChecked || name === '' || usernameTaken || submitted
              }
              className={styles.primaryButton}
            >
              Create project
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

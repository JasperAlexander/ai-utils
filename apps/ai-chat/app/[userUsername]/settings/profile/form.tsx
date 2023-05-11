'use client'

import styles from './page.module.css'
import { UserType } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Form({ user }: { user: UserType }) {
  const router = useRouter()

  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)

  const [submitted, setSubmitted] = useState(false)

  return (
    <div className={styles.form}>
      <div className={styles.formSection}>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabel}>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.textInput}
            spellCheck={false}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabel}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={styles.textInput}
            spellCheck={false}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <button
          type='button'
          onClick={async () => {
            setSubmitted(true)
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${user.username}`,
              {
                method: 'PATCH',
                body: JSON.stringify({
                  name,
                  bio,
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
          Update profile
        </button>
      </div>
    </div>
  )
}

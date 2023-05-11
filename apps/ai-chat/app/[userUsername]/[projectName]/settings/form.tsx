'use client'

import styles from './page.module.css'
import { ProjectType } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export function Form({ project }: { project: ProjectType }) {
  const router = useRouter()
  const params = useParams()

  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description)
  const [visibility, setVisibility] = useState(project.visibility)

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
          <label className={styles.inputLabel}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textInput}
            spellCheck={false}
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
              `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${params.userUsername}/projects/${project.name}`,
              {
                method: 'PATCH',
                body: JSON.stringify({
                  name,
                  description,
                  visibility,
                }),
              }
            )
            await response.json()
            router.refresh()
            router.push(`/${params.userUsername}/${name}`)
          }}
          className={styles.primaryButton}
        >
          Update project
        </button>
      </div>
    </div>
  )
}

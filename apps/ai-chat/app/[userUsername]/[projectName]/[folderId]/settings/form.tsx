'use client'

import styles from './page.module.css'
import { FolderType } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export function Form({ folder }: { folder: FolderType }) {
  const router = useRouter()
  const params = useParams()

  const [title, setTitle] = useState(folder.title)

  const [submitted, setSubmitted] = useState(false)

  return (
    <div className={styles.form}>
      <div className={styles.formSection}>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabel}>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              `${process.env.NEXT_PUBLIC_API_BASE}/api/folders/${folder._id}`,
              {
                method: 'PATCH',
                body: JSON.stringify({
                  title,
                }),
              }
            )
            await response.json()
            router.refresh()
            router.push(
              `/${params.userUsername}/${params.projectName}/${params.folderId}`
            )
            setSubmitted(false)
          }}
          className={styles.primaryButton}
          disabled={submitted}
        >
          Update folder
        </button>
      </div>
    </div>
  )
}

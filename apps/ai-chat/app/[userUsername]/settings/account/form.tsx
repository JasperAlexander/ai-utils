'use client'

import styles from './page.module.css'
import { UserType } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Form({ user }: { user: UserType }) {
  const router = useRouter()

  const [submitted, setSubmitted] = useState(false)

  return (
    <div className={styles.form}>
      <div className={styles.footer}>
        <button
          type='button'
          onClick={async () => {
            // setSubmitted(true)
            // const response = await fetch(
            //   `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${user.username}`,
            //   {
            //     method: 'DELETE'
            //   }
            // )
            // await response.json()
            // router.refresh()
            // setSubmitted(false)
          }}
          className={styles.primaryButton}
          disabled={submitted}
        >
          Delete account
        </button>
      </div>
    </div>
  )
}

'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CollaboratorType } from '@/types'

export function AcceptInvitationButton({
  collaborator,
}: {
  collaborator: CollaboratorType
}) {
  const params = useParams()

  return (
    <Link
      href={`/${params.userUsername}/${params.projectName}`}
      onClick={() => {
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/collaborators/${collaborator._id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              status: 'accepted',
            }),
          }
        )
      }}
      className={styles.primaryButton}
    >
      Accept
    </Link>
  )
}

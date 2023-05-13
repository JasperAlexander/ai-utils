import styles from './page.module.css'
import { CollaboratorType } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AcceptInvitationButton } from './acceptInvitationButton'
import { DeclineInvitationButton } from './declineInvitationButton'

async function getCollaborators(username: string, name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/users/${username}/projects/${name}/collaborators`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch collaborators')

  return res.json()
}

export default async function Page({
  params,
}: {
  params: {
    userUsername: string
    projectName: string
  }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/login`)

  const collaborators: CollaboratorType[] = await getCollaborators(
    params.userUsername,
    params.projectName
  )

  const collaboratorWithPendingInvite = collaborators.find(
    (collaborator) =>
      collaborator.username === session.user.username &&
      collaborator.status === 'pending'
  )
  if (!collaboratorWithPendingInvite)
    redirect(`/${params.userUsername}/${params.projectName}`)

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <span>
          {collaboratorWithPendingInvite.created_by} invited you to collaborate
          on {params.projectName}
        </span>
        <div className={styles.buttons}>
          <Suspense>
            <AcceptInvitationButton
              collaborator={collaboratorWithPendingInvite}
            />
          </Suspense>
          <Suspense>
            <DeclineInvitationButton
              collaborator={collaboratorWithPendingInvite}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

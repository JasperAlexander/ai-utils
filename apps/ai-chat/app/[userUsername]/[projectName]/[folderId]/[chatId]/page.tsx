import styles from './page.module.css'
import { ChatType, CollaboratorType, MessageType } from '@/types'
import { ShowSidebarButton } from '../../showSidebarButton'
import { Suspense } from 'react'
import { Messages } from './messages'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function getChat(chat_id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/chats/${chat_id}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch chat')

  return res.json()
}

async function getMessages(chat_id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/chats/${chat_id}/messages`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch messages')

  return res.json()
}

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

export default async function ChatPage({
  params,
}: {
  params: {
    userUsername: string
    projectName: string
    chatId: string
  }
}) {
  const session = await getServerSession(authOptions)

  const chat: ChatType = await getChat(params.chatId)
  const messages: MessageType[] = await getMessages(params.chatId)
  const collaborators: CollaboratorType[] = await getCollaborators(
    params.userUsername,
    params.projectName
  )

  const currentUserAllowedToChat =
    chat.created_by === session?.user.username ||
    collaborators.some(
      (collaborator) => collaborator.username === session?.user.username
    )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <Suspense
            fallback={
              <button type='button' className={styles.showSidebarButton}>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 16 16'
                  className={styles.showSidebarButtonSvg}
                >
                  <path d='M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z'></path>
                  <path d='M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z'></path>
                </svg>
              </button>
            }
          >
            <ShowSidebarButton />
          </Suspense>

          <span className={styles.pageHeaderTitle}>{chat.title}</span>
        </div>
      </div>

      <Suspense>
        <Messages
          currentUserAllowedToChat={currentUserAllowedToChat}
          messages={messages}
        />
      </Suspense>
    </div>
  )
}

import styles from './page.module.css'
import { ChatType, MessageType } from '@/types'
import { SidebarButton } from '../sidebarButton'
import { Suspense } from 'react'
import { SidebarButtonSkeleton } from '../sidebarButtonSkeleton'
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

export default async function ChatPage({
  params: { chatId },
}: {
  params: { chatId: string }
}) {
  const session = await getServerSession(authOptions)

  const chat: ChatType = await getChat(chatId)
  const messages: MessageType[] = await getMessages(chatId)

  const chatCreatedByCurrentUser = chat.created_by === session?.user.username

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatPageHeader}>
        <Suspense fallback={<SidebarButtonSkeleton />}>
          <SidebarButton />
        </Suspense>

        <span className={styles.chatPageHeaderTitle}>{chat.title}</span>
      </div>

      <Suspense>
        <Messages
          chatCreatedByCurrentUser={chatCreatedByCurrentUser}
          messages={messages}
        />
      </Suspense>
    </div>
  )
}

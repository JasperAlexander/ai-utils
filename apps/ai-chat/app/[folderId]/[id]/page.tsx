import styles from './page.module.css'
import { ChatType, MessageType } from '@/types'
import { SidebarButton } from '../sidebarButton'
import { Suspense } from 'react'
import { SidebarButtonSkeleton } from '../sidebarButtonSkeleton'
import { Messages } from './messages'
import { InputSkeleton } from './inputSkeleton'

async function getChats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch chats')

  return res.json()
}

async function getMessages(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/messages/${id}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch messages')

  return res.json()
}

export default async function ChatPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const chats: ChatType[] = await getChats()
  const messages: MessageType[] = await getMessages(id)

  const title = chats.find((chat) => chat._id === id)?.title || 'Chat'

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatPageHeader}>
        <Suspense fallback={<SidebarButtonSkeleton />}>
          <SidebarButton />
        </Suspense>

        <span className={styles.chatPageHeaderTitle}>{title}</span>
      </div>

      <Suspense
        fallback={
          <div className={styles.footer}>
            <InputSkeleton />
          </div>
        }
      >
        <Messages messages={messages} />
      </Suspense>
    </div>
  )
}

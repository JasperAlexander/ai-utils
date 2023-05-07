import styles from './page.module.css'
import Link from 'next/link'
import { UserType } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch users')

  return res.json()
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  const users: UserType[] = await getUsers()

  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.sectionOne}`}>
        <div className={styles.sectionLeft}>
          <h1 className={styles.title}>DeerChat</h1>
          <h2 className={styles.subtitle}>
            Harness the Power of AI Conversations
          </h2>
          <Link
            href={session ? `/${session.user.username}` : '/login'}
            className={styles.primaryButton}
          >
            <span>Start chatting</span>
            <svg viewBox='0 0 16 16' className={styles.primaryButtonArrow}>
              <path d='M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z'></path>
            </svg>
          </Link>
        </div>
        <div className={styles.sectionRight}>
          <div className={styles.messages}>
            <div className={styles.message}>
              <div className={styles.messageHeader} />
              <span className={styles.messageContent}></span>
            </div>
            <div className={styles.message}>
              <div className={styles.messageHeader} />
              <span className={styles.messageContent}></span>
            </div>
            <div className={styles.message}>
              <div className={styles.messageHeader} />
              <span className={styles.messageContent}></span>
            </div>
            <div className={styles.message}>
              <div className={styles.messageHeader} />
              <span className={styles.messageContent}></span>
            </div>
            <div className={styles.message}>
              <div className={styles.messageHeader} />
              <span className={styles.messageContent}></span>
            </div>
            <div className={styles.message}>
              <div className={styles.messageHeader} />
              <span className={styles.messageContent}></span>
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.sectionTwo}`}>
        <div className={styles.sectionTop}>
          <h1 className={styles.title}>Features</h1>
          {/* <h2 className={styles.subtitle}>
            Features
          </h2> */}
        </div>
        <div className={styles.sectionBottom}>
          <div className={styles.box}>
            <div className={styles.boxContent}>
              <span className={styles.boxText}>Add files</span>
              <svg className={styles.boxSvg} viewBox='0 0 16 16'>
                <path d='M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z'></path>
              </svg>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxContent}>
              <span className={styles.boxText}>Categorize and save chats</span>
              <svg className={styles.boxSvg} viewBox='0 0 16 16'>
                <path d='m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z'></path>
              </svg>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxContent}>
              <span className={styles.boxText}>
                Markdown and syntax highlighting
              </span>
              <svg className={styles.boxSvg} viewBox='0 0 16 16'>
                <path d='M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z'></path>
              </svg>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxContent}>
              <span className={styles.boxText}>
                Resend, edit, remove and copy
              </span>
              <svg className={styles.boxSvg} viewBox='0 0 16 16'>
                <path d='M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z'></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* <h2 className={styles.title}>All users</h2>
      <div className={styles.userList}>
        {users.map((user) => (
          <Link href={`/${user.username}`}>{user.name}</Link>
        ))}
      </div> */}
    </div>
  )
}

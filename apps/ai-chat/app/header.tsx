import styles from './page.module.css'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { Fragment } from 'react'
import { AccountButton } from './accountButton'
import { authOptions } from './api/auth/[...nextauth]/route'

export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Link href='/' className={styles.headerLogo}>
          <svg
            className={styles.headerLogoSvg}
            viewBox='0 0 128 128'
            transform='rotate(0)matrix(-1, 0, 0, 1, 0, 0)'
          >
            <g strokeWidth='0'></g>
            <g strokeLinecap='round' strokeLinejoin='round'></g>
            <g>
              <path d='M96,56H56l-7.6-11.5l-1.8,4.3L46.1,52c-0.3,1.9-1.8,3.4-3.5,3.4h-5.2c-0.5,0-1-0.1-1.4-0.3 c0,6.2,0,13.3,0,13.4L25.8,78.8c-0.7,0.7-1,1.6-1,2.5c0,0.9,0.3,1.8,1,2.5l7.8,7.8c1.4,1.4,3.6,1.4,4.9,0c1.4-1.4,1.4-3.6,0-4.9 l-5.3-5.3l5.6-5.6c1.4,1.6,3.2,2.9,5.2,3.6v29.2c0,1.9,1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5V80h16.6l9.5,9.5l-9.9,17.2 c-1,1.7-0.4,3.8,1.3,4.8c1.7,1,3.8,0.4,4.8-1.3l10.3-17.8c0.3-0.5,0.4-1.1,0.5-1.7l0,0V80.4l9,9v19.1c0,1.9,1.6,3.5,3.5,3.5 s3.5-1.6,3.5-3.5V64c2.2,0,4-1.8,4-4V48L96,56z' />
              <path d='M58,18c0-1.1-0.9-2-2-2s-2,0.9-2,2c0,3-0.9,5.8-2.6,8.2c-1.6-2.4-2.5-5.2-2.5-8.1c0-1.1-0.9-2-2-2s-2,0.9-2,2 c0,4.1,1.3,8,3.8,11.1c-2.4,2-5.5,3.1-8.8,3.2c-3.3-0.1-6.3-1.3-8.7-3.2C33.7,26,35,22.1,35,18c0-1.1-0.9-2-2-2s-2,0.9-2,2 c0,2.9-0.9,5.8-2.5,8.1c-1.6-2.3-2.5-5.1-2.5-8.1c0-1.1-0.9-2-2-2s-2,0.9-2,2c0,5.8,2.7,11,7,14.3H24c0,2.9,2.4,5.3,5.3,5.3h1.5 l4.5,10.6l0.5,3.5c0.1,0.9,0.8,1.7,1.5,1.7h5.2c0.7,0,1.4-0.7,1.5-1.7l0.5-3.5l4.5-10.6h1.5c2.9,0,5.3-2.4,5.3-5.3h-5 C55.3,29,58,23.8,58,18z' />
            </g>
          </svg>
          {/* <span className={styles.headerLogoSpan}>DeerChat</span> */}
        </Link>

        <Link
          href={`/${session ? session.user.username : 'login'}`}
          className={styles.headerLeftLink}
        >
          Chats
        </Link>
        <Link href='/explore' className={styles.headerLeftLink}>
          Explore
        </Link>
      </div>

      <div className={styles.headerRight}>
        {session ? (
          <Fragment>
            <Link href='/notifications' className={styles.headerRightLinkSvg}>
              <svg viewBox='0 0 16 16'>
                <path d='M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z'></path>
              </svg>
            </Link>
            <AccountButton />
          </Fragment>
        ) : (
          <Fragment>
            <Link href='/login' className={styles.headerRightLink}>
              Sign in
            </Link>
            <Link href='/login' className={styles.headerRightLink}>
              Sign up
            </Link>
          </Fragment>
        )}
      </div>
    </header>
  )
}

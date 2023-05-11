import './globals.css'
import styles from './page.module.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { Header } from './header'
import { getServerSession } from 'next-auth'
import { Providers } from './providers'
import { authOptions } from './api/auth/[...nextauth]/route'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'AI chat',
  description: 'Chat with AI using the OpenAI API.',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' className={inter.className}>
      <body>
        <Providers session={session}>
          {/* @ts-ignore */}
          <Header />
          <div className={styles.layout}>{children}</div>
        </Providers>
      </body>
    </html>
  )
}

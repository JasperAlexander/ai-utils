import './globals.css'
import styles from './page.module.css'
import { ReactNode, Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Header } from './header'
import { HeaderSkeleton } from './headerSkeleton'
import { getServerSession } from 'next-auth'
import { Providers } from './providers'

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
  const session = await getServerSession()

  return (
    <html lang='en' className={inter.className}>
      <body>
        <Providers session={session}>
          <Suspense fallback={<HeaderSkeleton />}>
            {/* @ts-ignore */}
            <Header />
          </Suspense>
          <div className={styles.layout}>{children}</div>
        </Providers>
      </body>
    </html>
  )
}

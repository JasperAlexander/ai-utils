import './globals.css'
import styles from './page.module.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { Sidebar } from './sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI chat',
  description: 'Chat with AI using the OpenAI API.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  )
}

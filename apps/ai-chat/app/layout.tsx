import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { Sidebar } from './sidebar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'AI chat',
  description: 'Chat with AI using the OpenAI API.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <div className='container'>
          {/* @ts-ignore */}
          <Sidebar />
          <main className='main'>{children}</main>
        </div>
      </body>
    </html>
  )
}

'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function SidebarLink({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  const pathName = usePathname()

  return (
    <Link
      href={href}
      className={styles.sidebarLink}
      aria-current={pathName === href ? 'true' : 'false'}
    >
      {children}
    </Link>
  )
}

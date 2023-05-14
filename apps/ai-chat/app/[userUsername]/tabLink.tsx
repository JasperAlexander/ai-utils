'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ReactNode, useCallback } from 'react'

export function TabLink({
  children,
  tab,
}: {
  children: ReactNode
  tab: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <Link
      href={
        tab === 'projects'
          ? pathname
          : pathname + '?' + createQueryString('tab', tab)
      }
      className={`${styles.tab} ${
        (currentTab === tab || (!currentTab && tab === 'projects')) &&
        styles.tabActive
      }`}
    >
      {children}
    </Link>
  )
}

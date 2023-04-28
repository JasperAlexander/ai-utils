'use client'

import styles from './page.module.css'
import { useState } from 'react'

export function Searchbar() {
  const [searchInput, setSearchInput] = useState('')

  return (
    <input
      type='text'
      placeholder='Go to chat'
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className={styles.searchbarInput}
    />
  )
}

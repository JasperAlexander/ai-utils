'use client'

import styles from './page.module.css'
import Image from 'next/image'
import { ProjectType, UserType } from '@/types'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Fragment, useEffect, useRef, useState } from 'react'

export function AddCollaboratorButton({ project }: { project: ProjectType }) {
  const router = useRouter()
  const session = useSession()
  const params = useParams()

  const modal = useRef<HTMLDialogElement>(null)

  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [user, setUser] = useState<UserType>()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (searchInput === '') return
    const timeout = setTimeout(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/search/users`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: searchInput,
          }),
        }
      )
      const foundUsers = await response.json()
      setSearchResults(foundUsers)
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchInput])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => {
          if (!modal.current) return
          modal.current.showModal()
        }}
        className={styles.primaryButton}
      >
        Add collaborator
      </button>
      <dialog ref={modal}>
        <div className={styles.modalMain}>
          <span>Add a collaborator</span>
          {user ? (
            <div className={styles.selectedUser}>
              <Image
                src={user.image}
                alt='avatar'
                width={24}
                height={24}
                className={styles.selectedUserImg}
              />
              <div className={styles.selectedUserNames}>
                <span className={styles.selectedUserName}>{user.name}</span>
                <span className={styles.selectedUserUsername}>
                  {user.username}
                </span>
              </div>
              <button
                type='button'
                onClick={() => setUser(undefined)}
                className={styles.closeSelectedUserButton}
              >
                <svg viewBox='0 0 16 16' className={styles.closeSvg}>
                  <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className={styles.searchbar}>
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                className={styles.searchbarSvg}
              >
                <path d='M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z'></path>
              </svg>

              <input
                type='text'
                placeholder='Search by username'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.searchbarInput}
              />
            </div>
          )}
          {searchResults.length > 0 && (
            <ul className={styles.searchResults}>
              {searchResults.map((result) => (
                <li
                  key={result._id}
                  onClick={() => {
                    setUser(result)
                    setSearchResults([])
                  }}
                  className={styles.searchResult}
                >
                  <Image
                    src={result.image}
                    alt='avatar'
                    width={24}
                    height={24}
                    className={styles.searchResultImg}
                  />
                  <div className={styles.searchResultNames}>
                    <span className={styles.searchResultName}>
                      {result.name}
                    </span>
                    <span className={styles.searchResultUsername}>
                      {result.username}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            type='button'
            onClick={async () => {
              setSubmitted(true)
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/api/collaborators`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    project_id: project._id,
                    user_id: user!._id,
                    role: 'collaborator',
                    created_by: session.data?.user._id,
                    user_username: params.userUsername,
                    project_name: project.name,
                  }),
                }
              )
              await response.json()
              router.refresh()
              setSubmitted(false)
              modal.current!.close()
            }}
            className={styles.primaryButton}
            disabled={submitted || !user}
          >
            Add collaborator
          </button>
        </div>
        <button
          type='button'
          onClick={() => modal.current!.close()}
          className={styles.closeModalButton}
        >
          <svg viewBox='0 0 16 16' className={styles.closeSvg}>
            <path d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'></path>
          </svg>
        </button>
      </dialog>
    </Fragment>
  )
}

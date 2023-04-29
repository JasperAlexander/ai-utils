'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { createPortal } from 'react-dom'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export function AccountButton() {
  const session = useSession()

  const [tooltipMenuOpen, setTooltipMenuOpen] = useState(false)
  const [documentReady, setDocumentReady] = useState(false)

  useEffect(() => {
    const onReady = () => setDocumentReady(true)

    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      onReady()
    } else {
      document.addEventListener('DOMContentLoaded', onReady)
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', onReady)
    }
  }, [])

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => setTooltipMenuOpen(true)}
        className={styles.headerAvatarButton}
        data-tooltip-id={'account-tooltip'}
      >
        <Image
          src={session.data?.user.image!}
          alt={session.data?.user.username || 'Avatar of user'}
          width={24}
          height={24}
          className={styles.headerAvatarImg}
        />
        <svg viewBox='0 0 16 16'>
          <path d='m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z'></path>
        </svg>
      </button>
      {documentReady &&
        createPortal(
          <Tooltip
            id={'account-tooltip'}
            className={styles.tooltipMenu}
            offset={0}
            isOpen={tooltipMenuOpen}
            setIsOpen={setTooltipMenuOpen}
            openOnClick={true}
            closeOnEsc={true}
            clickable={true}
            place='bottom'
          >
            <ul className={styles.tooltipMenuList}>
              <li className={styles.tooltipMenuListItemHeaderContainer}>
                <div className={styles.tooltipMenuListItemHeader}>
                  <span className={styles.tooltipMenuListItemSpan}>
                    Signed in as
                  </span>

                  <span className={styles.tooltipMenuListItemSpanBold}>
                    {session.data?.user.username}
                  </span>
                </div>
              </li>
              <li className={styles.tooltipMenuListItemContainer}>
                <Link
                  href={`/${session.data?.user.username}`}
                  onClick={() => setTooltipMenuOpen(false)}
                  className={styles.tooltipMenuListItem}
                >
                  <svg
                    viewBox='0 0 16 16'
                    className={styles.tooltipMenuListItemSvg}
                  >
                    <path d='M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z'></path>
                  </svg>
                  <span className={styles.tooltipMenuListItemSpan}>
                    Profile
                  </span>
                </Link>
              </li>
              <li className={styles.tooltipMenuListItemContainer}>
                <Link
                  href={`/${session.data?.user.username}/settings`}
                  onClick={() => setTooltipMenuOpen(false)}
                  className={styles.tooltipMenuListItem}
                >
                  <svg
                    className={styles.tooltipMenuListItemSvg}
                    viewBox='0 0 16 16'
                  >
                    <path d='M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z'></path>
                  </svg>
                  <span className={styles.tooltipMenuListItemSpan}>
                    Settings
                  </span>
                </Link>
              </li>
              <li className={styles.tooltipMenuListItemContainer}>
                <button
                  type='button'
                  onClick={() => {
                    signOut()
                    setTooltipMenuOpen(false)
                  }}
                  className={styles.tooltipMenuListItem}
                >
                  <svg
                    className={styles.tooltipMenuListItemSvg}
                    viewBox='0 0 16 16'
                  >
                    <path d='M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z'></path>
                  </svg>
                  <span className={styles.tooltipMenuListItemSpan}>
                    Sign out
                  </span>
                </button>
              </li>
            </ul>
          </Tooltip>,
          document.body
        )}
    </Fragment>
  )
}

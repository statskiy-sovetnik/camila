import { useState } from 'react'

import { Avatar } from '@/components/Avatar'

import styles from './TipCloud.module.css'

interface TipCloudProps {
  tip: string
}

/**
 * The handoff's "need a tip?" affordance: a wavy-underlined link that swaps
 * itself for Cookie Monster and a thought cloud. Shared by the Waldo puzzle and
 * the emoji riddle.
 */
export function TipCloud({ tip }: TipCloudProps) {
  const [shown, setShown] = useState(false)

  if (!shown) {
    return (
      <div className={styles.area}>
        <button type="button" className={styles.button} onClick={() => setShown(true)}>
          need a tip?
        </button>
      </div>
    )
  }

  return (
    <div className={styles.area}>
      <Avatar size={34} />
      <div className={styles.cloud}>
        <span className={`${styles.puff} ${styles.puffSmall}`} />
        <span className={`${styles.puff} ${styles.puffLarge}`} />
        <p className={styles.bubble}>{tip}</p>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

import styles from './InkNote.module.css'

interface InkNoteProps {
  tone: 'correct' | 'wrong'
  children: ReactNode
}

/** Shared across every puzzle — see "Answer feedback" in design/README.md. */
export function InkNote({ tone, children }: InkNoteProps) {
  return (
    <p className={`${styles.note} ${styles[tone]}`} role="status">
      <span>{children}</span>
      {tone === 'correct' && <span className={styles.underline} aria-hidden="true" />}
    </p>
  )
}

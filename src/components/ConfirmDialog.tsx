import { useEffect, useId } from 'react'

import { Button } from '@/components/Button'

import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * A yes/no card over a full-page scrim, borrowing the handoff's intro-prompt
 * treatment from screen 1b so it doesn't read as a stray browser dialog.
 */
export function ConfirmDialog({ message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const messageId = useId()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return (
    // Clicking the scrim dismisses, which is the safe half of the choice.
    <div className={styles.scrim} onClick={onCancel}>
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={messageId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.copy} id={messageId}>
          {message}
        </p>

        <div className={styles.actions}>
          <Button size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          {/* Focused by default — the destructive button should never be one stray Enter away. */}
          <button type="button" className={styles.cancel} onClick={onCancel} autoFocus>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

import styles from './RestartButton.module.css'

interface RestartButtonProps {
  onRestart: () => void
}

/** Wipes the saved progress and drops Camila back at the greeting. */
export function RestartButton({ onRestart }: RestartButtonProps) {
  return (
    <button type="button" className={styles.restart} onClick={onRestart}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 2v6h6" />
        <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
      </svg>
      Restart game
    </button>
  )
}

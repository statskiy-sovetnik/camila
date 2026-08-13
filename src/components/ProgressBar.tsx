import { PUZZLE_COUNT } from '@/lib/reveal'
import { progressPct } from '@/state/progress'

import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  solvedCount: number
  /** The "N of 7 puzzles solved" line below the bar (screen 1e). */
  showCaption?: boolean
}

export function ProgressBar({ solvedCount, showCaption = false }: ProgressBarProps) {
  const pct = progressPct(solvedCount)

  return (
    <div>
      <div className={styles.row}>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Letter unlocked"
        >
          <div
            className={[styles.fill, solvedCount > 0 && styles.glow].filter(Boolean).join(' ')}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.value}>{pct}%</span>
      </div>
      {showCaption && (
        <p className={styles.caption}>
          {solvedCount} of {PUZZLE_COUNT} puzzles solved
        </p>
      )}
    </div>
  )
}

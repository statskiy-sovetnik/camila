import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { coveringPieces } from '@/lib/reveal'

import styles from './LetterScene.module.css'

interface LetterSceneProps {
  solvedCount: number
  /** Omitted at 100% — there is no next puzzle. */
  onNext?: () => void
}

/**
 * Screen 1e — the letter with the still-locked pieces on top.
 *
 * TODO: the jigsaw knobs (22px circle, right edge on even pieces / bottom on odd),
 * the staggered lift-out animation for newly revealed pieces, and the 100% flourish.
 * TODO: real letter copy — Ivan supplies it; what's below is the designer's placeholder.
 */
export function LetterScene({ solvedCount, onNext }: LetterSceneProps) {
  const covering = coveringPieces(solvedCount)

  return (
    <div className={styles.screen}>
      <ProgressBar solvedCount={solvedCount} showCaption />

      <div className={styles.stage}>
        <article className={styles.paper}>
          <h2 className={styles.salutation}>My dearest Camila,</h2>
          <p className={styles.paragraph}>
            I have been trying to find the right words&hellip; (placeholder copy &mdash; the real
            letter goes here)
          </p>
        </article>

        <div className={styles.overlay} aria-hidden="true">
          {covering.map((piece) => (
            <div
              key={piece.index}
              className={styles.piece}
              style={{ gridColumn: piece.col + 1, gridRow: piece.row + 1 }}
            />
          ))}
        </div>
      </div>

      {onNext && (
        <Button size="sm" onClick={onNext}>
          Next puzzle &rarr;
        </Button>
      )}
    </div>
  )
}

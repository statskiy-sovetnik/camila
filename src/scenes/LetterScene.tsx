import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { LETTER } from '@/data/letter'
import { coveringPieces, newlyRevealedPieces, type Piece } from '@/lib/reveal'

import styles from './LetterScene.module.css'

/** Per-step delay of the diagonal sweep the lifting batch flies out on. */
const STAGGER_MS = 18

interface LetterSceneProps {
  solvedCount: number
  /** Omitted at 100% — there is no next puzzle. */
  onNext?: () => void
}

/**
 * Screen 1e — the letter with the still-locked pieces on top.
 *
 * TODO: the paper is smaller than Ivan's letter needs, so the tail of it is cut
 * off by `.paper`'s overflow. He is sizing it by hand — see the README.
 * TODO: the 100% flourish — the handoff leaves it undesigned and says to ask first.
 */
export function LetterScene({ solvedCount, onNext }: LetterSceneProps) {
  const covering = coveringPieces(solvedCount)
  // The batch the last solve unlocked: still drawn, but on its way out. It ends
  // the animation at opacity 0 (`forwards`), so it can just stay in the DOM —
  // the overlay is inert anyway, and that saves timing the removal.
  const lifting = newlyRevealedPieces(solvedCount)

  const style = (piece: Piece) => ({
    gridColumn: piece.col + 1,
    gridRow: piece.row + 1,
  })

  const knobClass = (piece: Piece) => (piece.knob ? styles[piece.knob] : '')

  return (
    <div className={styles.screen}>
      <ProgressBar solvedCount={solvedCount} showCaption />

      <div className={styles.stage}>
        <article className={styles.paper}>
          <h2 className={styles.salutation}>{LETTER.salutation}</h2>

          {LETTER.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}

          <p className={styles.signoff}>{LETTER.signoff}</p>
        </article>

        <div className={styles.overlay} aria-hidden="true">
          {covering.map((piece) => (
            <div
              key={piece.index}
              className={`${styles.piece} ${knobClass(piece)}`}
              style={style(piece)}
            />
          ))}

          {lifting.map((piece) => (
            <div
              key={piece.index}
              className={`${styles.piece} ${knobClass(piece)} ${styles.lifting}`}
              style={{
                ...style(piece),
                // A diagonal sweep from the top-left corner of the letter.
                animationDelay: `${(piece.row + piece.col) * STAGGER_MS}ms`,
              }}
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

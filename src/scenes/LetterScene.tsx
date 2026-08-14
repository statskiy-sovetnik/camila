import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { PromptCard } from '@/components/PromptCard'
import { LETTER } from '@/data/letter'
import { PUZZLE_COUNT, coveringPieces, newlyRevealedPieces, type Piece } from '@/lib/reveal'

import styles from './LetterScene.module.css'

/** Per-step delay of the diagonal sweep the lifting batch flies out on. */
const STAGGER_MS = 18
/**
 * How long to sit on the finale before the prompt card arrives. The last batch
 * of pieces is still flying at that point (500ms of `lift` plus the diagonal
 * stagger), and the card sliding in over them reads as two animations fighting.
 */
const LIFT_SETTLE_MS = 900
/** The prompt's own exit, before the blur starts easing off. */
const DISMISS_MS = 250

type Finale = 'waiting' | 'prompt' | 'dismissing' | 'done'

interface LetterSceneProps {
  solvedCount: number
  /** Omitted at 100% — there is no next puzzle. */
  onNext?: () => void
  /** She has already clicked through the final prompt on an earlier visit. */
  revealed?: boolean
  onReveal?: () => void
}

/**
 * Screen 1e — the letter with the still-locked pieces on top — and, at 100%,
 * screen 5g: the letter blurred behind a last word from Cookie Monster, until
 * she clicks through and it comes into focus for good.
 *
 */
export function LetterScene({ solvedCount, onNext, revealed, onReveal }: LetterSceneProps) {
  // Captured once: when the parent flips `revealed` on the way out, this scene
  // still has a scrim to fade and a blur to ease off.
  const [isFinale] = useState(() => solvedCount >= PUZZLE_COUNT && !revealed)
  const [finale, setFinale] = useState<Finale>(() => (isFinale ? 'waiting' : 'done'))
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (finale !== 'waiting') return

    timer.current = window.setTimeout(() => setFinale('prompt'), LIFT_SETTLE_MS)
  }, [finale])

  const reveal = () => {
    setFinale('dismissing')
    timer.current = window.setTimeout(() => {
      setFinale('done')
      onReveal?.()
    }, DISMISS_MS)
  }

  // The writing stays out of focus for the whole game: every patch a solved
  // puzzle opens up teases shape and length, but stays unreadable until she
  // clicks through the final prompt. Only that click brings it in.
  const blurred = isFinale ? finale !== 'done' : !revealed

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
        <article
          className={`${styles.paper} ${blurred ? '' : styles.readable}`}
          // Only a scroll container earns a tab stop, and only once it is one.
          tabIndex={blurred ? undefined : 0}
        >
          <div className={`${styles.writing} ${blurred ? styles.blurred : ''}`}>
            <h2 className={styles.salutation}>{LETTER.salutation}</h2>

            {LETTER.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}

            <p className={styles.signoff}>{LETTER.signoff}</p>
          </div>
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

        {isFinale && (
          <div className={`${styles.finale} ${finale === 'done' ? styles.lifted : ''}`}>
            {(finale === 'prompt' || finale === 'dismissing') && (
              <PromptCard
                eyebrow="All challenges complete"
                ring
                className={`${styles.prompt} ${finale === 'dismissing' ? styles.dismissing : ''}`}
              >
                <p className={styles.promptCopy}>
                  Congrrrrats, baby, you have proven yourself competent. Can&rsquo;t wait for you to
                  pet and feed me when you are back to Bangkok. Cookie Monster out! 🐈
                </p>
                <Button size="sm" onClick={reveal}>
                  Reveal the Letter 👁️
                </Button>
              </PromptCard>
            )}
          </div>
        )}
      </div>

      {onNext && (
        <Button size="sm" onClick={onNext}>
          Next puzzle &rarr;
        </Button>
      )}
    </div>
  )
}

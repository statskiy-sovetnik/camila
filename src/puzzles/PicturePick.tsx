import { useState } from 'react'

import { Button } from '@/components/Button'
import { InkNote } from '@/components/InkNote'
import type { PicturePickPuzzle } from '@/data/puzzles'

import styles from './PicturePick.module.css'

interface PicturePickProps {
  puzzle: PicturePickPuzzle
  onSolved: () => void
  onWrongAnswer: () => void
}

/**
 * Screen 5e — four photos in a row, answered by clicking one. Unlike the 1c
 * template there is no Submit button and no "checking…" beat: the verdict lands
 * on the click. A wrong pick never blocks — every photo stays clickable.
 *
 * The puzzle runs several rounds back to back under one question. Only the last
 * round's "Next →" reports the puzzle solved, so the whole run lifts a single
 * batch of pieces. Swapping in four fresh photos is what tells Camila the
 * question moved on.
 */
export function PicturePick({ puzzle, onSolved, onWrongAnswer }: PicturePickProps) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)

  const round = puzzle.rounds[roundIndex]
  const solved = picked === round.correctIndex
  const isLastRound = roundIndex === puzzle.rounds.length - 1

  const choose = (index: number) => {
    if (solved) return

    setPicked(index)

    if (index !== round.correctIndex) onWrongAnswer()
  }

  const advance = () => {
    if (isLastRound) {
      onSolved()
      return
    }

    setRoundIndex(roundIndex + 1)
    setPicked(null)
  }

  return (
    <div className={styles.body}>
      <div className={`${styles.grid} ${solved ? styles.locked : ''}`} role="group">
        {round.images.map((image, index) => {
          const isPicked = picked === index

          return (
            <button
              key={image.src}
              type="button"
              className={`${styles.choice} ${isPicked ? (solved ? styles.correct : styles.wrong) : ''} ${
                solved && !isPicked ? styles.dimmed : ''
              }`}
              disabled={solved}
              onClick={() => choose(index)}
            >
              <img className={styles.photo} src={image.src} alt={image.alt} draggable={false} />
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className={styles.actions}>
          {solved ? (
            <>
              <InkNote tone="correct">{round.correctCopy}</InkNote>
              <Button size="sm" onClick={advance}>
                Next &rarr;
              </Button>
            </>
          ) : (
            <InkNote tone="wrong">{puzzle.wrongCopy}</InkNote>
          )}
        </div>
      )}
    </div>
  )
}

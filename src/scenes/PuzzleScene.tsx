import { useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { ClipPlayer } from '@/components/ClipPlayer'
import type { Puzzle } from '@/data/puzzles'
import { PUZZLE_COUNT } from '@/lib/reveal'
import { EmojiRiddle } from '@/puzzles/EmojiRiddle'
import { MultipleChoice } from '@/puzzles/MultipleChoice'
import { PicturePick } from '@/puzzles/PicturePick'
import { Waldo } from '@/puzzles/Waldo'

import styles from './PuzzleScene.module.css'

interface PuzzleSceneProps {
  puzzle: Puzzle
  /** Position in `PUZZLES` — drives the "PUZZLE N OF 7" eyebrow. */
  index: number
  onSolved: () => void
}

/**
 * The modal shell every puzzle shares, plus the dispatch to each puzzle's body.
 *
 * TODO: the blurred letter behind the modal.
 */
export function PuzzleScene({ puzzle, index, onSolved }: PuzzleSceneProps) {
  const [shaking, setShaking] = useState(false)
  const shake = () => setShaking(true)

  // The emoji riddle draws its own header, titles and paper — it swaps between
  // two cards, so the card can't be the shell. The shell keeps the width and the
  // shake and gets out of the way.
  const isRiddle = puzzle.kind === 'emoji-riddle'

  return (
    <div className={styles.screen}>
      <div
        className={`${styles.modal} ${shaking ? styles.shake : ''} ${isRiddle ? styles.bare : ''}`}
        style={{ width: puzzle.modalWidth }}
        onAnimationEnd={() => setShaking(false)}
      >
        {!isRiddle && (
          <>
            <div className={styles.header}>
              <div className={styles.identity}>
                <Avatar size={44} />
                <span className="eyebrow">
                  Puzzle {index + 1} of {PUZZLE_COUNT}
                </span>
              </div>
              <span className={styles.quip}>{puzzle.quip}</span>
            </div>

            <h2 className={styles.question}>{puzzle.question}</h2>
          </>
        )}

        {puzzle.kind === 'emoji-riddle' && (
          <EmojiRiddle puzzle={puzzle} onSolved={onSolved} onWrongAnswer={shake} />
        )}

        {puzzle.kind === 'waldo' && (
          <Waldo puzzle={puzzle} onSolved={onSolved} onWrongAnswer={shake} />
        )}

        {puzzle.kind === 'multiple-choice' && (
          <MultipleChoice
            options={puzzle.options}
            correctIndex={puzzle.correctIndex}
            image={puzzle.image}
            onSolved={onSolved}
            onWrongAnswer={shake}
          />
        )}

        {puzzle.kind === 'video' && (
          <MultipleChoice
            options={puzzle.options}
            correctIndex={puzzle.correctIndex}
            onSolved={onSolved}
            onWrongAnswer={shake}
          >
            <ClipPlayer src={puzzle.clipSrc} title="Clip position" />
          </MultipleChoice>
        )}

        {puzzle.kind === 'picture-pick' && (
          <PicturePick puzzle={puzzle} onSolved={onSolved} onWrongAnswer={shake} />
        )}
      </div>
    </div>
  )
}

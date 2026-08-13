import { useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { YouTubeClip } from '@/components/YouTubeClip'
import type { Puzzle } from '@/data/puzzles'
import { PUZZLE_COUNT } from '@/lib/reveal'
import { MultipleChoice } from '@/puzzles/MultipleChoice'
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
 * TODO: the picture-pick body for 5e, and the blurred letter behind the modal.
 */
export function PuzzleScene({ puzzle, index, onSolved }: PuzzleSceneProps) {
  const [shaking, setShaking] = useState(false)
  const shake = () => setShaking(true)

  return (
    <div className={styles.screen}>
      <div
        className={`${styles.modal} ${shaking ? styles.shake : ''}`}
        style={{ width: puzzle.modalWidth }}
        onAnimationEnd={() => setShaking(false)}
      >
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
            <YouTubeClip clip={puzzle.clip} title="Clip position" />
          </MultipleChoice>
        )}

        {puzzle.kind === 'picture-pick' && (
          <>
            <p className={styles.todo}>
              Not built yet &mdash; this is the <code>{puzzle.kind}</code> body.
            </p>

            <div className={styles.actions}>
              <Button size="sm" onClick={onSolved}>
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

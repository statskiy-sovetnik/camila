import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { YouTubeClip } from '@/components/YouTubeClip'
import type { Puzzle } from '@/data/puzzles'
import { PUZZLE_COUNT } from '@/lib/reveal'

import styles from './PuzzleScene.module.css'

interface PuzzleSceneProps {
  puzzle: Puzzle
  /** Position in `PUZZLES` — drives the "PUZZLE N OF 7" eyebrow. */
  index: number
  onSolved: () => void
}

/**
 * Modal shell — the header, question and framing are in place, and the video
 * puzzle plays its clip.
 *
 * TODO: the remaining per-kind bodies (option rows, Waldo hit region + tip
 * cloud, picture grid), the ink-note feedback, the ~600ms "checking…" delay,
 * the wrong-answer shake, and the blurred letter behind the modal.
 */
export function PuzzleScene({ puzzle, index, onSolved }: PuzzleSceneProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.modal} style={{ width: puzzle.modalWidth }}>
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

        {puzzle.kind === 'video' && <YouTubeClip clip={puzzle.clip} title="Clip position" />}

        <p className={styles.todo}>
          Not built yet &mdash; this is the <code>{puzzle.kind}</code> body.
        </p>

        <div className={styles.actions}>
          <Button size="sm" onClick={onSolved}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

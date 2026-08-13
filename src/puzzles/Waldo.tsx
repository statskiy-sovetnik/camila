import { useState, type MouseEvent } from 'react'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { InkNote } from '@/components/InkNote'
import type { WaldoPuzzle } from '@/data/puzzles'
import { isInsideHitRegion, relativeToElement } from '@/lib/hitRegion'

import styles from './Waldo.module.css'

/** How much room the success ring leaves around the hit region. */
const RING_PADDING = 0.25

interface WaldoProps {
  puzzle: WaldoPuzzle
  onSolved: () => void
  onWrongAnswer: () => void
}

export function Waldo({ puzzle, onSolved, onWrongAnswer }: WaldoProps) {
  const [found, setFound] = useState(false)
  const [missed, setMissed] = useState(false)
  const [tipShown, setTipShown] = useState(false)

  const { hitRegion } = puzzle

  const handleSceneClick = (event: MouseEvent<HTMLImageElement>) => {
    if (found) return

    const { x, y } = relativeToElement(event.currentTarget, event.clientX, event.clientY)

    if (isInsideHitRegion(hitRegion, x, y)) {
      setFound(true)
      setMissed(false)
      return
    }

    setMissed(true)
    onWrongAnswer()
  }

  // The ring sits on the hit region with a little room to breathe, in the same
  // relative coordinates, so it lands on the legionary at any rendered size.
  const padX = hitRegion.width * RING_PADDING
  const padY = hitRegion.height * RING_PADDING

  return (
    <div className={styles.body}>
      <div className={styles.stage}>
        <div className={styles.frame}>
          <img
            className={`${styles.scene} ${found ? styles.sceneFound : ''}`}
            src={puzzle.scene}
            alt="A busy street scene in Rome"
            draggable={false}
            onClick={handleSceneClick}
          />

          {found && (
            <span
              className={styles.ring}
              aria-hidden="true"
              style={{
                left: `${(hitRegion.x - padX) * 100}%`,
                top: `${(hitRegion.y - padY) * 100}%`,
                width: `${(hitRegion.width + padX * 2) * 100}%`,
                height: `${(hitRegion.height + padY * 2) * 100}%`,
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.target}>
          <img className={styles.cutout} src={puzzle.target.src} alt="" />
          <div>
            <p className="eyebrow">Your target</p>
            <p className={styles.targetLabel}>{puzzle.target.label}</p>
          </div>
        </div>

        <div className={styles.tipArea}>
          {tipShown ? (
            <>
              <Avatar size={34} />
              <div className={styles.cloud}>
                <span className={`${styles.puff} ${styles.puffSmall}`} />
                <span className={`${styles.puff} ${styles.puffLarge}`} />
                <p className={styles.bubble}>{puzzle.tip}</p>
              </div>
            </>
          ) : (
            <button type="button" className={styles.tipButton} onClick={() => setTipShown(true)}>
              need a tip?
            </button>
          )}
        </div>
      </div>

      {(found || missed) && (
        <div className={styles.feedback}>
          {found ? (
            <>
              <InkNote tone="correct">Correct! ✓</InkNote>
              <Button size="sm" onClick={onSolved}>
                Next &rarr;
              </Button>
            </>
          ) : (
            <InkNote tone="wrong">not him&hellip;</InkNote>
          )}
        </div>
      )}
    </div>
  )
}

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/Button'
import { InkNote } from '@/components/InkNote'

import styles from './MultipleChoice.module.css'

/** The handoff asks for a short fake "checking…" beat before the verdict. */
const CHECKING_MS = 600

type Status = 'idle' | 'checking' | 'correct' | 'wrong'

interface MultipleChoiceProps {
  options: string[]
  /** Index into `options`. */
  correctIndex: number
  image?: { src: string; height: number; objectPosition?: string }
  /** Media slot above the options — the video puzzle puts its player here. */
  children?: ReactNode
  onSolved: () => void
  onWrongAnswer: () => void
}

/**
 * Screen 1c — the question template shared by every puzzle that is answered by
 * picking one of four rows.
 */
export function MultipleChoice({
  options,
  correctIndex,
  image,
  children,
  onSolved,
  onWrongAnswer,
}: MultipleChoiceProps) {
  const groupName = useId()

  const [selected, setSelected] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const solved = status === 'correct'

  const choose = (index: number) => {
    if (solved) return

    setSelected(index)
    // Re-picking clears the previous verdict; a wrong answer never blocks.
    setStatus('idle')
  }

  const submit = () => {
    if (selected === null) return

    setStatus('checking')
    timer.current = window.setTimeout(() => {
      if (selected === correctIndex) {
        setStatus('correct')
        return
      }

      setStatus('wrong')
      onWrongAnswer()
    }, CHECKING_MS)
  }

  return (
    <div className={styles.body}>
      {children}

      {image && (
        <img
          className={styles.image}
          src={image.src}
          alt=""
          style={{ height: image.height, objectPosition: image.objectPosition }}
        />
      )}

      <div
        className={`${styles.options} ${solved ? styles.locked : ''}`}
        role="radiogroup"
        aria-label="Answer options"
      >
        {options.map((option, index) => (
          <label
            key={option}
            className={`${styles.option} ${selected === index ? styles.selected : ''}`}
          >
            <input
              className={styles.input}
              type="radio"
              name={groupName}
              value={option}
              checked={selected === index}
              disabled={solved}
              onChange={() => choose(index)}
            />
            <span className={styles.dot} aria-hidden="true" />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className={styles.actions}>
        {solved ? (
          <>
            <InkNote tone="correct">Correct! ✓</InkNote>
            <Button size="sm" onClick={onSolved}>
              Next &rarr;
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              onClick={submit}
              disabled={selected === null || status === 'checking'}
            >
              {status === 'checking' ? 'checking…' : 'Submit'}
            </Button>
            {status === 'wrong' && (
              <InkNote tone="wrong">Hmm, not quite&hellip; try again, love</InkNote>
            )}
          </>
        )}
      </div>
    </div>
  )
}

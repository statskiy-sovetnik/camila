import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { InkNote } from '@/components/InkNote'
import { PromptCard } from '@/components/PromptCard'
import { TipCloud } from '@/components/TipCloud'
import type { EmojiRiddlePuzzle } from '@/data/puzzles'

import styles from './EmojiRiddle.module.css'

/** How long the intro card takes to fade out — matches the CSS animation. */
const EXIT_MS = 260
/** The beat the praise line gets before the next riddle fades in. */
const PRAISE_MS = 800

type Phase = 'intro' | 'leaving' | 'asking'
type Status = 'idle' | 'wrong' | 'correct'

interface EmojiRiddleProps {
  puzzle: EmojiRiddlePuzzle
  onSolved: () => void
  onWrongAnswer: () => void
}

/** Right if the guess *contains* any accepted fragment, ignoring case. */
function matches(guess: string, accepts: string[]): boolean {
  const typed = guess.trim().toLowerCase()
  if (typed.length === 0) return false

  return accepts.some((fragment) => {
    const needle = fragment.trim().toLowerCase()
    return needle.length > 0 && typed.includes(needle)
  })
}

/**
 * Screen 5f — the final challenge. An intro card leads into a run of typed-answer
 * riddles. Like the picture-pick's rounds they count as one puzzle: only the last
 * one reports it solved.
 */
export function EmojiRiddle({ puzzle, onSolved, onWrongAnswer }: EmojiRiddleProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [guess, setGuess] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const timer = useRef<number | undefined>(undefined)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Each riddle starts with the cursor already in the box.
  useEffect(() => {
    if (phase === 'asking') input.current?.focus()
  }, [phase, questionIndex])

  const question = puzzle.questions[questionIndex]
  const isLastQuestion = questionIndex === puzzle.questions.length - 1

  const start = () => {
    setPhase('leaving')
    timer.current = window.setTimeout(() => setPhase('asking'), EXIT_MS)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (status === 'correct') return

    if (!matches(guess, question.accepts)) {
      setStatus('wrong')
      onWrongAnswer()
      return
    }

    setStatus('correct')
    timer.current = window.setTimeout(() => {
      if (isLastQuestion) {
        onSolved()
        return
      }

      setQuestionIndex(questionIndex + 1)
      setGuess('')
      setStatus('idle')
    }, PRAISE_MS)
  }

  if (phase !== 'asking') {
    return (
      <PromptCard
        eyebrow="Final challenge"
        avatarSize={64}
        ring
        className={phase === 'leaving' ? styles.leaving : ''}
      >
        <p className={styles.introCopy}>{puzzle.intro}</p>

        <Button size="sm" onClick={start} disabled={phase === 'leaving'}>
          {puzzle.startLabel}
        </Button>
      </PromptCard>
    )
  }

  return (
    // Keyed on the index so each riddle fades in rather than swapping in place.
    <div className={`${styles.card} ${styles.question}`} key={questionIndex}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <Avatar size={44} />
          <span className="eyebrow">
            Question {questionIndex + 1} of {puzzle.questions.length}
          </span>
        </div>
        <span className={styles.quip}>{puzzle.quip}</span>
      </div>

      <h2 className={styles.title}>{question.title}</h2>

      <p className={styles.emojis}>{question.emojis}</p>

      <form className={styles.form} onSubmit={submit}>
        <input
          ref={input}
          className={styles.input}
          type="text"
          value={guess}
          placeholder="Type here"
          aria-label="Your answer"
          autoComplete="off"
          disabled={status === 'correct'}
          onChange={(event) => {
            setGuess(event.target.value)
            // Typing again clears the previous verdict; a wrong answer never blocks.
            if (status === 'wrong') setStatus('idle')
          }}
        />

        <Button size="sm" type="submit" disabled={status === 'correct'}>
          Submit
        </Button>
      </form>

      {status === 'correct' && <InkNote tone="correct">Correct! ✓</InkNote>}
      {status === 'wrong' && <InkNote tone="wrong">Hmm, not quite&hellip; try again, love</InkNote>}

      {question.tip && (
        <div className={styles.tip}>
          <TipCloud tip={question.tip} />
        </div>
      )}
    </div>
  )
}

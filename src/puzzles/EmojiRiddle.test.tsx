import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PUZZLES, type EmojiRiddlePuzzle } from '@/data/puzzles'

import { EmojiRiddle } from './EmojiRiddle'

// The final challenge — real data, so the test also guards its answer lists.
const puzzle = PUZZLES.find((entry): entry is EmojiRiddlePuzzle => entry.kind === 'emoji-riddle')!

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function renderPuzzle() {
  const onSolved = vi.fn()
  const onWrongAnswer = vi.fn()

  render(<EmojiRiddle puzzle={puzzle} onSolved={onSolved} onWrongAnswer={onWrongAnswer} />)

  return { onSolved, onWrongAnswer }
}

/** Waits out the intro's exit, or the beat between riddles. */
function runTimers() {
  act(() => {
    vi.runAllTimers()
  })
}

/** Clicks through the intro card, landing on the first riddle. */
function startRiddles() {
  fireEvent.click(screen.getByRole('button', { name: puzzle.startLabel }))
  runTimers()
}

const answerBox = () => screen.getByRole('textbox', { name: /answer/i })

function answer(text: string) {
  fireEvent.change(answerBox(), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

describe('EmojiRiddle', () => {
  it('opens on the intro card, not on a question', () => {
    renderPuzzle()

    expect(screen.getByText(puzzle.intro)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: puzzle.startLabel })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('leaves the intro behind and shows the first riddle', () => {
    renderPuzzle()
    startRiddles()

    expect(screen.queryByText(puzzle.intro)).not.toBeInTheDocument()
    expect(screen.getByText(puzzle.questions[0].title)).toBeInTheDocument()
    expect(screen.getByText(puzzle.questions[0].emojis)).toBeInTheDocument()
    expect(screen.getByText(`Question 1 of ${puzzle.questions.length}`)).toBeInTheDocument()
  })

  it('ignores case and surrounding spaces', () => {
    const { onWrongAnswer } = renderPuzzle()
    startRiddles()

    answer(`   ${puzzle.questions[0].accepts[0].toUpperCase()}   `)

    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(onWrongAnswer).not.toHaveBeenCalled()
  })

  it('accepts the word anywhere in a longer answer', () => {
    const { onWrongAnswer } = renderPuzzle()
    startRiddles()

    answer(`hmm is it ${puzzle.questions[0].accepts[0]} targaryen?`)

    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(onWrongAnswer).not.toHaveBeenCalled()
  })

  it('offers a tip only on the riddles that have one', () => {
    renderPuzzle()
    startRiddles()

    const tipLink = () => screen.queryByRole('button', { name: 'need a tip?' })
    const withTip = puzzle.questions.findIndex((question) => question.tip)
    expect(withTip, 'no riddle carries a tip').toBeGreaterThan(-1)

    puzzle.questions.forEach((question, index) => {
      expect(Boolean(tipLink()), `riddle ${index + 1}`).toBe(Boolean(question.tip))

      if (question.tip) {
        expect(screen.queryByText(question.tip)).not.toBeInTheDocument()
        fireEvent.click(tipLink()!)
        expect(screen.getByText(question.tip)).toBeInTheDocument()
      }

      answer(question.accepts[0])
      runTimers()
    })
  })

  it('never blocks on a wrong answer', () => {
    const { onSolved, onWrongAnswer } = renderPuzzle()
    startRiddles()

    answer('a dragon probably')

    expect(screen.getByText(/not quite/)).toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
    expect(onSolved).not.toHaveBeenCalled()
    expect(answerBox()).toBeEnabled()

    // Typing again clears the verdict, and the right answer still lands.
    fireEvent.change(answerBox(), { target: { value: 'Aemo' } })
    expect(screen.queryByText(/not quite/)).not.toBeInTheDocument()

    answer(puzzle.questions[0].accepts[0])
    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
  })

  it('treats an empty answer as wrong rather than accepting it', () => {
    const { onSolved, onWrongAnswer } = renderPuzzle()
    startRiddles()

    answer('   ')

    expect(onWrongAnswer).toHaveBeenCalledOnce()
    expect(onSolved).not.toHaveBeenCalled()
  })

  it('walks every riddle and only then reports the puzzle solved', () => {
    const { onSolved } = renderPuzzle()
    startRiddles()

    puzzle.questions.forEach((question, index) => {
      expect(screen.getByText(question.title)).toBeInTheDocument()
      expect(
        screen.getByText(`Question ${index + 1} of ${puzzle.questions.length}`),
      ).toBeInTheDocument()
      // Every riddle before the last leaves the puzzle unsolved.
      expect(onSolved).not.toHaveBeenCalled()

      answer(question.accepts[0])
      runTimers()
    })

    expect(onSolved).toHaveBeenCalledOnce()
  })
})

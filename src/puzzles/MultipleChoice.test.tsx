import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PUZZLES, type MultipleChoicePuzzle } from '@/data/puzzles'

import { MultipleChoice } from './MultipleChoice'

// The Nefertiti question — real data, so the test also guards `correctIndex`.
const puzzle = PUZZLES.find(
  (entry): entry is MultipleChoicePuzzle =>
    entry.kind === 'multiple-choice' &&
    entry.options.includes('Nefertiti; the Neues Museum, Berlin'),
)!

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function renderQuestion() {
  const onSolved = vi.fn()
  const onWrongAnswer = vi.fn()

  render(
    <MultipleChoice
      options={puzzle.options}
      correctIndex={puzzle.correctIndex}
      image={puzzle.image}
      onSolved={onSolved}
      onWrongAnswer={onWrongAnswer}
    />,
  )

  return { onSolved, onWrongAnswer }
}

/** Waits out the fake "checking…" beat. */
function finishChecking() {
  act(() => {
    vi.runAllTimers()
  })
}

const submitButton = () => screen.getByRole('button', { name: /Submit|checking/ })

describe('MultipleChoice', () => {
  it('keeps Submit disabled until something is picked', () => {
    renderQuestion()

    expect(submitButton()).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: puzzle.options[0] }))
    expect(submitButton()).toBeEnabled()
  })

  it('accepts the right answer after the checking beat', () => {
    const { onSolved, onWrongAnswer } = renderQuestion()

    fireEvent.click(screen.getByRole('radio', { name: puzzle.options[puzzle.correctIndex] }))
    fireEvent.click(submitButton())

    // Verdict is withheld until the delay elapses.
    expect(screen.queryByText(/Correct!/)).not.toBeInTheDocument()

    finishChecking()

    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(onWrongAnswer).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
    expect(onSolved).toHaveBeenCalledOnce()
  })

  it('lets her re-pick after a wrong answer', () => {
    const { onSolved, onWrongAnswer } = renderQuestion()

    const wrongIndex = puzzle.correctIndex === 0 ? 1 : 0
    fireEvent.click(screen.getByRole('radio', { name: puzzle.options[wrongIndex] }))
    fireEvent.click(submitButton())
    finishChecking()

    expect(screen.getByText(/not quite/)).toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
    expect(onSolved).not.toHaveBeenCalled()

    // Picking again clears the note and the rows stay live.
    fireEvent.click(screen.getByRole('radio', { name: puzzle.options[puzzle.correctIndex] }))
    expect(screen.queryByText(/not quite/)).not.toBeInTheDocument()

    fireEvent.click(submitButton())
    finishChecking()

    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
  })

  it('locks the rows once the answer is right', () => {
    renderQuestion()

    fireEvent.click(screen.getByRole('radio', { name: puzzle.options[puzzle.correctIndex] }))
    fireEvent.click(submitButton())
    finishChecking()

    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
  })

  it('shows the question image when the puzzle has one', () => {
    renderQuestion()

    const image = document.querySelector('img')
    expect(image).toHaveAttribute('src', puzzle.image!.src)
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PUZZLES, type PicturePickPuzzle } from '@/data/puzzles'

import { PicturePick } from './PicturePick'

// The Iris van Herpen question — real data, so the test also guards `correctIndex`.
const puzzle = PUZZLES.find((entry): entry is PicturePickPuzzle => entry.kind === 'picture-pick')!

const lastRound = puzzle.rounds.length - 1

function renderPuzzle() {
  const onSolved = vi.fn()
  const onWrongAnswer = vi.fn()

  render(<PicturePick puzzle={puzzle} onSolved={onSolved} onWrongAnswer={onWrongAnswer} />)

  return { onSolved, onWrongAnswer }
}

/** The photos on screen, in order — they change with every round. */
const photos = () => screen.getAllByRole('button').filter((node) => node.querySelector('img'))

const sources = () => photos().map((node) => node.querySelector('img')!.getAttribute('src'))

/** Clears the round on screen by picking its Iris van Herpen. */
function solveRound(index: number) {
  fireEvent.click(photos()[puzzle.rounds[index].correctIndex])
}

describe('PicturePick', () => {
  it('opens on the first round, with no verdict yet', () => {
    renderPuzzle()

    expect(sources()).toEqual(puzzle.rounds[0].images.map((image) => image.src))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('accepts the right photo on the click, with no Submit button', () => {
    const { onWrongAnswer } = renderPuzzle()

    solveRound(0)

    expect(screen.getByText(puzzle.rounds[0].correctCopy)).toBeInTheDocument()
    expect(onWrongAnswer).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /Submit/ })).not.toBeInTheDocument()
  })

  it('lets her keep picking after a wrong photo', () => {
    const { onSolved, onWrongAnswer } = renderPuzzle()

    const wrongIndex = puzzle.rounds[0].correctIndex === 0 ? 1 : 0
    fireEvent.click(photos()[wrongIndex])

    expect(screen.getByText(puzzle.wrongCopy)).toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
    expect(onSolved).not.toHaveBeenCalled()

    // Every photo stays live — a wrong pick never blocks.
    photos().forEach((photo) => expect(photo).toBeEnabled())

    solveRound(0)

    expect(screen.getByText(puzzle.rounds[0].correctCopy)).toBeInTheDocument()
    expect(screen.queryByText(puzzle.wrongCopy)).not.toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
  })

  it('locks the photos once the right one is picked', () => {
    renderPuzzle()

    solveRound(0)

    photos().forEach((photo) => expect(photo).toBeDisabled())
  })

  it('swaps in the next round of photos without reporting the puzzle solved', () => {
    const { onSolved } = renderPuzzle()

    solveRound(0)
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))

    // A fresh set, live again, and the letter has not moved on.
    expect(sources()).toEqual(puzzle.rounds[1].images.map((image) => image.src))
    photos().forEach((photo) => expect(photo).toBeEnabled())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(onSolved).not.toHaveBeenCalled()
  })

  it('reports the puzzle solved only after the last round', () => {
    const { onSolved } = renderPuzzle()

    puzzle.rounds.forEach((round, index) => {
      solveRound(index)

      expect(screen.getByText(round.correctCopy)).toBeInTheDocument()
      // Every round before the last leaves the puzzle unsolved.
      expect(onSolved).not.toHaveBeenCalled()

      fireEvent.click(screen.getByRole('button', { name: /Next/ }))
    })

    expect(onSolved).toHaveBeenCalledOnce()
  })

  it('carries a wrong answer across rounds without blocking', () => {
    const { onSolved, onWrongAnswer } = renderPuzzle()

    solveRound(0)
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))

    const wrongIndex = puzzle.rounds[1].correctIndex === 0 ? 1 : 0
    fireEvent.click(photos()[wrongIndex])

    expect(screen.getByText(puzzle.wrongCopy)).toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
    expect(onSolved).not.toHaveBeenCalled()

    // Still on round 2's photos, still clickable.
    expect(sources()).toEqual(puzzle.rounds[1].images.map((image) => image.src))
    photos().forEach((photo) => expect(photo).toBeEnabled())
  })

  it('shows the last round its own praise line', () => {
    renderPuzzle()

    for (let index = 0; index < lastRound; index++) {
      solveRound(index)
      fireEvent.click(screen.getByRole('button', { name: /Next/ }))
    }

    solveRound(lastRound)

    expect(screen.getByText(puzzle.rounds[lastRound].correctCopy)).toBeInTheDocument()
  })
})

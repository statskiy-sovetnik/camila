import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  PIECES,
  PIECE_COUNT,
  PUZZLE_COUNT,
  coveringPieces,
  newlyRevealedPieces,
} from '@/lib/reveal'

import { LetterScene } from './LetterScene'
import styles from './LetterScene.module.css'

/** Every piece in the overlay, lifting ones included. */
function renderedPieces(solvedCount: number) {
  const { container } = render(<LetterScene solvedCount={solvedCount} />)
  return container.querySelectorAll('[aria-hidden="true"] > div')
}

const revealButton = () => screen.queryByRole('button', { name: /Reveal the Letter/ })

describe('LetterScene', () => {
  it('covers the whole letter before anything is solved', () => {
    expect(renderedPieces(0)).toHaveLength(PIECE_COUNT)
  })

  it('draws the still-locked pieces plus the batch on its way out', () => {
    const solvedCount = 3

    expect(renderedPieces(solvedCount)).toHaveLength(
      coveringPieces(solvedCount).length + newlyRevealedPieces(solvedCount).length,
    )
  })

  it('leaves only the last batch lifting at 100%', () => {
    expect(coveringPieces(PUZZLE_COUNT)).toHaveLength(0)
    expect(renderedPieces(PUZZLE_COUNT)).toHaveLength(newlyRevealedPieces(PUZZLE_COUNT).length)
  })

  describe('the final prompt', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    /** Lets the last pieces finish flying, which is what the prompt waits on. */
    const settle = () =>
      act(() => {
        vi.runAllTimers()
      })

    it('holds the prompt back until the last pieces have flown', () => {
      render(<LetterScene solvedCount={PUZZLE_COUNT} revealed={false} onReveal={vi.fn()} />)

      expect(revealButton()).not.toBeInTheDocument()

      settle()
      expect(revealButton()).toBeInTheDocument()
    })

    it('reports the reveal only after the prompt has popped away', () => {
      const onReveal = vi.fn()
      render(<LetterScene solvedCount={PUZZLE_COUNT} revealed={false} onReveal={onReveal} />)
      settle()

      fireEvent.click(revealButton()!)
      // The card is still on its way out; the letter has not been claimed yet.
      expect(onReveal).not.toHaveBeenCalled()

      settle()
      expect(onReveal).toHaveBeenCalledOnce()
      expect(revealButton()).not.toBeInTheDocument()
    })

    it('skips straight to the clean letter once she has revealed it', () => {
      render(<LetterScene solvedCount={PUZZLE_COUNT} revealed onReveal={vi.fn()} />)

      settle()
      expect(revealButton()).not.toBeInTheDocument()
    })

    it('stays out of the way before every puzzle is solved', () => {
      render(<LetterScene solvedCount={PUZZLE_COUNT - 1} revealed={false} onReveal={vi.fn()} />)

      settle()
      expect(revealButton()).not.toBeInTheDocument()
    })
  })

  it('draws each piece on the edge its knob belongs to', () => {
    // The overlay is in grid order, so the nth node is PIECES[n].
    renderedPieces(0).forEach((node, index) => {
      const { knob } = PIECES[index]

      expect(node.classList.contains(styles.right)).toBe(knob === 'right')
      expect(node.classList.contains(styles.bottom)).toBe(knob === 'bottom')
    })
  })
})

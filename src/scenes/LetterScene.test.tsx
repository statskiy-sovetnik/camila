import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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

  it('draws each piece on the edge its knob belongs to', () => {
    // The overlay is in grid order, so the nth node is PIECES[n].
    renderedPieces(0).forEach((node, index) => {
      const { knob } = PIECES[index]

      expect(node.classList.contains(styles.right)).toBe(knob === 'right')
      expect(node.classList.contains(styles.bottom)).toBe(knob === 'bottom')
    })
  })
})

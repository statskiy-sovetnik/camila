import { describe, expect, it } from 'vitest'

import {
  GRID_COLS,
  GRID_ROWS,
  PIECES,
  PIECE_COUNT,
  PUZZLE_COUNT,
  isRevealed,
  newlyRevealedPieces,
  revealedCount,
} from './reveal'

describe('reveal schedule', () => {
  it('covers the whole grid exactly once', () => {
    expect(PIECES).toHaveLength(PIECE_COUNT)
    expect(new Set(PIECES.map((piece) => piece.index)).size).toBe(PIECE_COUNT)
    PIECES.forEach((piece, index) => {
      expect(piece.index).toBe(index)
      expect(piece.row * GRID_COLS + piece.col).toBe(index)
    })
  })

  it('assigns every piece to one of the 7 puzzles', () => {
    PIECES.forEach((piece) => {
      expect(piece.batch).toBeGreaterThanOrEqual(0)
      expect(piece.batch).toBeLessThan(PUZZLE_COUNT)
    })
  })

  it('splits the pieces into evenly sized batches', () => {
    const sizes = Array.from(
      { length: PUZZLE_COUNT },
      (_, batch) => PIECES.filter((piece) => piece.batch === batch).length,
    )

    expect(sizes.reduce((total, size) => total + size, 0)).toBe(PIECE_COUNT)
    // 80 pieces over 7 puzzles: no batch may be more than one piece off the ideal.
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1)
  })

  it('reveals nothing at 0 and everything at 7', () => {
    expect(revealedCount(0)).toBe(0)
    expect(revealedCount(PUZZLE_COUNT)).toBe(PIECE_COUNT)
  })

  it('reveals strictly more pieces with each solve', () => {
    for (let solved = 1; solved <= PUZZLE_COUNT; solved++) {
      expect(revealedCount(solved)).toBeGreaterThan(revealedCount(solved - 1))
    }
  })

  it('never uncovers a full grid row before 100%', () => {
    // The handoff's hard requirement: no complete line of the letter may be
    // readable until every puzzle is solved.
    for (let solved = 0; solved < PUZZLE_COUNT; solved++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        const rowPieces = PIECES.filter((piece) => piece.row === row)
        const uncovered = rowPieces.filter((piece) => isRevealed(piece, solved)).length
        expect(uncovered).toBeLessThan(GRID_COLS)
      }
    }
  })

  it('scatters each batch across every grid row', () => {
    for (let row = 0; row < GRID_ROWS; row++) {
      const batches = new Set(PIECES.filter((piece) => piece.row === row).map((p) => p.batch))
      expect(batches.size).toBe(PUZZLE_COUNT)
    }
  })

  it('only knobs the edges that have a neighbour', () => {
    PIECES.forEach((piece) => {
      if (piece.knob === 'right') expect(piece.col).toBeLessThan(GRID_COLS - 1)
      if (piece.knob === 'bottom') expect(piece.row).toBeLessThan(GRID_ROWS - 1)
    })

    // Nothing may stick out past the paper, in any direction.
    expect(PIECES.filter((piece) => piece.col === GRID_COLS - 1 && piece.knob === 'right')).toEqual(
      [],
    )
    expect(
      PIECES.filter((piece) => piece.row === GRID_ROWS - 1 && piece.knob === 'bottom'),
    ).toEqual([])
  })

  it('reports the pieces lifted by the latest solve', () => {
    for (let solved = 1; solved <= PUZZLE_COUNT; solved++) {
      const lifted = newlyRevealedPieces(solved)
      expect(lifted.length).toBeGreaterThan(0)
      expect(revealedCount(solved) - revealedCount(solved - 1)).toBe(lifted.length)
    }

    expect(newlyRevealedPieces(0)).toHaveLength(0)
  })
})

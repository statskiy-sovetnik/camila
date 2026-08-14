import { describe, expect, it } from 'vitest'

import { PUZZLE_COUNT } from '@/lib/reveal'

import { PUZZLES } from './puzzles'

describe('puzzles', () => {
  it('has exactly as many puzzles as the reveal schedule expects', () => {
    // The jigsaw is split into PUZZLE_COUNT batches; a mismatch would either
    // strand pieces on the letter or run out of puzzles before 100%.
    expect(PUZZLES).toHaveLength(PUZZLE_COUNT)
  })

  it('points every answerable puzzle at a real option', () => {
    PUZZLES.forEach((puzzle, index) => {
      const label = `puzzle ${index + 1}`

      switch (puzzle.kind) {
        case 'multiple-choice':
        case 'video':
          expect(puzzle.correctIndex, label).toBeGreaterThanOrEqual(0)
          expect(puzzle.correctIndex, label).toBeLessThan(puzzle.options.length)
          break
        case 'picture-pick':
          puzzle.rounds.forEach((round, roundIndex) => {
            const roundLabel = `${label}, round ${roundIndex + 1}`

            expect(round.correctIndex, roundLabel).toBeGreaterThanOrEqual(0)
            expect(round.correctIndex, roundLabel).toBeLessThan(round.images.length)
          })
          break
        case 'waldo':
          break
      }
    })
  })

  it('keeps the Waldo hit region inside the scene', () => {
    const waldo = PUZZLES.find((puzzle) => puzzle.kind === 'waldo')
    expect(waldo).toBeDefined()

    const { x, y, width, height } = waldo!.hitRegion
    expect(width).toBeGreaterThan(0)
    expect(height).toBeGreaterThan(0)
    expect(x).toBeGreaterThanOrEqual(0)
    expect(y).toBeGreaterThanOrEqual(0)
    expect(x + width).toBeLessThanOrEqual(1)
    expect(y + height).toBeLessThanOrEqual(1)
  })

  it('never repeats a photo across the picture-pick rounds', () => {
    // The rounds run back to back under one question, so the same dress showing
    // up twice would read as a bug rather than a new question.
    PUZZLES.filter((puzzle) => puzzle.kind === 'picture-pick').forEach((puzzle) => {
      const sources = puzzle.rounds.flatMap((round) => round.images.map((image) => image.src))

      expect(new Set(sources).size).toBe(sources.length)
    })
  })

  it('points the video puzzle at a local clip', () => {
    const video = PUZZLES.find((puzzle) => puzzle.kind === 'video')
    expect(video).toBeDefined()

    // Served from public/, so the path has to be root-relative.
    expect(video!.clipSrc).toMatch(/^\/media\/.+\.\w+$/)
  })
})

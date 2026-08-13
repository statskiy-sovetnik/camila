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
          expect(puzzle.correctIndex, label).toBeGreaterThanOrEqual(0)
          expect(puzzle.correctIndex, label).toBeLessThan(puzzle.images.length)
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

  it('plays a 15 second slice for the video puzzle', () => {
    const video = PUZZLES.find((puzzle) => puzzle.kind === 'video')
    expect(video).toBeDefined()

    const { startSeconds, endSeconds, videoId } = video!.clip
    expect(videoId).toBeTruthy()
    expect(endSeconds - startSeconds).toBe(15)
  })
})

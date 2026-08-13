import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { PUZZLES, type WaldoPuzzle } from '@/data/puzzles'

import { Waldo } from './Waldo'

const puzzle = PUZZLES.find((entry): entry is WaldoPuzzle => entry.kind === 'waldo')!

// jsdom lays nothing out, so the scene image reports a zero-sized box and the
// click-to-relative maths would divide by zero. Give it a fixed one.
const BOX = { left: 0, top: 0, width: 1000, height: 625 }

beforeAll(() => {
  vi.spyOn(HTMLImageElement.prototype, 'getBoundingClientRect').mockReturnValue({
    ...BOX,
    right: BOX.width,
    bottom: BOX.height,
    x: BOX.left,
    y: BOX.top,
    toJSON: () => '',
  })
})

/** A point inside the puzzle's hit region, in the stubbed box's pixels. */
function pointInsideRegion() {
  const { x, y, width, height } = puzzle.hitRegion
  return {
    clientX: (x + width / 2) * BOX.width,
    clientY: (y + height / 2) * BOX.height,
  }
}

function renderWaldo() {
  const onSolved = vi.fn()
  const onWrongAnswer = vi.fn()

  render(<Waldo puzzle={puzzle} onSolved={onSolved} onWrongAnswer={onWrongAnswer} />)
  const scene = screen.getByAltText('A busy street scene in Rome')

  return { onSolved, onWrongAnswer, scene }
}

describe('Waldo', () => {
  it('reports success when the legionary is clicked', () => {
    const { onSolved, onWrongAnswer, scene } = renderWaldo()

    fireEvent.click(scene, pointInsideRegion())

    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(onWrongAnswer).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
    expect(onSolved).toHaveBeenCalledOnce()
  })

  it('scribbles and shakes when the click misses', () => {
    const { onSolved, onWrongAnswer, scene } = renderWaldo()

    fireEvent.click(scene, { clientX: 10, clientY: 10 })

    expect(screen.getByText(/not him/)).toBeInTheDocument()
    expect(onWrongAnswer).toHaveBeenCalledOnce()
    expect(onSolved).not.toHaveBeenCalled()
  })

  it('ignores further clicks once he is found', () => {
    const { onWrongAnswer, scene } = renderWaldo()

    fireEvent.click(scene, pointInsideRegion())
    fireEvent.click(scene, { clientX: 10, clientY: 10 })

    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(screen.queryByText(/not him/)).not.toBeInTheDocument()
    expect(onWrongAnswer).not.toHaveBeenCalled()
  })

  it('keeps the tip hidden until she asks for it', () => {
    renderWaldo()

    expect(screen.queryByText(puzzle.tip)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'need a tip?' }))
    expect(screen.getByText(puzzle.tip)).toBeInTheDocument()
  })
})

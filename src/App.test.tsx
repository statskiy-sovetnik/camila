import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import App from './App'

const STORAGE_KEY = 'camila.progress.v1'

const restartButton = () => screen.getByRole('button', { name: /Restart game/ })

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('restarting the game', () => {
  it('stays out of the way on the greeting, where there is nothing to restart', () => {
    render(<App />)

    expect(screen.queryByRole('button', { name: /Restart game/ })).not.toBeInTheDocument()
  })

  it('asks before wiping anything', () => {
    window.localStorage.setItem(STORAGE_KEY, '4')
    render(<App />)

    fireEvent.click(restartButton())

    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Are you sure you want to restart the game? Progress will be lost',
    )
    // Nothing has been touched yet.
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('4')
    expect(screen.getByText(/4 of 7 puzzles solved/)).toBeInTheDocument()
  })

  it('leaves progress alone when she backs out', () => {
    window.localStorage.setItem(STORAGE_KEY, '4')
    render(<App />)

    fireEvent.click(restartButton())
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('4')
    expect(screen.getByText(/4 of 7 puzzles solved/)).toBeInTheDocument()
  })

  it('backs out on Escape too', () => {
    window.localStorage.setItem(STORAGE_KEY, '4')
    render(<App />)

    fireEvent.click(restartButton())
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('4')
  })

  it('clears the save and returns to the greeting once confirmed', () => {
    window.localStorage.setItem(STORAGE_KEY, '4')
    render(<App />)

    fireEvent.click(restartButton())
    fireEvent.click(screen.getByRole('button', { name: /Yes, restart/ }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('0')
    // Back at the very first screen, with the button gone again.
    expect(screen.queryByRole('button', { name: /Restart game/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/puzzles solved/)).not.toBeInTheDocument()
  })
})

import { useCallback, useEffect, useState } from 'react'

import { PUZZLE_COUNT } from '@/lib/reveal'

const STORAGE_KEY = 'camila.progress.v1'
/**
 * Whether she has clicked through the final prompt. Its own key rather than a
 * field on the one above, which holds a bare number — widening that would
 * invalidate saves already in the wild.
 */
const REVEALED_KEY = 'camila.revealed.v1'

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(PUZZLE_COUNT, Math.max(0, Math.floor(value)))
}

function read(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === null ? 0 : clamp(Number(raw))
  } catch {
    // Private mode / storage disabled — fall back to an in-memory run.
    return 0
  }
}

function write(solvedCount: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(solvedCount))
  } catch {
    // Nothing to do: progress simply won't survive a reload.
  }
}

function readRevealed(): boolean {
  try {
    return window.localStorage.getItem(REVEALED_KEY) === 'true'
  } catch {
    return false
  }
}

function writeRevealed(revealed: boolean): void {
  try {
    window.localStorage.setItem(REVEALED_KEY, String(revealed))
  } catch {
    // Same as above — she'd just see the final prompt once more.
  }
}

export function progressPct(solvedCount: number): number {
  return Math.round((clamp(solvedCount) / PUZZLE_COUNT) * 100)
}

export interface Progress {
  solvedCount: number
  progressPct: number
  isComplete: boolean
  /** She has clicked through the final prompt; the letter is hers from now on. */
  letterRevealed: boolean
  solveNext: () => void
  revealLetter: () => void
  reset: () => void
}

/** Tracks how many puzzles Camila has solved, persisted so a reload doesn't lose it. */
export function useProgress(): Progress {
  const [solvedCount, setSolvedCount] = useState(read)
  const [letterRevealed, setLetterRevealed] = useState(readRevealed)

  useEffect(() => {
    write(solvedCount)
  }, [solvedCount])

  useEffect(() => {
    writeRevealed(letterRevealed)
  }, [letterRevealed])

  const solveNext = useCallback(() => {
    setSolvedCount((current) => clamp(current + 1))
  }, [])

  const revealLetter = useCallback(() => {
    setLetterRevealed(true)
  }, [])

  const reset = useCallback(() => {
    setSolvedCount(0)
    // Has to go too, or a restart would replay the game and then skip the finale.
    setLetterRevealed(false)
  }, [])

  return {
    solvedCount,
    progressPct: progressPct(solvedCount),
    isComplete: solvedCount >= PUZZLE_COUNT,
    letterRevealed,
    solveNext,
    revealLetter,
    reset,
  }
}

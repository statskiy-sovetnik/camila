import { useCallback, useEffect, useState } from 'react'

import { PUZZLE_COUNT } from '@/lib/reveal'

const STORAGE_KEY = 'camila.progress.v1'

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

export function progressPct(solvedCount: number): number {
  return Math.round((clamp(solvedCount) / PUZZLE_COUNT) * 100)
}

export interface Progress {
  solvedCount: number
  progressPct: number
  isComplete: boolean
  solveNext: () => void
  reset: () => void
}

/** Tracks how many puzzles Camila has solved, persisted so a reload doesn't lose it. */
export function useProgress(): Progress {
  const [solvedCount, setSolvedCount] = useState(read)

  useEffect(() => {
    write(solvedCount)
  }, [solvedCount])

  const solveNext = useCallback(() => {
    setSolvedCount((current) => clamp(current + 1))
  }, [])

  const reset = useCallback(() => {
    setSolvedCount(0)
  }, [])

  return {
    solvedCount,
    progressPct: progressPct(solvedCount),
    isComplete: solvedCount >= PUZZLE_COUNT,
    solveNext,
    reset,
  }
}

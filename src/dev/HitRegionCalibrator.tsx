import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { PUZZLES, type HitRegion, type WaldoPuzzle } from '@/data/puzzles'

import styles from './HitRegionCalibrator.module.css'

const FALLBACK: HitRegion = { x: 0.4, y: 0.4, width: 0.1, height: 0.1 }
const MIN_SIZE = 0.005
const NUDGE = 0.002

type DragMode = 'move' | 'resize'

interface Drag {
  mode: DragMode
  clientX: number
  clientY: number
  origin: HitRegion
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function moved(origin: HitRegion, dx: number, dy: number): HitRegion {
  return {
    ...origin,
    x: clamp(origin.x + dx, 0, 1 - origin.width),
    y: clamp(origin.y + dy, 0, 1 - origin.height),
  }
}

function resized(origin: HitRegion, dx: number, dy: number): HitRegion {
  return {
    ...origin,
    width: clamp(origin.width + dx, MIN_SIZE, 1 - origin.x),
    height: clamp(origin.height + dy, MIN_SIZE, 1 - origin.y),
  }
}

function format(region: HitRegion): string {
  const round = (value: number) => value.toFixed(4)
  return `hitRegion: { x: ${round(region.x)}, y: ${round(region.y)}, width: ${round(
    region.width,
  )}, height: ${round(region.height)} },`
}

/**
 * Dev-only. Reachable at /?calibrate — see App.tsx, which only mounts this in
 * development, so it never ships.
 */
export default function HitRegionCalibrator() {
  const waldo = PUZZLES.find((puzzle): puzzle is WaldoPuzzle => puzzle.kind === 'waldo')

  const [region, setRegion] = useState<HitRegion>(waldo?.hitRegion ?? FALLBACK)
  const [copied, setCopied] = useState(false)

  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<Drag | null>(null)

  const beginDrag = (mode: DragMode) => (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { mode, clientX: event.clientX, clientY: event.clientY, origin: region }
  }

  const continueDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const image = imageRef.current
    if (!drag || !image || !event.currentTarget.hasPointerCapture(event.pointerId)) return

    // Deltas are measured against the rendered image, so the numbers stay
    // relative no matter how the page is scaled.
    const bounds = image.getBoundingClientRect()
    const dx = (event.clientX - drag.clientX) / bounds.width
    const dy = (event.clientY - drag.clientY) / bounds.height

    setRegion(drag.mode === 'move' ? moved(drag.origin, dx, dy) : resized(drag.origin, dx, dy))
    setCopied(false)
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dx = event.key === 'ArrowLeft' ? -NUDGE : event.key === 'ArrowRight' ? NUDGE : 0
    const dy = event.key === 'ArrowUp' ? -NUDGE : event.key === 'ArrowDown' ? NUDGE : 0
    if (dx === 0 && dy === 0) return

    event.preventDefault()
    setRegion((current) => (event.shiftKey ? resized(current, dx, dy) : moved(current, dx, dy)))
    setCopied(false)
  }

  const copy = () => {
    void navigator.clipboard.writeText(format(region)).then(() => setCopied(true))
  }

  if (!waldo) return <p className={styles.hint}>No waldo puzzle in PUZZLES.</p>

  return (
    <div className={styles.screen}>
      <div className={styles.stage}>
        <img ref={imageRef} className={styles.scene} src={waldo.scene} alt="" draggable={false} />

        <div
          className={styles.region}
          role="group"
          aria-label="Hit region"
          tabIndex={0}
          style={{
            left: `${region.x * 100}%`,
            top: `${region.y * 100}%`,
            width: `${region.width * 100}%`,
            height: `${region.height * 100}%`,
          }}
          onPointerDown={beginDrag('move')}
          onPointerMove={continueDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={handleKeyDown}
        >
          <div
            className={styles.handle}
            onPointerDown={beginDrag('resize')}
            onPointerMove={continueDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        </div>
      </div>

      <div className={styles.panel}>
        <img className={styles.target} src={waldo.target.src} alt={waldo.target.label} />
        <p className={styles.coords}>{format(region)}</p>
        <button type="button" className={styles.copy} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <p className={styles.hint}>
        Drag the red box onto {waldo.target.label}; drag the corner to resize. Arrow keys nudge it,{' '}
        <kbd>Shift</kbd> + arrows resize. Then paste the line above over <code>hitRegion</code> in{' '}
        <code>src/data/puzzles.ts</code>. Tip from the puzzle itself: &ldquo;{waldo.tip}&rdquo;
      </p>
    </div>
  )
}

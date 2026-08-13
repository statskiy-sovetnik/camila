import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import styles from './ClipPlayer.module.css'

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

interface ClipPlayerProps {
  /** Path under `public/` — the file is expected to be pre-trimmed. */
  src: string
  /** Accessible label for the scrubber. */
  title: string
}

/**
 * Screen 5d's video well. The clip is a local file rather than an embed: the
 * puzzle asks which track is playing, and YouTube prints the video's title over
 * the frame whenever the player is idle, which hands over the answer. No player
 * parameter suppresses it — `showinfo` and `modestbranding` are both retired.
 *
 * Not covered by tests: jsdom has no media stack, so `play()` and friends are
 * unimplemented there and a test could only assert on the fallback markup.
 */
export function ClipPlayer({ src, title }: ClipPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [duration, setDuration] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  const ready = duration > 0

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      // Straight off the click, so the browser allows sound.
      void video.play()
    } else {
      video.pause()
    }
  }, [])

  const seekToFraction = useCallback(
    (fraction: number) => {
      const video = videoRef.current
      if (!video || !ready) return

      const clamped = Math.min(1, Math.max(0, fraction))
      video.currentTime = clamped * duration
      setElapsed(video.currentTime)
    },
    [duration, ready],
  )

  const seekFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return

      const bounds = track.getBoundingClientRect()
      seekToFraction((clientX - bounds.left) / bounds.width)
    },
    [seekToFraction],
  )

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!ready) return
    event.currentTarget.setPointerCapture(event.pointerId)
    seekFromPointer(event.clientX)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    seekFromPointer(event.clientX)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!ready) return

    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (step === 0) return

    event.preventDefault()
    seekToFraction((elapsed + step) / duration)
  }

  return (
    <div className={styles.well}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        preload="metadata"
        playsInline
        onClick={toggle}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setElapsed(0)
          if (videoRef.current) videoRef.current.currentTime = 0
        }}
        onError={() => setFailed(true)}
      />

      {failed ? (
        <p className={styles.fallback}>
          <span>
            The clip isn&rsquo;t here yet &mdash; drop it at <code>public{src}</code>, trimmed to
            length. See the README.
          </span>
        </p>
      ) : (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.play}
            onClick={toggle}
            disabled={!ready}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="1" y="0" width="3.5" height="12" rx="1" />
                <rect x="7.5" y="0" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 0.6 11 6 2 11.4z" />
              </svg>
            )}
          </button>

          <div
            ref={trackRef}
            className={styles.track}
            role="slider"
            tabIndex={0}
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(elapsed)}
            aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onKeyDown={handleKeyDown}
          >
            <div
              className={styles.fill}
              style={{ width: ready ? `${(elapsed / duration) * 100}%` : 0 }}
            />
          </div>

          <span className={styles.time}>
            {formatTime(elapsed)} / {formatTime(duration)}
          </span>
        </div>
      )}
    </div>
  )
}

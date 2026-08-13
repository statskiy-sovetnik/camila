import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import type { Clip } from '@/data/puzzles'

import styles from './YouTubeClip.module.css'

const API_SRC = 'https://www.youtube.com/iframe_api'

/** The IFrame API is a singleton script — load it once for the whole app. */
let apiPromise: Promise<typeof YT> | null = null

function loadIframeApi(): Promise<typeof YT> {
  if (!apiPromise) {
    const promise = new Promise<typeof YT>((resolve, reject) => {
      if (window.YT?.Player) {
        resolve(window.YT)
        return
      }

      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        if (window.YT) resolve(window.YT)
        else reject(new Error('YouTube IFrame API loaded without a player'))
      }

      const script = document.createElement('script')
      script.src = API_SRC
      script.async = true
      script.onerror = () => reject(new Error('Could not load the YouTube IFrame API'))
      document.head.appendChild(script)
    })

    // Let a later mount retry instead of caching the failure forever.
    promise.catch(() => {
      if (apiPromise === promise) apiPromise = null
    })
    apiPromise = promise
  }

  return apiPromise
}

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

type Status = 'loading' | 'ready' | 'failed'

interface YouTubeClipProps {
  clip: Clip
  /** Accessible label for the scrubber. */
  title: string
}

/**
 * Plays one slice of a YouTube video behind the handoff's own chrome (screen 5d):
 * native controls are off, and the gold scrubber below counts the 15 seconds of
 * the clip rather than the full track.
 */
export function YouTubeClip({ clip, title }: YouTubeClipProps) {
  const { videoId, startSeconds, endSeconds } = clip
  const duration = endSeconds - startSeconds

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)

  const [status, setStatus] = useState<Status>('loading')
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false

    loadIframeApi()
      .then((api) => {
        if (cancelled) return

        // The API replaces the element it is handed, so hand it a throwaway
        // child instead of a node React is tracking.
        const host = document.createElement('div')
        container.appendChild(host)

        playerRef.current = new api.Player(host, {
          videoId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            start: startSeconds,
            end: endSeconds,
          },
          events: {
            onReady: () => {
              if (!cancelled) setStatus('ready')
            },
            onError: () => {
              if (!cancelled) setStatus('failed')
            },
            onStateChange: (event) => {
              if (!cancelled) setPlaying(event.data === api.PlayerState.PLAYING)
            },
          },
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
      container.replaceChildren()
    }
  }, [videoId, startSeconds, endSeconds])

  // The player's own `end` is approximate, so hold the boundary ourselves.
  useEffect(() => {
    if (!playing) return

    const ticker = window.setInterval(() => {
      const player = playerRef.current
      if (!player) return

      const current = player.getCurrentTime()
      if (current >= endSeconds) {
        player.pauseVideo()
        player.seekTo(startSeconds, true)
        setElapsed(0)
        return
      }

      setElapsed(Math.min(duration, Math.max(0, current - startSeconds)))
    }, 200)

    return () => window.clearInterval(ticker)
  }, [playing, startSeconds, endSeconds, duration])

  const toggle = useCallback(() => {
    const player = playerRef.current
    if (!player) return

    if (playing) {
      player.pauseVideo()
      return
    }

    const current = player.getCurrentTime()
    if (current < startSeconds || current >= endSeconds - 0.25) {
      player.seekTo(startSeconds, true)
      setElapsed(0)
    }
    // Called straight from the click, so the browser lets it play with sound.
    player.playVideo()
  }, [playing, startSeconds, endSeconds])

  const seekToFraction = useCallback(
    (fraction: number) => {
      const player = playerRef.current
      if (!player) return

      const clamped = Math.min(1, Math.max(0, fraction))
      player.seekTo(startSeconds + clamped * duration, true)
      setElapsed(clamped * duration)
    },
    [startSeconds, duration],
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
    if (status !== 'ready') return
    event.currentTarget.setPointerCapture(event.pointerId)
    seekFromPointer(event.clientX)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    seekFromPointer(event.clientX)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (status !== 'ready') return

    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (step === 0) return

    event.preventDefault()
    seekToFraction((elapsed + step) / duration)
  }

  if (status === 'failed') {
    return (
      <div className={styles.well}>
        <p className={styles.fallback}>
          <span>
            The clip can&rsquo;t play here.{' '}
            <a
              href={`https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}`}
              target="_blank"
              rel="noreferrer"
            >
              Watch it on YouTube
            </a>{' '}
            instead &mdash; {formatTime(startSeconds)} to {formatTime(endSeconds)}.
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.well}>
      <div className={styles.frame} ref={containerRef} />
      {/* Keeps clicks off the video so our controls are the only way to drive it. */}
      <div className={styles.shield} />

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.play}
          onClick={toggle}
          disabled={status !== 'ready'}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="1" y="0" width="3.5" height="12" rx="1" />
              <rect x="7.5" y="0" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
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
          aria-valuemax={duration}
          aria-valuenow={Math.round(elapsed)}
          aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.fill} style={{ width: `${(elapsed / duration) * 100}%` }} />
        </div>

        <span className={styles.time}>
          {formatTime(elapsed)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}

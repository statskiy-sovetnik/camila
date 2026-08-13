import { Suspense, lazy, useState } from 'react'

import { PUZZLES } from '@/data/puzzles'
import { Greeting } from '@/scenes/Greeting'
import { LetterScene } from '@/scenes/LetterScene'
import { PuzzleScene } from '@/scenes/PuzzleScene'
import { SealedLetter } from '@/scenes/SealedLetter'
import { useProgress } from '@/state/progress'

type Scene = 'greeting' | 'sealed' | 'puzzle' | 'letter'

// `import.meta.env.DEV` is replaced with `false` at build time, so this branch —
// and the calibrator chunk it imports — is dropped from production entirely.
const HitRegionCalibrator = import.meta.env.DEV
  ? lazy(() => import('@/dev/HitRegionCalibrator'))
  : null

function isCalibrating(): boolean {
  return HitRegionCalibrator !== null && new URLSearchParams(location.search).has('calibrate')
}

export default function App() {
  const progress = useProgress()
  // Coming back mid-game skips the intro and drops her at the letter.
  const [scene, setScene] = useState<Scene>(() =>
    progress.solvedCount > 0 ? 'letter' : 'greeting',
  )

  if (HitRegionCalibrator && isCalibrating()) {
    return (
      <Suspense fallback={null}>
        <HitRegionCalibrator />
      </Suspense>
    )
  }

  switch (scene) {
    case 'greeting':
      return <Greeting onStart={() => setScene('sealed')} />

    case 'sealed':
      return <SealedLetter onContinue={() => setScene('puzzle')} />

    case 'puzzle': {
      const puzzle = PUZZLES[progress.solvedCount]
      if (!puzzle) return <LetterScene solvedCount={progress.solvedCount} />

      return (
        <PuzzleScene
          puzzle={puzzle}
          index={progress.solvedCount}
          onSolved={() => {
            progress.solveNext()
            setScene('letter')
          }}
        />
      )
    }

    case 'letter':
      return (
        <LetterScene
          solvedCount={progress.solvedCount}
          onNext={progress.isComplete ? undefined : () => setScene('puzzle')}
        />
      )
  }
}

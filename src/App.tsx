import { useState } from 'react'

import { PUZZLES } from '@/data/puzzles'
import { Greeting } from '@/scenes/Greeting'
import { LetterScene } from '@/scenes/LetterScene'
import { PuzzleScene } from '@/scenes/PuzzleScene'
import { SealedLetter } from '@/scenes/SealedLetter'
import { useProgress } from '@/state/progress'

type Scene = 'greeting' | 'sealed' | 'puzzle' | 'letter'

export default function App() {
  const progress = useProgress()
  // Coming back mid-game skips the intro and drops her at the letter.
  const [scene, setScene] = useState<Scene>(() =>
    progress.solvedCount > 0 ? 'letter' : 'greeting',
  )

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

import { useState } from 'react'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { RestartButton } from '@/components/RestartButton'
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
  const [confirmingRestart, setConfirmingRestart] = useState(false)

  const restart = () => {
    progress.reset()
    setScene('greeting')
    setConfirmingRestart(false)
  }

  const renderScene = () => {
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

  return (
    <>
      {renderScene()}

      {/* Nothing to restart on the greeting — that screen already is the start. */}
      {scene !== 'greeting' && <RestartButton onRestart={() => setConfirmingRestart(true)} />}

      {confirmingRestart && (
        <ConfirmDialog
          message="Are you sure you want to restart the game? Progress will be lost"
          confirmLabel="Yes, restart"
          onConfirm={restart}
          onCancel={() => setConfirmingRestart(false)}
        />
      )}
    </>
  )
}

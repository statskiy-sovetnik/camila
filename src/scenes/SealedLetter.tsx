import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { PIECES } from '@/lib/reveal'

import styles from './SealedLetter.module.css'

interface SealedLetterProps {
  onContinue: () => void
}

/** Screen 1b — nothing is solved yet, so every piece is still in place. */
export function SealedLetter({ onContinue }: SealedLetterProps) {
  return (
    <div className={styles.screen}>
      <ProgressBar solvedCount={0} />

      <div className={styles.stage}>
        <div className={styles.overlay} aria-hidden="true">
          {PIECES.map((piece) => (
            <div key={piece.index} className={styles.piece} />
          ))}
        </div>

        <div className={styles.scrim}>
          <div className={styles.prompt}>
            <Avatar size={68} className={styles.avatar} />
            <p className={styles.copy}>
              As you can see, Camila, the letter is sealed. Let&rsquo;s not wait any longer and
              proceed to our first puzzle!
            </p>
            <Button size="sm" onClick={onContinue}>
              Okaay let&rsquo;s go
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

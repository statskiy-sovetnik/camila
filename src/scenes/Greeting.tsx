import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'

import styles from './Greeting.module.css'

interface GreetingProps {
  onStart: () => void
}

export function Greeting({ onStart }: GreetingProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <Avatar size={96} ring tilt />
        <h1 className={styles.title}>Greetings, Camila!</h1>
        <p className={styles.body}>
          It&rsquo;s me, Cookie Monster. You have a letter from Ivan, but I won&rsquo;t let you read
          it without a small game. You will be asked to solve a few puzzles, each of them unlocking
          a part of the letter. Let&rsquo;s put your knowledge to the test &mdash; are you ready?
        </p>
        <Button onClick={onStart}>Yesss!</Button>
      </div>
    </div>
  )
}

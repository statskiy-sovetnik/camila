import cookieMonster from '@/assets/cookie-monster.jpeg'

import styles from './Avatar.module.css'

interface AvatarProps {
  /** Diameter in px — 96 on the greeting, 68 on the prompt card, 44 in modal headers, 34 by the tip. */
  size: number
  /** The 4px crimson ring, used on the greeting avatar. */
  ring?: boolean
  /** The slight -4deg tilt, used on the greeting avatar. */
  tilt?: boolean
  className?: string
}

export function Avatar({ size, ring = false, tilt = false, className }: AvatarProps) {
  return (
    <img
      src={cookieMonster}
      alt="Cookie Monster, the narrator kitten"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={[styles.avatar, ring && styles.ring, tilt && styles.tilt, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

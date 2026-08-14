import type { ReactNode } from 'react'

import { Avatar } from '@/components/Avatar'

import styles from './PromptCard.module.css'

/** Breathing room between the bottom of the avatar and the first line of copy. */
const AVATAR_CLEARANCE = 12

interface PromptCardProps {
  /** Uppercase label above the copy — 5f and 5g have one, screen 1b does not. */
  eyebrow?: string
  /** Diameter of the overhanging avatar: 68px on 1b and 5g, 64px on 5f. */
  avatarSize?: number
  /** The crimson ring around the avatar. */
  ring?: boolean
  /** Which paper the card is cut from — see the two variants in the stylesheet. */
  paper?: 'modal' | 'letter'
  className?: string
  children: ReactNode
}

/**
 * The paper card Cookie Monster talks from: a narrow column of paper with his
 * portrait hanging half over its top edge. Shared by the sealed-letter intro
 * (1b), the emoji riddle's opener (5f) and the final prompt (5g).
 *
 * The width is the caller's business — inside a puzzle modal it comes from the
 * modal, on the letter screen it is set on the card.
 */
export function PromptCard({
  eyebrow,
  avatarSize = 68,
  ring = false,
  paper = 'modal',
  className,
  children,
}: PromptCardProps) {
  const overhang = avatarSize / 2

  return (
    // The wrapper reserves the overhang, so nothing clips the portrait and the
    // card and avatar can be faded or moved as one piece.
    <div
      className={[styles.wrap, className].filter(Boolean).join(' ')}
      style={{ paddingTop: overhang }}
    >
      <Avatar size={avatarSize} ring={ring} className={styles.avatar} />

      <div
        className={`${styles.card} ${styles[paper]}`}
        style={{ paddingTop: overhang + AVATAR_CLEARANCE }}
      >
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {children}
      </div>
    </div>
  )
}

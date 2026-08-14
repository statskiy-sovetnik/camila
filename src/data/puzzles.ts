import dress11 from '@/assets/fashion/1-1.jpeg'
import dress12 from '@/assets/fashion/1-2.jpeg'
import dress13 from '@/assets/fashion/1-3-IVH.webp'
import dress14 from '@/assets/fashion/1-4.jpg'
import dress21 from '@/assets/fashion/2-1.jpg'
import dress22 from '@/assets/fashion/2-2.avif'
import dress23 from '@/assets/fashion/2-3-mcqueen.jpg'
import dress24 from '@/assets/fashion/2-4-IVH.jpg'
import dress31 from '@/assets/fashion/3-1-IVH.jpeg'
import dress32 from '@/assets/fashion/3-2.jpg'
import dress33 from '@/assets/fashion/3-3.webp'
import dress34 from '@/assets/fashion/3-4.avif'
import findRome from '@/assets/find-rome.webp'
import legionary from '@/assets/legionary.png'
import nefertiti from '@/assets/nefertiti.jpg'
import sheepstealer from '@/assets/sheepstealer.jpg'
import slushyNoobz from '@/assets/slushy-noobz.png'

/**
 * The order of this array *is* the order of the game — the "PUZZLE N OF 7"
 * eyebrow is derived from the index, so puzzles can be reordered freely.
 */
interface PuzzleBase {
  /** Narrator aside, right-aligned in the modal header. */
  quip: string
  /** CSS width for the modal — the handoff varies it per puzzle. */
  modalWidth: string
}

/**
 * Every kind but the emoji riddle asks one question, drawn by the modal shell.
 * The riddle asks three and draws its own headings, so it has no shared title.
 */
interface AskingPuzzle extends PuzzleBase {
  question: string
}

/** 1c template — image + four radio rows + a Submit button. */
export interface MultipleChoicePuzzle extends AskingPuzzle {
  kind: 'multiple-choice'
  image?: { src: string; height: number; objectPosition?: string }
  options: string[]
  /** Index into `options`. */
  correctIndex: number
}

/** Rectangle over the scene image, in relative (0–1) coordinates. */
export interface HitRegion {
  x: number
  y: number
  width: number
  height: number
}

/** 5a — click the legionary in the Rome scene. */
export interface WaldoPuzzle extends AskingPuzzle {
  kind: 'waldo'
  scene: string
  target: { src: string; label: string }
  hitRegion: HitRegion
  tip: string
}

/** 5d — video clip + four radio rows. */
export interface VideoPuzzle extends AskingPuzzle {
  kind: 'video'
  /** Path under `public/` to a file already trimmed to the intended 15 seconds. */
  clipSrc: string
  options: string[]
  correctIndex: number
}

/** One round of the picture-pick: four photos, one of them the Iris van Herpen. */
export interface PicturePickRound {
  images: { src: string; alt: string }[]
  /** Index into `images`. */
  correctIndex: number
  correctCopy: string
}

/**
 * 5e — pick one of four photos, no Submit button.
 *
 * The rounds run back to back and count as a *single* puzzle: only clearing all
 * of them lifts a batch of pieces off the letter.
 */
export interface PicturePickPuzzle extends AskingPuzzle {
  kind: 'picture-pick'
  rounds: PicturePickRound[]
  /** The same line for every round. */
  wrongCopy: string
}

export interface EmojiRiddleQuestion {
  title: string
  emojis: string
  /**
   * Fragments that count as the answer. A guess is right if it *contains* any of
   * them, ignoring case — so list the key word rather than the full name, and
   * "aemond", "Aemond Targaryen" and "is it aemond?" all pass.
   */
  accepts: string[]
  /** Optional nudge, hidden behind a "need a tip?" link. */
  tip?: string
}

/**
 * 5f — the final challenge: typed-answer riddles behind an intro card. Like the
 * picture-pick's rounds, all of the questions together count as a single puzzle,
 * so clearing the last one takes the letter to 100%.
 */
export interface EmojiRiddlePuzzle extends PuzzleBase {
  kind: 'emoji-riddle'
  intro: string
  /** Label on the button that sets the intro card alight. */
  startLabel: string
  questions: EmojiRiddleQuestion[]
}

export type Puzzle =
  MultipleChoicePuzzle | WaldoPuzzle | VideoPuzzle | PicturePickPuzzle | EmojiRiddlePuzzle

export const PUZZLES: Puzzle[] = [
  {
    kind: 'waldo',
    quip: "he's in there somewhere…",
    question: "You're in Rome now! Find the legionary.",
    // The handoff says 740px, but the legionary is tiny — this one needs room.
    modalWidth: '75vw',
    scene: findRome,
    target: { src: legionary, label: 'the legionary' },
    // Relative (0–1) box over the scene: the legionary is the figure with the
    // raised sword by the brick arches on the right.
    hitRegion: { x: 0.8255, y: 0.6678, width: 0.0479, height: 0.1354 },
    tip: 'psst… He is next to the wall with cats',
  },
  {
    kind: 'multiple-choice',
    quip: 'history nerd hours',
    question:
      'Okay pookie, here is another one: Who is depicted in this famous bust, and where is it controversially housed today?',
    modalWidth: '676px',
    image: { src: nefertiti, height: 230, objectPosition: '50% 30%' },
    options: [
      'Cleopatra VII; the British Museum, London',
      'Nefertiti; the Neues Museum, Berlin',
      'Queen Tiye; the Louvre, Paris',
      'Michele Obama; Moscow',
    ],
    correctIndex: 1,
  },
  {
    kind: 'multiple-choice',
    quip: 'fire & blood',
    question:
      'Which dragon is considered riderless and wild at the start of the show, living in the volcanic depths of Dragonstone, and later becomes central to the war?',
    modalWidth: '676px',
    image: { src: sheepstealer, height: 200, objectPosition: '50% 78%' },
    options: ['Vermithor, the Bronze Fury', 'Sheepstealer', 'The Cannibal', 'Grey Ghost'],
    correctIndex: 1,
  },
  {
    kind: 'video',
    quip: 'turn the sound on',
    question:
      'How well do you know The Neighbourhood? This clip was directed by the legendary Hype Williams. Which track is it?',
    modalWidth: '676px',
    // 15 seconds from 2:17 of "The Neighbourhood — R.I.P. 2 My Youth". A local
    // file rather than an embed: YouTube prints the title over the frame, which
    // is the answer. See public/media/README.md.
    clipSrc: '/media/neighbourhood-clip.mp4',
    options: ['Sweater Weather', 'R.I.P. 2 My Youth', 'Daddy Issues', 'The Beach'],
    correctIndex: 1,
  },
  {
    kind: 'picture-pick',
    quip: 'haute couture final boss',
    // One question for all three rounds — only the photos change under it.
    question:
      'Okay smartpants, only one of those dresses is designed by Iris Van Herpen. Which one? Choose wisely 😈',
    modalWidth: '840px',
    // The filename is the answer key: `<round>-<position>`, with `-IVH` marking
    // the Iris van Herpen. See src/assets/fashion/.
    rounds: [
      {
        images: [
          { src: dress11, alt: 'Dress 1' },
          { src: dress12, alt: 'Dress 2' },
          { src: dress13, alt: 'Dress 3' },
          { src: dress14, alt: 'Dress 4' },
        ],
        correctIndex: 2,
        correctCopy: "Of course you knew it. That's my girl! ✓",
      },
      {
        images: [
          { src: dress21, alt: 'Dress 1' },
          { src: dress22, alt: 'Dress 2' },
          { src: dress23, alt: 'Dress 3' },
          { src: dress24, alt: 'Dress 4' },
        ],
        correctIndex: 3,
        correctCopy: 'Two for two. Okay, show-off ✓',
      },
      {
        images: [
          { src: dress31, alt: 'Dress 1' },
          { src: dress32, alt: 'Dress 2' },
          { src: dress33, alt: 'Dress 3' },
          { src: dress34, alt: 'Dress 4' },
        ],
        correctIndex: 0,
        correctCopy: 'Three for three — haute couture queen ✓',
      },
    ],
    wrongCopy: 'Not quite, try again, little dove!',
  },
  {
    kind: 'multiple-choice',
    quip: 'chronically online hours',
    question: "Okay, this one's your territory: what are the Slushy Noobz' real names?",
    modalWidth: '676px',
    image: { src: slushyNoobz, height: 250, objectPosition: '50% 55%' },
    // The decoys copy the shape of the real answer — an Arabic given name with
    // `Al-` plus a Slavic surname — so none of them is ruled out at a glance.
    options: [
      'Yusuf Al-Rashid, Tomas Novakovic',
      'Karim Al-Haddad, Luka Petrovic',
      'Hamzah Al-Emad, Martin Andrijasevic',
      'Omar Al-Sayed, Stefan Markovic',
    ],
    // Not the second row: the three questions before this one all answer to 1.
    correctIndex: 2,
  },
  {
    kind: 'emoji-riddle',
    quip: '🔥🔥🔥',
    modalWidth: '400px',
    intro:
      'Okay, Camila, this is your final challenge. Three questions, in which you will have to figure out the name of the character or location from the House of the Dragon!',
    startLabel: 'Dracarys 🔥',
    questions: [
      {
        title: "What's the name of this dude?",
        emojis: '👁️❌💎',
        accepts: ['aemond'],
      },
      {
        title: "What's the name of this lady?",
        emojis: '👸🚫👑',
        accepts: ['rhaenys'],
        tip: 'The queen who never was',
      },
      {
        title: 'Can you guess this woman?',
        emojis: '🐑🐉👧⚫',
        accepts: ['nettles'],
        tip: 'One of your favorite characters',
      },
    ],
  },
]

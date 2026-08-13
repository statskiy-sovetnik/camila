import dress1 from '@/assets/dress-1.jpeg'
import dress2 from '@/assets/dress-2.jpeg'
import dress3 from '@/assets/dress-3.webp'
import dress4 from '@/assets/dress-4.jpg'
import findRome from '@/assets/find-rome.webp'
import legionary from '@/assets/legionary.png'
import nefertiti from '@/assets/nefertiti.jpg'
import sheepstealer from '@/assets/sheepstealer.jpg'

/**
 * The order of this array *is* the order of the game — the "PUZZLE N OF 7"
 * eyebrow is derived from the index, so puzzles can be reordered freely.
 */
interface PuzzleBase {
  /** Narrator aside, right-aligned in the modal header. */
  quip: string
  question: string
  /** Modal width in px; the handoff varies this per puzzle. */
  modalWidth: number
}

/** 1c template — image + four radio rows + a Submit button. */
export interface MultipleChoicePuzzle extends PuzzleBase {
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
export interface WaldoPuzzle extends PuzzleBase {
  kind: 'waldo'
  scene: string
  target: { src: string; label: string }
  hitRegion: HitRegion
  tip: string
}

/** A slice of a YouTube video, in seconds from the start of the video. */
export interface Clip {
  videoId: string
  startSeconds: number
  endSeconds: number
}

/** 5d — video clip + four radio rows. */
export interface VideoPuzzle extends PuzzleBase {
  kind: 'video'
  clip: Clip
  options: string[]
  correctIndex: number
}

/** 5e — pick one of four photos, no Submit button. */
export interface PicturePickPuzzle extends PuzzleBase {
  kind: 'picture-pick'
  images: { src: string; alt: string }[]
  correctIndex: number
  correctCopy: string
  wrongCopy: string
}

export type Puzzle = MultipleChoicePuzzle | WaldoPuzzle | VideoPuzzle | PicturePickPuzzle

export const PUZZLES: Puzzle[] = [
  {
    kind: 'waldo',
    quip: "he's in there somewhere…",
    question: "You're in Rome now! Find the legionary.",
    modalWidth: 740,
    scene: findRome,
    target: { src: legionary, label: 'the legionary' },
    // Eyeballed off the scene — the legionary is the figure with the raised
    // sword by the brick arches on the right. Dial it in with `yarn dev` and
    // /?calibrate, which draws this rectangle in red over the image.
    hitRegion: { x: 0.82, y: 0.66, width: 0.05, height: 0.09 },
    tip: 'psst… He is next to the wall with cats',
  },
  {
    kind: 'multiple-choice',
    quip: 'history nerd hours',
    question:
      'Okay pookie, here is another one: Who is depicted in this famous bust, and where is it controversially housed today?',
    modalWidth: 520,
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
    modalWidth: 520,
    image: { src: sheepstealer, height: 200, objectPosition: '50% 78%' },
    options: ['Vermithor, the Bronze Fury', 'Sheepstealer', 'The Cannibal', 'Grey Ghost'],
    correctIndex: 1,
  },
  {
    kind: 'video',
    quip: 'turn the sound on',
    question:
      'How well do you know The Neighbourhood? This clip was directed by the legendary Hype Williams. Which track is it?',
    modalWidth: 520,
    // "The Neighbourhood - R.I.P. 2 My Youth (Official Video)", 2:17 + 15s.
    clip: { videoId: 'vKH-rcO6PA8', startSeconds: 137, endSeconds: 152 },
    options: ['Sweater Weather', 'R.I.P. 2 My Youth', 'Daddy Issues', 'The Beach'],
    correctIndex: 1,
  },
  {
    kind: 'picture-pick',
    // Copy is verbatim from the handoff, where this was the final puzzle. Worth
    // revisiting once puzzles 6 and 7 have content.
    quip: 'haute couture final boss',
    question:
      'Okay smartpants, only one of those dresses is designed by Iris Van Herpen. Which one? Choose wisely 😈',
    modalWidth: 840,
    images: [
      { src: dress1, alt: 'Dress 1' },
      { src: dress2, alt: 'Dress 2' },
      { src: dress3, alt: 'Dress 3' },
      { src: dress4, alt: 'Dress 4' },
    ],
    correctIndex: 2,
    correctCopy: "Of course you knew it. That's my girl! ✓",
    wrongCopy: 'Hmm, not this one… look closer, pookie',
  },
  // TODO(ivan): the last two are the 1c template with content still to be written.
  {
    kind: 'multiple-choice',
    quip: 'no pressure ;)',
    question: 'TODO: sixth question',
    modalWidth: 520,
    options: ['TODO', 'TODO', 'TODO', 'TODO'],
    correctIndex: 0,
  },
  {
    kind: 'multiple-choice',
    quip: 'last one, promise',
    question: 'TODO: seventh question',
    modalWidth: 520,
    options: ['TODO', 'TODO', 'TODO', 'TODO'],
    correctIndex: 0,
  },
]

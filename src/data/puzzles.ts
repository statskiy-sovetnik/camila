import dress1 from '@/assets/dress-1.jpeg'
import dress2 from '@/assets/dress-2.jpeg'
import dress3 from '@/assets/dress-3.webp'
import dress4 from '@/assets/dress-4.jpg'
import findRome from '@/assets/find-rome.webp'
import legionary from '@/assets/legionary.png'
import nefertiti from '@/assets/nefertiti.jpg'
import sheepstealer from '@/assets/sheepstealer.jpg'

interface PuzzleBase {
  /** 1-based — drives the "PUZZLE N OF 7" eyebrow. */
  number: number
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

/** 5a — click the legionary in the Rome scene. */
export interface WaldoPuzzle extends PuzzleBase {
  kind: 'waldo'
  scene: string
  target: { src: string; label: string }
  /** Hit region in relative (0–1) coordinates of the scene image. */
  hitRegion: { x: number; y: number; width: number; height: number }
  tip: string
}

/** 5d — video clip + four radio rows. */
export interface VideoPuzzle extends PuzzleBase {
  kind: 'video'
  /** Supplied later by Ivan; see public/media/README.md. */
  clipSrc: string
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
  // TODO(ivan): puzzles 1 and 2 are the 1c template with content still to be written.
  {
    kind: 'multiple-choice',
    number: 1,
    quip: 'no pressure ;)',
    question: 'TODO: first question',
    modalWidth: 520,
    options: ['TODO', 'TODO', 'TODO', 'TODO'],
    correctIndex: 0,
  },
  {
    kind: 'multiple-choice',
    number: 2,
    quip: 'warming up',
    question: 'TODO: second question',
    modalWidth: 520,
    options: ['TODO', 'TODO', 'TODO', 'TODO'],
    correctIndex: 0,
  },
  {
    kind: 'waldo',
    number: 3,
    quip: "he's in there somewhere…",
    question: "You're in Rome now! Find the legionary.",
    modalWidth: 740,
    scene: findRome,
    target: { src: legionary, label: 'the legionary' },
    // TODO: measure against the real render — placeholder region for now.
    hitRegion: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 },
    tip: 'psst… He is next to the wall with cats',
  },
  {
    kind: 'multiple-choice',
    number: 4,
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
    number: 5,
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
    number: 6,
    quip: 'turn the sound on',
    question:
      'How well do you know The Neighbourhood? This clip was directed by the legendary Hype Williams. Which track is it?',
    modalWidth: 520,
    clipSrc: '/media/neighbourhood-clip.mp4',
    options: ['Sweater Weather', 'R.I.P. 2 My Youth', 'Daddy Issues', 'The Beach'],
    correctIndex: 1,
  },
  {
    kind: 'picture-pick',
    number: 7,
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
]

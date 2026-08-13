# A Letter for Camila

A one-page romantic gift site. Camila receives a handwritten letter from Ivan, but it sits under a
jigsaw overlay of 80 pieces. Solving each of 7 puzzles lifts an evenly scattered batch of pieces, so
the letter only becomes readable at 100%. A kitten narrator, Cookie Monster, guides her through it.

No backend, no data fetching — progress lives in `localStorage`.

## Stack

|               |                                                                   |
| ------------- | ----------------------------------------------------------------- |
| Build         | Vite 8                                                            |
| UI            | React 19 + TypeScript                                             |
| Styles        | CSS Modules + design tokens in `src/styles/tokens.css`            |
| Fonts         | self-hosted via `@fontsource` (Caveat, Cormorant Garamond, Karla) |
| Lint / format | oxlint + Prettier                                                 |
| Tests         | Vitest + jsdom + Testing Library                                  |

## Commands

```bash
yarn              # install
yarn dev          # dev server
yarn build        # type-check + production build
yarn preview      # serve the build
yarn lint         # oxlint
yarn format       # prettier --write
yarn test         # vitest run
```

Node 24 (see `.nvmrc`).

## Layout

```
design/            design handoff, kept verbatim — the source of truth
src/assets/        images the app imports
src/components/    Button, Avatar, ProgressBar
src/data/          puzzles.ts — the 7 puzzles and their content
src/lib/reveal.ts  which jigsaw piece belongs to which puzzle
src/scenes/        Greeting, SealedLetter, PuzzleScene, LetterScene
src/state/         progress + localStorage
src/styles/        tokens.css, global.css
```

## Design

`design/README.md` is the full spec: colours, type, spacing, copy and interaction states, all
high-fidelity and final. `design/Letter Puzzle Mockups.dc.html` is the design canvas — open it in a
browser (it needs `support.js` and `design/assets/` alongside it, which are there) and use the
section labels 1a–1e and 5a–5e to find each screen.

Every colour and size in the spec lives in `src/styles/tokens.css`. Add tokens there rather than
hard-coding new values in component styles.

## What is still open

- **Puzzles 1 and 2** — the two 1c-template questions have no content yet; `src/data/puzzles.ts`
  has `TODO` placeholders.
- **The letter copy** — the text in `LetterScene` is the designer's placeholder. Ivan supplies the
  real letter.
- **The video clip** — the ~15s The Neighbourhood clip for puzzle 6 is not in the handoff bundle.
  Drop it at `public/media/neighbourhood-clip.mp4` (see `src/data/puzzles.ts`).
- **The Waldo hit region** — `hitRegion` for puzzle 3 is a placeholder; measure it against the real
  render.
- **The 100% flourish** — deliberately not designed. The handoff says to ask before inventing one.

Scene bodies (option rows, the Waldo tip cloud, the video player, the picture grid, ink-note
feedback, piece lift-out animations) are still stubs.

## Deploying

`vite.config.ts` leaves `base` at `/`. On a subpath host such as GitHub Pages it needs
`base: '/camila/'`.

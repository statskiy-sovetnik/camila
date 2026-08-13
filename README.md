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
src/components/    Button, Avatar, ProgressBar, YouTubeClip
src/data/          puzzles.ts — the 7 puzzles and their content
src/dev/           dev-only tools, stripped from production builds
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

## Puzzle order

The order of the `PUZZLES` array in `src/data/puzzles.ts` _is_ the order of the game — the
"PUZZLE N OF 7" eyebrow is derived from the array index, so puzzles can be reordered freely.

1. Find the legionary (Waldo)
2. Nefertiti
3. Sheepstealer
4. The Neighbourhood clip
5. Iris van Herpen dresses
6. _(no content yet)_
7. _(no content yet)_

## The video clip

Puzzle 4 plays 2:17–2:32 of [The Neighbourhood — R.I.P. 2 My Youth](https://youtu.be/vKH-rcO6PA8)
through the YouTube IFrame API. `src/components/YouTubeClip.tsx` hides the native controls and
draws the handoff's own gold scrubber, counting the 15 seconds of the clip rather than the full
track; it holds the end boundary itself because the API's `end` parameter is approximate.

This needs network, and it is a VEVO embed — an ad may play first, and the rights holder can
restrict embedding. If that becomes a problem, the fallback is the handoff's original plan: put a
15-second `.mp4` in `public/media/` and swap `YouTubeClip` for a plain `<video>`.

## Calibrating the Waldo hit region

`yarn dev`, then open **`/?calibrate`**. It draws the current `hitRegion` as a red box over the
Rome scene — drag it onto the legionary, drag the corner to resize, arrow keys to nudge
(`Shift` + arrows resize) — then copy the printed line over `hitRegion` in `src/data/puzzles.ts`.
The current value is a rough eyeball and still needs this treatment.

The calibrator lives in `src/dev/` behind an `import.meta.env.DEV` check, so it is dropped from
production builds entirely.

## What is still open

- **Puzzles 6 and 7** — no content yet; `src/data/puzzles.ts` has `TODO` placeholders.
- **The letter copy** — the text in `LetterScene` is the designer's placeholder. Ivan supplies the
  real letter.
- **The Waldo hit region** — see above.
- **The 100% flourish** — deliberately not designed. The handoff says to ask before inventing one.
- The Iris van Herpen copy ("haute couture final boss") was written for the final slot and now sits
  at puzzle 5. Left verbatim on purpose; worth revisiting once 6 and 7 exist.

Scene bodies (option rows, the Waldo tip cloud, the picture grid, ink-note feedback, piece lift-out
animations) are still stubs.

## Deploying

`vite.config.ts` leaves `base` at `/`. On a subpath host such as GitHub Pages it needs
`base: '/camila/'`.

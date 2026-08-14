# A Letter for Camila

A one-page romantic gift site. Camila receives a handwritten letter from Ivan, but it sits under a
jigsaw overlay of 80 pieces. Solving each of 7 puzzles lifts an evenly scattered batch of pieces, so
the letter only becomes readable at 100%. A kitten narrator, Cookie Monster, guides her through it.

No backend, no data fetching — progress lives in `localStorage`, under `camila.progress.v1` as a
plain count of solved puzzles. "Restart game" in the top right wipes it, behind a confirmation; it
is hidden on the greeting, which is already the start. `RestartButton` and `ConfirmDialog` are the
only two pieces of UI not in the handoff — everything else is drawn from `design/`.

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
src/components/    Button, Avatar, ProgressBar, InkNote, ClipPlayer, RestartButton, ConfirmDialog
src/data/          puzzles.ts — the 7 puzzles and their content
src/lib/           reveal schedule, hit-region maths
src/puzzles/       one body per puzzle kind, dispatched by PuzzleScene
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
5. Iris van Herpen dresses — three rounds, counting as one puzzle
6. The Slushy Noobz' real names
7. _(no content yet)_

## The video clip

Puzzle 4 plays a 15-second clip and asks which track it is. It is a **local file**, not an embed:
`src/components/ClipPlayer.tsx` is a plain `<video>` with native controls off and the handoff's
gold scrubber drawn over it.

It has to be local because the question's answer is the video's title, and an embedded YouTube
player always prints that title over the frame — before playback, on pause, and at the end. No
parameter suppresses it: `showinfo` was retired in 2018 and `modestbranding` in 2023, and both are
now inert.

The file lives at `public/media/neighbourhood-clip.mp4` and must be trimmed before it is saved —
the player has no in/out points and plays the file end to end:

```bash
ffmpeg -ss 137 -i source.mp4 -t 15 -c:v libx264 -crf 21 -c:a aac -movflags +faststart \
  public/media/neighbourhood-clip.mp4
```

H.264 video plus AAC audio in an `.mp4` plays everywhere that matters. Anything in `public/` is
copied to the build root verbatim and committed to the repo, so keep the clip to a couple of MB.
If the file is missing, the puzzle shows a placeholder naming the expected path instead.

## The Waldo hit region

Puzzle 1 asks Camila to click the legionary in the Rome scene. The target is a relative (0–1)
rectangle in `hitRegion` (`src/data/puzzles.ts`), calibrated and in place; finding him rings the
spot and dims the rest of the scene.

Relative coordinates only line up because the scene `<img>` is sized so the element matches the
rendered picture exactly — `max-width`/`max-height` with `width`/`height: auto`, and no
`object-fit`. Adding `object-fit` would letterbox the element and quietly break the maths.

If the scene image is ever replaced, the drag-to-calibrate overlay that produced these numbers is
in git history (`src/dev/HitRegionOverlay.tsx`, removed once the region was set).

## The dress rounds

Puzzle 5 asks the same question three times over, with four fresh photos each time. All three
rounds together are **one** puzzle: only the last round's "Next →" reports it solved, so the run
lifts a single batch of pieces. `PicturePickPuzzle.rounds` in `src/data/puzzles.ts` holds them, and
`PicturePick.tsx` walks the list.

The photos live in `src/assets/fashion/`, named `<round>-<position>`, with `-IVH` marking the Iris
van Herpen — **the filename is the answer key**, so `correctIndex` can be checked by eye. They are
copies of `design/assets/fashion/`, which is Ivan's own drop and is left exactly as he arranged it;
the names here are normalised (one source file has a space in it, and the first round's four were
still on their old `dress-*` names). One swap is deliberate: `2-3-mcqueen.jpg` here is the handoff's
`mcqueen-2.jpg`, because the file Ivan numbered `2-3` was byte-identical to round 1's `1-4.jpg` and
would have shown the same dress twice. `src/data/puzzles.test.ts` guards against that recurring.

## The jigsaw overlay

`src/lib/reveal.ts` assigns each of the 80 pieces to one of the 7 puzzles and says which edge
carries its knob; `LetterScene` draws them. The knob is a 22px circle in the piece's own tone
straddling the edge, so it covers that stretch of the neighbour's seam and the pair reads as
tab-and-slot — it is not a cut-out shape, and the overlay clips the knobs that would poke past
the paper.

The batch the last solve unlocked is still rendered, with a `lift` animation that flies it off the
paper along a diagonal stagger and ends at `opacity: 0` (`forwards`). Nothing removes those nodes
afterwards: the overlay is `aria-hidden` and `pointer-events: none`, so leaving them there is
cheaper than timing the unmount, and `prefers-reduced-motion` simply lands them on the end state.

## What is still open

- **Puzzle 7** — no content yet; `src/data/puzzles.ts` has a `TODO` placeholder.
- `src/assets/slushy-noobz.png` is a 2.9 MB PNG of what is really a photograph. Re-encoding it as
  WebP would take it under 250 KB; left as Ivan supplied it.
- **The letter copy** — the text in `LetterScene` is the designer's placeholder. Ivan supplies the
  real letter.
- **The 100% flourish** — deliberately not designed. The handoff says to ask before inventing one.
- **The blurred letter behind the puzzle modal** — the modal currently sits on a plain scrim.
- The Iris van Herpen quip ("haute couture final boss") was written for the final slot and now sits
  at puzzle 5. Left verbatim on purpose; worth revisiting once 6 and 7 exist.

Every puzzle body is built. The legionary and the picture-pick have their own (`Waldo.tsx`,
`PicturePick.tsx`); everything answered by picking one of four rows shares
`src/puzzles/MultipleChoice.tsx` (the handoff's "1c template"), including the video puzzle, which
drops its player into that component's media slot. What is missing on 6 and 7 is only the copy.

## Deploying

`vite.config.ts` leaves `base` at `/`. On a subpath host such as GitHub Pages it needs
`base: '/camila/'`.

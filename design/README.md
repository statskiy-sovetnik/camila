# Handoff: Interactive Letter Puzzle — "A Letter for Camila"

## Overview
A romantic gift website. Camila receives a handwritten-style letter from Ivan, but it is covered by a jigsaw-piece overlay. She unlocks it by solving 7 puzzles; each solved puzzle reveals an evenly-scattered batch of jigsaw pieces, so the letter only becomes fully readable at 100%. A kitten narrator, "Cookie Monster" (photo avatar), guides her through every prompt. A gold progress bar (0–100%) sits above the letter.

## About the Design Files
The files in this bundle are **design references created in HTML** — mockups showing intended look and behavior, NOT production code to copy directly. The task is to **recreate these designs in the target codebase's environment** (React, Vue, plain JS, etc.) using its established patterns — or, if no codebase exists yet, choose an appropriate lightweight stack (a single-page React or vanilla-JS app is plenty; no backend needed — state can live in `localStorage` so her progress survives reloads).

`Letter Puzzle Mockups.dc.html` is a design-exploration canvas: multiple screens laid out side by side inside labeled cards. Open it in a browser and use the section labels (1a, 1b, 1c, 1d, 1e, 5a–5e) to find each screen. Ignore the canvas scaffolding (white cards, id badges, caption paragraphs) — only the content inside each dark 880px-wide frame is the design.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interaction states are final unless noted. Recreate pixel-perfectly.

## Flow (screen order)
1. Greeting (1a) → 2. Sealed letter + intro prompt (1b) → 3–9. Puzzle modals (1c, 5a, 5b, 5c, 5d, 5e — 7 puzzles total; two of the built ones are templates to duplicate) with a partial-reveal letter screen between each (1e) → 10. Fully revealed letter at 100%.

## Design Tokens
Colors:
- Background (desk/leather): `#2a2320`; darker piece tone `#3a3129`
- Paper (letter/scroll): `#f2e6c9` with `inset 0 0 60-70px rgba(150,110,50,.18-.22)` vignette; modal paper `#f7efdb`; option-row paper `#fbf5e6`
- Ink (letter text): `#1d1509`; headings on paper `#2b2117`; body on paper `#3a2e1e` / `#4a3b28`
- Accent crimson: `#a63d40` (hover `#b3494c`, shadow/depressed `#7e2d30`); light crimson bg `#fdf1ec`
- Gold (progress bar): gradient `#c9a24a → #a37c2c`; track `rgba(255,255,255,.08)`
- Borders on paper: `#d8c69c` (default), `#a67c3b` (hover/label), `#c9b285` (image frames)
- Success green: `#2e7d4f`; muted caption `#8a7355`
Typography:
- Handwriting: **Caveat** (Google Fonts) 600–700 — all narrator copy, buttons, letter body
- Serif headings: **Cormorant Garamond** 600 — question titles, "Greetings, Camila!"
- UI sans: **Karla** — option labels, progress %, "PUZZLE N OF 7" eyebrows (700, 12px, letter-spacing .14em, uppercase, `#a67c3b`)
Shapes: buttons pill (`border-radius:999px`) with `box-shadow:0 4px 0 <darker>` pressed-look; cards/modals `border-radius:8–10px`; option rows 8px.

## Screens / Views

### 1a — Greeting
Full-viewport dark background `#2a2320` with a soft radial glow `radial-gradient(ellipse at 50% 42%, rgba(240,214,160,.10), transparent 62%)`. Centered paper card 520px, padding 52/56, radius 6, heavy shadow. Contents (column, gap 18, centered):
- Cookie Monster avatar: circular photo 96px, `object-position:50% 18%`, 4px `#a63d40` border, slight `rotate(-4deg)`
- H1 "Greetings, Camila!" — Cormorant Garamond 600, 34px, `#2b2117`
- Body (Caveat 600 21px/1.5, `#4a3b28`, max-width 400px): "It's me, Cookie Monster. You have a letter from Ivan, but I won't let you read it without a small game. You will be asked to solve a few puzzles, each of them unlocking a part of the letter. Let's put your knowledge to the test — are you ready?"
- Button "Yesss!" — crimson pill, Caveat 700 22px, padding 12/44

### 1b — Sealed letter + intro prompt (0%)
Dark background. Top: progress bar (640px wide row, gap 14): 12px-tall pill track + gold fill (0% = just a 12px nub) + "0%" (Karla 700 14px `#c9b89a`). Below: the letter, 640×540, paper base fully covered by the jigsaw overlay (see Jigsaw section). Over everything a scrim `rgba(20,15,12,.45)` with a centered prompt card (420px, paper `#f2e6c9`, radius 8, padding 34/38/30): Cookie Monster avatar 68px circle overlapping the card's top edge (half above), text "As you can see, Camila, the letter is sealed. Let's not wait any longer and proceed to our first puzzle!" (Caveat 600 21px), crimson pill button "Okaay let's go".

### 1c — Multiple-choice puzzle modal (template)
Backdrop: letter screen blurred (`blur(3px) brightness(.55)`). Modal 480–520px, paper `#f7efdb`, radius 10, padding ~26/32, column gap 14–16:
- Header row (space-between): [avatar 44px circle + eyebrow "PUZZLE N OF 7"] | right-aligned Caveat 600 18px `#8a7355` quip (e.g. "no pressure ;)")
- Question: Cormorant Garamond 600 22–24px/1.3 `#2b2117`
- Image: full-width, ~170–250px tall, radius 8, 1px `#c9b285` border, `object-fit:cover`
- Options: 4 rows (column, gap 9–10). Row: flex, gap 12, padding 11–12/16, radius 8, `1.5px solid #d8c69c`, bg `#fbf5e6`, Karla 500 15px; radio dot 18px circle `2px solid #b09566`. Hover: border `#a67c3b`. Selected: `2px solid #a63d40`, bg `#fdf1ec`, Karla 700, radio `5px solid #a63d40` ring, soft crimson glow shadow.
- Submit: crimson pill, Caveat 700 20px, centered. Short fake "checking…" delay (~600ms) before feedback.

### Answer feedback (chosen treatment: "ink note")
Handwritten line appears under the Submit button, as if scribbled:
- Correct: "Correct! ✓" — Caveat 700 30px `#2e7d4f`, with a hand-drawn underline (3px `#2e7d4f` bar, 120px, `rotate(-1.5deg)`)
- Wrong: "Hmm, not quite… try again, love" — Caveat 700 26px `#a63d40`; also gently shake the modal (e.g. 300ms x-axis wiggle)

### 1e — Partial-reveal letter screen (between puzzles)
Same as 1b without the scrim/prompt. Progress bar filled to (solved/7)×100 with glow `0 0 10px rgba(201,162,74,.4)`; below it "N of 7 puzzles solved" (Caveat 600 17px `#8a7a63`). Letter 640×540: paper with vignette, padding 38/44, letter text in Caveat (`#1d1509`): H2 "My dearest Camila," 30px; paragraphs 600 19px/1.55. Jigsaw overlay covers the still-locked pieces. Below the letter: crimson pill "Next puzzle →". After each solve, newly revealed pieces should animate out (fade/scale or lift-and-fly, 400–600ms, staggered).

### Jigsaw overlay (the core mechanic)
- Grid 10 cols × 8 rows = 80 pieces over the 640×540 letter. Each piece: dark tone `#3a3129`, seam `inset 0 0 0 1px rgba(255,255,255,.05)`, plus one circular knob (22px) on the right edge (even pieces) or bottom edge (odd pieces) to read as jigsaw.
- Reveal scheduling: pieces are assigned to the 7 puzzles so each batch is **evenly scattered** across the whole letter (the mock uses the deterministic rule `((row*7 + col*13) % 20) < pct/5` — any even-scatter mapping works). Critical requirement: at no stage before 100% should any full line be readable.
- Fully revealed (100%): overlay gone; optionally a small closing flourish (confetti of tiny paper pieces or a wax-seal "opened" stamp) — not designed yet, ask before inventing.

### 5a — "Find the legionary" (Waldo-style click puzzle)
Modal 740px, same header/eyebrow pattern ("PUZZLE 3 OF 7", quip "he's in there somewhere…"). Question: "You're in Rome now! Find the legionary." Below: the Rome scene image full-width (`assets/find-rome.webp`), radius 8, `cursor:crosshair`. Bottom row (flex, gap 18):
- Target card: bg `#fbf5e6`, 1.5px `#d8c69c`, radius 8, padding 10/16 — legionary cutout image ~92px tall (`assets/legionary.png`, transparent bg) + stacked labels "YOUR TARGET" (eyebrow style) / "the legionary" (Caveat 600 20px)
- Tip area: text-link button "need a tip?" — Caveat 700 20px `#7e2d30`, no bg/border, **wavy underline** (`text-decoration:underline wavy`, `text-underline-offset:5px`), hover `#a63d40`. On click, a thought-cloud appears next to a 34px Cookie Monster avatar: two small white circles (9px, 6px) leading to a bubble (bg `#fffdf4`, 1.5px `#c9b285`, radius 16, padding 9/18, shadow) reading "psst… He is next to the wall with cats" (Caveat 600 19px `#4a3b28`).
Behavior: clicking within the legionary's bounding region = correct (ink-note feedback); clicking elsewhere = gentle "not him…" scribble. Define the hit region as a rect/ellipse over the image in relative coordinates.

### 5b — Nefertiti question
Standard 1c template. Eyebrow "PUZZLE 4 OF 7", quip "history nerd hours". Question: "Okay pookie, here is another one: Who is depicted in this famous bust, and where is it controversially housed today?" Image `assets/nefertiti.jpg` (230px, `object-position:50% 30%`). Options (correct = 2nd):
1. Cleopatra VII; the British Museum, London
2. **Nefertiti; the Neues Museum, Berlin** ✔
3. Queen Tiye; the Louvre, Paris
4. Michele Obama; Moscow

### 5c — Dragon question
Standard template. Eyebrow "PUZZLE 5 OF 7", quip "fire & blood". Question: "Which dragon is considered riderless and wild at the start of the show, living in the volcanic depths of Dragonstone, and later becomes central to the war?" Image `assets/sheepstealer.jpg` (200px, `object-position:50% 78%` — frames the dragon's face). Options: Vermithor, the Bronze Fury / **Sheepstealer** ✔ / The Cannibal / Grey Ghost.

### 5d — Video question (The Neighbourhood)
Standard template, modal 520px. Eyebrow "PUZZLE 6 OF 7", quip "turn the sound on". Question: "How well do you know The Neighbourhood? This clip was directed by the legendary Hype Williams. Which track is it?" Player: 250px tall, dark `#17120e`, radius 8 — a real HTML5 `<video>` with a ~15s clip (clip NOT included in this bundle; the design shows a placeholder with play button, gold scrubber, "0:03 / 0:15" timestamp). Options: Sweater Weather / **R.I.P. 2 My Youth** ✔ / Daddy Issues / The Beach.

### 5e — Iris van Herpen picture-pick (final puzzle)
Modal 840px. Eyebrow "PUZZLE 7 OF 7", quip "haute couture final boss". Question: "Okay smartpants, only one of those dresses is designed by Iris Van Herpen. Which one? Choose wisely 😈". Four images in one row (4-col grid, gap 12, each 250px tall, radius 8, `2px solid #d8c69c`, hover border `#a67c3b`, cursor pointer): dress-1.jpeg, dress-2.jpeg, dress-3.webp (**correct — the IVH**), dress-4.jpg.
States (no Submit button — click a photo directly):
- Correct: picked photo gets `3px solid #2e7d4f` + glow `0 0 0 3px rgba(46,125,79,.25)`; other photos dim to `opacity:.45`; prompt text swaps to "Of course you knew it. That's my girl! ✓" (Caveat 700, green); crimson pill "Next →" appears centered below.
- Wrong: picked photo gets `3px solid #a63d40` + crimson glow; prompt swaps to "Hmm, not this one… look closer, pookie" (Caveat 700, crimson); photos remain clickable.

## Interactions & Behavior
- Flow: greeting → sealed letter + prompt → for each of 7 puzzles: modal opens (backdrop = blurred letter) → solve → modal closes → letter screen with new pieces revealed + updated progress → "Next puzzle →" → next modal. After puzzle 7: 100%, overlay fully gone.
- Wrong answers never block: MC questions allow re-pick + resubmit; Waldo allows re-click; picture-pick stays clickable.
- Progress bar animates (width transition ~500ms ease) when % increases.
- Modals: fade/scale in (~200ms). Piece reveals staggered.
- Buttons: hover lightens crimson to `#b3494c`; pressed removes the 4px drop and translates down 2–4px.

## State Management
- `solvedCount` (0–7), derived `progressPct = round(solvedCount/7*100)`
- `revealedPieces`: derived from solvedCount via the fixed scatter mapping
- Per-puzzle: `selectedOption`, `feedback: null | 'correct' | 'wrong'`, `tipShown` (Waldo)
- Persist `solvedCount` in `localStorage` so refreshing doesn't lose progress
- No backend, no data fetching

## Assets (in `assets/` of this bundle)
- `cookie-monster.jpeg` — narrator kitten photo (crop circular, `object-position:50% 18%` keeps the face)
- `find-rome.webp` — Rome crowd scene for the Waldo puzzle
- `legionary.png` — transparent-background target cutout (background-removed)
- `nefertiti.jpg`, `sheepstealer.jpg` — question images
- `dress-1.jpeg`, `dress-2.jpeg`, `dress-3.webp` (correct), `dress-4.jpg` — Iris van Herpen puzzle
- The Neighbourhood ~15s video clip: **not included** — user will supply
- Fonts via Google Fonts: Caveat (400/600/700), Cormorant Garamond (500/600 + italic), Karla (400/500/700)

## Letter copy
The letter text in the mock (starting "My dearest Camila, / I have been trying to find the right words…") is **placeholder** written by the designer. Ivan will supply the real letter. Keep the structure: Caveat 600, ~19px/1.55, dark ink `#1d1509`, salutation larger (30px).

## Files
- `Letter Puzzle Mockups.dc.html` — the design canvas (open in a browser; requires `support.js` alongside it)
- `support.js` — canvas runtime, reference only
- `assets/` — images listed above

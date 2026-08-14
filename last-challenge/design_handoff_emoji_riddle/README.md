# Handoff: Emoji Riddle Challenge (final puzzle) — "A Letter for Camila"

## Context
This is an ADD-ON to the existing letter-puzzle site (see the main handoff package `design_handoff_letter_puzzle/` if present in the repo). It describes ONE new puzzle: the final challenge, an emoji-riddle mini-quiz with 3 typed-answer questions. It replaces/extends the puzzle sequence as the last puzzle before the letter reaches 100%.

## About the Design File
`Emoji Riddle Mockup.html` section `5f` in the included mockup canvas shows the two designed states side by side inside one card labeled "5f". The files are **design references, not production code** — recreate them in the site's real stack, matching the existing design tokens (already used across the site):
- Paper modal `#f7efdb`, radius 10, shadow `0 24px 60px rgba(0,0,0,.6)`
- Option/answer surfaces `#fbf5e6`, borders `#d8c69c` (hover/focus `#a67c3b`)
- Crimson `#a63d40` (hover `#b3494c`, pressed shadow `#7e2d30`), pill buttons with `box-shadow:0 4px 0 <darker>`
- Fonts: Caveat (narrator copy, buttons, input text), Cormorant Garamond (question titles), Karla (eyebrow labels)
- Narrator: Cookie Monster kitten avatar (`assets/cookie-monster.jpeg`, circular crop, `object-position:50% 18%`)

## Flow
1. **Intro prompt** (State 1): centered paper card, Cookie Monster avatar half-overlapping the top edge (64px circle, 3px crimson border), eyebrow "FINAL CHALLENGE" (Karla 700 12px, letter-spacing .14em, uppercase, `#a67c3b`), text (Caveat 600 21px/1.5 `#3a2e1e`, centered):
   "Okay, Camila, this is your final challenge. Three questions, in which you will have to figure out the name of the character or location from the House of the Dragon!"
   Button: **"Dracarys 🔥"** — crimson pill, Caveat 700 22px, padding 11/44.
2. **Burn transition** (on Dracarys click): the prompt card burns away — a charring edge sweeps upward across the card, ash particles drift up/away, then the question card fades/scales in (~250ms). Keep it lightweight (CSS mask/gradient sweep + a few animated particle divs is fine); total ~900–1200ms.
3. **Question screens** (State 2), 3 questions sharing one layout:
   - Header row (space-between): [avatar 44px + eyebrow "QUESTION N OF 3"] | right quip "🔥🔥🔥" (Caveat 600 18px `#8a7355`)
   - Title: Cormorant Garamond 600 24px `#2b2117`
   - Emoji panel: bg `#fbf5e6`, 1.5px `#d8c69c`, radius 8, padding 22, emojis at 44px, letter-spacing 6px, centered
   - Text input: full-width, bg `#fffdf4`, 1.5px `#d8c69c`, radius 8, padding 12/16, Caveat 600 20px `#3a2e1e`, placeholder "Type here", focus border `#a67c3b`
   - Submit: crimson pill, Caveat 700 20px, centered
4. Between questions: brief correct feedback, then advance to the next question (a quick fade or reuse a lighter burn sweep). After question 3: the puzzle completes like any other (modal closes, letter pieces reveal, progress updates).

## Questions
Only question 1 is designed/decided:
- Q1 title: "What's the name of this dude?" — emojis: 👁️❌💎 — **answer: Aemond Targaryen** (accept "Aemond" alone, case-insensitive, trimmed)
- Q2, Q3: NOT yet written. Reuse the exact Q1 layout; the user (Ivan) will supply the emoji strings, titles, and answers. Leave them as easily editable data (e.g. a `questions` array of `{title, emojis, answers[]}`).

## Feedback
Same "ink note" treatment as the rest of the site: on wrong submit, a handwritten scribble appears under the Submit button — "Hmm, not quite… try again, love" (Caveat 700 26px `#a63d40`) + a gentle modal shake; on correct — "Correct! ✓" (Caveat 700 30px `#2e7d4f` with a tilted hand-drawn underline) before advancing. Wrong answers never block; she can retype and resubmit.

## State
- `currentQuestion` (0–2), `feedback: null|'correct'|'wrong'` per attempt
- Completing all 3 marks this single puzzle as solved in the site's overall `solvedCount`
- Answer matching: lowercase, trim, accept listed aliases

## Files
- `Emoji Riddle Mockup.html` — mockup canvas (open in browser; needs `support.js` next to it); the relevant card is labeled **5f**
- `support.js` — canvas runtime, reference only
- `assets/cookie-monster.jpeg` — narrator avatar

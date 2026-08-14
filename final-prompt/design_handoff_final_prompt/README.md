# Handoff: Final Prompt + Letter Reveal — "A Letter for Camila"

## Context
ADD-ON to the existing letter-puzzle site (see main handoff `design_handoff_letter_puzzle/`). Describes ONE screen: the final congratulations prompt shown when ALL puzzles are solved (progress = 100%), and the reveal animation that follows. The design reference is card **5g** in the included mockup canvas.

## About the Design File
`Final Prompt Mockup.html` is a design canvas — open in a browser, find the card labeled **5g**. Design references only, not production code; rebuild in the site's real stack using the shared tokens:
- Paper modal `#f7efdb`, radius 10, shadow `0 20px 50px rgba(0,0,0,.6)`
- Crimson `#a63d40` (hover `#b3494c`, pressed shadow `0 4px 0 #7e2d30`), pill buttons
- Fonts: Caveat (copy/buttons), Karla (eyebrow), Cormorant Garamond elsewhere
- Narrator avatar `assets/cookie-monster.jpeg` (circular, `object-position:50% 18%`)

## Layout (state when it appears)
- Progress bar at 100%: full gold fill (`linear-gradient(180deg,#c9a24a,#a37c2c)`) with glow `0 0 12px rgba(201,162,74,.55)`, label "100%".
- Letter fully unlocked: ALL jigsaw pieces gone, but the letter is blurred (`filter: blur(5px)`) under a scrim `rgba(20,15,12,.4)`.
- Centered prompt card, 420px, padding 34/38/28, text-centered, column gap 15:
  - Cookie Monster avatar 68px circle, 3.5px crimson border, half-overlapping the card's top edge
  - Eyebrow "ALL CHALLENGES COMPLETE" (Karla 700 12px, letter-spacing .14em, uppercase, `#a67c3b`)
  - Copy (Caveat 600 21px/1.5 `#3a2e1e`): "Congrrrrats, baby, you have proven yourself competent. Can't wait for you to pet and feed me when you are back to Bangkok. Cookie Monster out! 🐈"
  - Button: "Reveal the Letter 👁️" — crimson pill, Caveat 700 21px, padding 11/38

## Reveal animation (on button click)
1. The prompt window disappears: scale-down + fade (~250ms, ease-in; e.g. `transform: scale(.9); opacity: 0`).
2. THEN the scrim fades and the letter's blur eases from `blur(5px)` to `blur(0)` over **0.5s** (CSS transition on `filter` + background opacity), leaving the letter crisp and readable.
3. End state: clean letter screen — 100% bar, no overlay, full letter text. This is the site's final resting state (persist it; revisits skip straight here).

## Files
- `Final Prompt Mockup.html` — mockup canvas (needs `support.js` next to it); relevant card is **5g**
- `support.js` — canvas runtime, reference only
- `assets/cookie-monster.jpeg` — narrator avatar

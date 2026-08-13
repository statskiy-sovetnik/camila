/**
 * Jigsaw reveal schedule.
 *
 * The letter (640×540) is covered by a 10×8 grid of 80 pieces. Each piece is
 * assigned to one of the 7 puzzles; solving puzzle N lifts that puzzle's batch.
 *
 * design/README.md suggests the rule `((row*7 + col*13) % 20) < pct/5`, but it
 * only offers it as *an* even-scatter mapping ("any even-scatter mapping works").
 * That particular one is uneven (batches of 15/7/19/4/20/4/11) and fully clears
 * the bottom grid row at 6 of 7 solved — which breaks the handoff's own hard
 * requirement that no full line of the letter be readable before 100%.
 *
 * So instead: within each grid row the 10 columns are shuffled with a seeded PRNG
 * and dealt round-robin into the 7 batches, with the starting batch rotating per
 * row. Because 10 > 7, every grid row is guaranteed to contain at least one piece
 * of every batch — including the last one — so no row can clear early. Batch sizes
 * come out at 12/12/12/11/11/11/11 and the shuffle keeps each batch scattered.
 *
 * The schedule is deterministic: the same piece always belongs to the same puzzle.
 */

export const GRID_COLS = 10
export const GRID_ROWS = 8
export const PIECE_COUNT = GRID_COLS * GRID_ROWS
export const PUZZLE_COUNT = 7

export interface Piece {
  /** Index into the flat grid, `row * GRID_COLS + col`. */
  index: number
  row: number
  col: number
  /** Which puzzle (0-based) lifts this piece. */
  batch: number
  /** Which edge carries the jigsaw knob — right on even pieces, bottom on odd. */
  knob: 'right' | 'bottom'
}

/** Small deterministic PRNG, so the layout is stable across reloads and builds. */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffledColumns(row: number): number[] {
  const random = mulberry32(0x9e37 + row * 0x85eb)
  const cols = Array.from({ length: GRID_COLS }, (_, i) => i)
  for (let i = cols.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[cols[i], cols[j]] = [cols[j], cols[i]]
  }
  return cols
}

function buildSchedule(): Piece[] {
  const pieces = new Array<Piece>(PIECE_COUNT)

  for (let row = 0; row < GRID_ROWS; row++) {
    // Rotating start batch keeps the batches from lining up vertically.
    const offset = (row * 3) % PUZZLE_COUNT

    shuffledColumns(row).forEach((col, position) => {
      const index = row * GRID_COLS + col
      pieces[index] = {
        index,
        row,
        col,
        batch: (position + offset) % PUZZLE_COUNT,
        knob: index % 2 === 0 ? 'right' : 'bottom',
      }
    })
  }

  return pieces
}

/** All 80 pieces in grid order (row-major). */
export const PIECES: readonly Piece[] = buildSchedule()

/** A piece is lifted once its batch's puzzle has been solved. */
export function isRevealed(piece: Piece, solvedCount: number): boolean {
  return piece.batch < solvedCount
}

/** Pieces still covering the letter at the given progress. */
export function coveringPieces(solvedCount: number): Piece[] {
  return PIECES.filter((piece) => !isRevealed(piece, solvedCount))
}

/** Pieces lifted by the most recent solve — these are the ones to animate out. */
export function newlyRevealedPieces(solvedCount: number): Piece[] {
  return PIECES.filter((piece) => piece.batch === solvedCount - 1)
}

export function revealedCount(solvedCount: number): number {
  return PIECES.filter((piece) => isRevealed(piece, solvedCount)).length
}

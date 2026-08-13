import type { HitRegion } from '@/data/puzzles'

/**
 * Hit regions are stored in relative (0–1) coordinates so they survive any
 * rendered size of the scene image. `x` and `y` must be relative too — divide
 * the click offset by the image's own bounding box, not its container's.
 */
export function isInsideHitRegion(region: HitRegion, x: number, y: number): boolean {
  return (
    x >= region.x && x <= region.x + region.width && y >= region.y && y <= region.y + region.height
  )
}

/** Turns a pointer event into coordinates relative to the element it hit. */
export function relativeToElement(
  element: Element,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const bounds = element.getBoundingClientRect()

  return {
    x: (clientX - bounds.left) / bounds.width,
    y: (clientY - bounds.top) / bounds.height,
  }
}

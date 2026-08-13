import { describe, expect, it } from 'vitest'

import type { HitRegion } from '@/data/puzzles'

import { isInsideHitRegion, relativeToElement } from './hitRegion'

const region: HitRegion = { x: 0.2, y: 0.4, width: 0.1, height: 0.2 }

describe('isInsideHitRegion', () => {
  it('accepts the centre', () => {
    expect(isInsideHitRegion(region, 0.25, 0.5)).toBe(true)
  })

  it('accepts the corners', () => {
    expect(isInsideHitRegion(region, 0.2, 0.4)).toBe(true)
    expect(isInsideHitRegion(region, 0.3, 0.6)).toBe(true)
  })

  it('rejects points outside on every side', () => {
    expect(isInsideHitRegion(region, 0.19, 0.5)).toBe(false)
    expect(isInsideHitRegion(region, 0.31, 0.5)).toBe(false)
    expect(isInsideHitRegion(region, 0.25, 0.39)).toBe(false)
    expect(isInsideHitRegion(region, 0.25, 0.61)).toBe(false)
  })
})

describe('relativeToElement', () => {
  it('maps a client point into 0–1 coordinates of the element', () => {
    const element = {
      getBoundingClientRect: () => ({ left: 100, top: 50, width: 400, height: 200 }),
    } as Element

    expect(relativeToElement(element, 300, 150)).toEqual({ x: 0.5, y: 0.5 })
    expect(relativeToElement(element, 100, 50)).toEqual({ x: 0, y: 0 })
    expect(relativeToElement(element, 500, 250)).toEqual({ x: 1, y: 1 })
  })
})

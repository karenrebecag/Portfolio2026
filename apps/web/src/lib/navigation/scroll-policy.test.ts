import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollPolicy, decideScroll, type ScrollExecutor } from './scroll-policy'

describe('decideScroll', () => {
  it('hash always wins', () => {
    expect(decideScroll('push', '#x')).toBe('hash')
    expect(decideScroll('pop', '#x')).toBe('hash')
  })

  it('forward goes top, back restores', () => {
    expect(decideScroll('push', null)).toBe('top')
    expect(decideScroll('replace', null)).toBe('top')
    expect(decideScroll('pop', null)).toBe('restore')
  })
})

describe('ScrollPolicy', () => {
  let y: number
  let exec: ScrollExecutor
  let scrollToY: ReturnType<typeof vi.fn<(y: number) => void>>
  let scrollToHash: ReturnType<typeof vi.fn<(hash: string) => boolean>>

  beforeEach(() => {
    y = 0
    scrollToY = vi.fn<(y: number) => void>((next) => {
      y = next
    })
    scrollToHash = vi.fn<(hash: string) => boolean>(() => true)
    exec = { getY: () => y, scrollToY, scrollToHash }
  })

  it('saves and restores a path position', () => {
    y = 540
    const policy = new ScrollPolicy(exec)
    policy.save('/articulos/foo')
    expect(policy.hasSaved('/articulos/foo')).toBe(true)

    y = 0
    policy.apply('restore', '/articulos/foo', null)
    expect(scrollToY).toHaveBeenLastCalledWith(540)
  })

  it('restore falls back to top when nothing was saved', () => {
    const policy = new ScrollPolicy(exec)
    policy.apply('restore', '/never-visited', null)
    expect(scrollToY).toHaveBeenLastCalledWith(0)
  })

  it('top scrolls to 0', () => {
    const policy = new ScrollPolicy(exec)
    policy.apply('top', '/', null)
    expect(scrollToY).toHaveBeenCalledWith(0)
  })

  it('hash delegates to the executor', () => {
    const policy = new ScrollPolicy(exec)
    policy.apply('hash', '/about', '#personal')
    expect(scrollToHash).toHaveBeenCalledWith('#personal')
    expect(scrollToY).not.toHaveBeenCalled()
  })

  it('hash falls back to top when the anchor is missing', () => {
    scrollToHash.mockReturnValue(false)
    const policy = new ScrollPolicy(exec)
    policy.apply('hash', '/about', '#ghost')
    expect(scrollToHash).toHaveBeenCalledWith('#ghost')
    expect(scrollToY).toHaveBeenLastCalledWith(0)
  })

  it('applies an explicit numeric target', () => {
    const policy = new ScrollPolicy(exec)
    policy.apply(320, '/', null)
    expect(scrollToY).toHaveBeenCalledWith(320)
  })
})

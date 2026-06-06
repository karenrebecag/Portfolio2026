import { describe, expect, it } from 'vitest'
import {
  NavigationOrchestrator,
  decideRevealMode,
  nextPhase,
  type NavEvent,
} from './orchestrator'
import type { NavPhase } from './types'

const navigate = (
  intent: 'push' | 'pop' | 'replace',
  reducedMotion = false,
): NavEvent => ({
  type: 'NAVIGATE',
  intent,
  from: '/',
  to: '/about',
  hash: null,
  reducedMotion,
})

describe('nextPhase', () => {
  it('boots to stable only from boot', () => {
    expect(nextPhase('boot', { type: 'BOOT_COMPLETE' })).toBe('stable')
    expect(nextPhase('stable', { type: 'BOOT_COMPLETE' })).toBeNull()
  })

  it('push leaves; pop skips straight to swapping', () => {
    expect(nextPhase('stable', navigate('push'))).toBe('leaving')
    expect(nextPhase('idle', navigate('push'))).toBe('leaving')
    expect(nextPhase('stable', navigate('pop'))).toBe('swapping')
  })

  it('rejects navigation while a transition is in flight', () => {
    const busy: NavPhase[] = ['leaving', 'swapping', 'entering', 'mounting']
    for (const phase of busy) {
      expect(nextPhase(phase, navigate('push'))).toBeNull()
    }
  })

  it('swap reveals (entering) forward, but mounts directly on pop/reduced', () => {
    const fwd = { intent: 'push' as const, reducedMotion: false, revealMode: 'animate' as const }
    expect(nextPhase('swapping', { type: 'DOM_SWAPPED' }, fwd)).toBe('entering')

    const pop = { intent: 'pop' as const, reducedMotion: false, revealMode: 'instant' as const }
    expect(nextPhase('swapping', { type: 'DOM_SWAPPED' }, pop)).toBe('mounting')

    const reduced = { intent: 'push' as const, reducedMotion: true, revealMode: 'animate' as const }
    expect(nextPhase('swapping', { type: 'DOM_SWAPPED' }, reduced)).toBe('mounting')
  })

  it('entering -> mounting -> stable -> idle', () => {
    expect(nextPhase('entering', { type: 'WIPE_ENTER_DONE' })).toBe('mounting')
    expect(nextPhase('mounting', { type: 'CONTROLLERS_READY' })).toBe('stable')
    expect(nextPhase('stable', { type: 'SETTLE' })).toBe('idle')
  })
})

describe('decideRevealMode', () => {
  it('animates forward, instant on back', () => {
    expect(decideRevealMode('push')).toBe('animate')
    expect(decideRevealMode('replace')).toBe('animate')
    expect(decideRevealMode('pop')).toBe('instant')
  })
})

describe('NavigationOrchestrator end-to-end', () => {
  it('runs a full forward push: stable -> leaving -> swapping -> entering -> mounting -> stable', () => {
    const o = new NavigationOrchestrator('boot')
    expect(o.dispatch({ type: 'BOOT_COMPLETE' })).toBe(true)
    expect(o.getSnapshot().phase).toBe('stable')

    o.dispatch(navigate('push'))
    expect(o.getSnapshot().phase).toBe('leaving')
    expect(o.getSnapshot().revealMode).toBe('animate')
    expect(o.getSnapshot().scrollY).toBe('top')

    o.dispatch({ type: 'WIPE_LEAVE_DONE' })
    expect(o.getSnapshot().phase).toBe('swapping')

    o.dispatch({ type: 'DOM_SWAPPED' })
    expect(o.getSnapshot().phase).toBe('entering')

    o.dispatch({ type: 'WIPE_ENTER_DONE' })
    expect(o.getSnapshot().phase).toBe('mounting')

    o.dispatch({ type: 'CONTROLLERS_READY' })
    expect(o.getSnapshot().phase).toBe('stable')
  })

  it('runs a back pop: stable -> swapping -> mounting -> stable, instant + restore', () => {
    const o = new NavigationOrchestrator('stable')
    o.dispatch({ type: 'NAVIGATE', intent: 'pop', from: '/about', to: '/', hash: null, reducedMotion: false })
    expect(o.getSnapshot().phase).toBe('swapping')
    expect(o.getSnapshot().revealMode).toBe('instant')
    expect(o.getSnapshot().scrollY).toBe('restore')

    o.dispatch({ type: 'DOM_SWAPPED' })
    expect(o.getSnapshot().phase).toBe('mounting')

    o.dispatch({ type: 'CONTROLLERS_READY' })
    expect(o.getSnapshot().phase).toBe('stable')
  })

  it('notifies subscribers on transition and ignores invalid events', () => {
    const o = new NavigationOrchestrator('boot')
    const seen: string[] = []
    const unsub = o.subscribe((s) => seen.push(s.phase))

    expect(o.dispatch({ type: 'WIPE_ENTER_DONE' })).toBe(false) // invalid from boot
    o.dispatch({ type: 'BOOT_COMPLETE' })
    o.dispatch(navigate('push'))
    unsub()
    o.dispatch({ type: 'WIPE_LEAVE_DONE' }) // not observed after unsub

    expect(seen).toEqual(['stable', 'leaving'])
  })

  it('carries the hash target through a navigation', () => {
    const o = new NavigationOrchestrator('stable')
    o.dispatch({ type: 'NAVIGATE', intent: 'push', from: '/', to: '/about', hash: '#personal', reducedMotion: false })
    expect(o.getSnapshot().scrollY).toBe('hash')
    expect(o.getSnapshot().hash).toBe('#personal')
  })
})

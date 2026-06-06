import { describe, expect, it } from 'vitest'
import { ControllerRegistry } from './controller-registry'
import type { ControllerContext } from './types'

const ctx: ControllerContext = {
  phase: 'mounting',
  intent: 'push',
  revealMode: 'animate',
  reducedMotion: false,
}

describe('ControllerRegistry ordering', () => {
  it('runs sync (priority asc) before async (priority asc)', () => {
    const r = new ControllerRegistry()
    r.register({ id: 'parallax', priority: 20, sync: true, mount: () => {} })
    r.register({ id: 'content-reveal', priority: 10, sync: true, mount: () => {} })
    r.register({ id: 'split-text', priority: 5, mount: () => {} })
    r.register({ id: 'rotating-text', priority: 8, mount: () => {} })

    expect(r.order().map((s) => s.id)).toEqual([
      'content-reveal', // sync p10
      'parallax', // sync p20
      'split-text', // async p5
      'rotating-text', // async p8
    ])
  })

  it('breaks priority ties by id for determinism', () => {
    const r = new ControllerRegistry()
    r.register({ id: 'b', mount: () => {} })
    r.register({ id: 'a', mount: () => {} })
    expect(r.order().map((s) => s.id)).toEqual(['a', 'b'])
  })
})

describe('ControllerRegistry mount lifecycle', () => {
  it('mounts in order and runs cleanups on unmountAll', async () => {
    const calls: string[] = []
    const r = new ControllerRegistry()
    r.register({
      id: 'first',
      priority: 1,
      sync: true,
      mount: () => {
        calls.push('mount:first')
        return () => calls.push('cleanup:first')
      },
    })
    r.register({
      id: 'second',
      priority: 2,
      mount: () => {
        calls.push('mount:second')
        return () => calls.push('cleanup:second')
      },
    })

    await r.mountAll(ctx)
    expect(calls).toEqual(['mount:first', 'mount:second'])

    r.unmountAll()
    expect(calls).toEqual([
      'mount:first',
      'mount:second',
      'cleanup:first',
      'cleanup:second',
    ])
  })

  it('unregister tears the controller down', () => {
    const calls: string[] = []
    const r = new ControllerRegistry()
    const dispose = r.register({
      id: 'x',
      mount: () => () => calls.push('cleanup:x'),
    })
    return r.mountAll(ctx).then(() => {
      dispose()
      expect(calls).toEqual(['cleanup:x'])
      expect(r.order()).toEqual([])
    })
  })
})

/**
 * Controller registry — one deterministic mount path for GSAP/ScrollTrigger
 * controllers. Replaces 15 components each listening to `page-navigation-complete`
 * on their own. Sync controllers (priority asc) run before async ones, so the
 * mount order is reproducible and testable.
 */

import type { ControllerContext } from './types'

export type ControllerCleanup = () => void

export type ControllerSpec = {
  id: string
  /** Lower runs first. Defaults to 0. */
  priority?: number
  /** Sync controllers mount (and finish) before any async controller starts. */
  sync?: boolean
  mount: (
    ctx: ControllerContext,
  ) => ControllerCleanup | void | Promise<ControllerCleanup | void>
}

function compare(a: ControllerSpec, b: ControllerSpec): number {
  const pa = a.priority ?? 0
  const pb = b.priority ?? 0
  if (pa !== pb) return pa - pb
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

export class ControllerRegistry {
  private specs = new Map<string, ControllerSpec>()
  private cleanups = new Map<string, ControllerCleanup>()

  register(spec: ControllerSpec): ControllerCleanup {
    this.specs.set(spec.id, spec)
    return () => this.unregister(spec.id)
  }

  unregister(id: string): void {
    this.runCleanup(id)
    this.specs.delete(id)
  }

  /** Deterministic order: sync first (priority asc, then id), then async. */
  order(): ControllerSpec[] {
    const all = [...this.specs.values()]
    const sync = all.filter((s) => s.sync).sort(compare)
    const async = all.filter((s) => !s.sync).sort(compare)
    return [...sync, ...async]
  }

  /** Tear down everything, then mount in order. Sync awaited before async. */
  async mountAll(ctx: ControllerContext): Promise<void> {
    this.unmountAll()
    for (const spec of this.order()) {
      const cleanup = await spec.mount(ctx)
      if (typeof cleanup === 'function') this.cleanups.set(spec.id, cleanup)
    }
  }

  unmountAll(): void {
    for (const id of [...this.cleanups.keys()]) this.runCleanup(id)
  }

  private runCleanup(id: string): void {
    const cleanup = this.cleanups.get(id)
    if (cleanup) {
      cleanup()
      this.cleanups.delete(id)
    }
  }
}

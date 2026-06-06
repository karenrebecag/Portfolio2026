/**
 * Scroll policy — pure decision + an executor-backed cache.
 *
 * The DECISION (which scroll target for an intent) is a pure function so it can
 * be unit-tested with no DOM. The EXECUTION is delegated to an injected
 * `ScrollExecutor`, so the same policy runs against Lenis in the browser and a
 * fake in tests. No module-level mutable state — the cache lives on the instance.
 */

import type { NavIntent, ScrollTarget } from './types'

export type ScrollExecutor = {
  getY(): number
  scrollToY(y: number): void
  /** Returns true if the hash target existed and was scrolled to. */
  scrollToHash(hash: string): boolean
}

/**
 * Forward (push/replace) always lands at top; back (pop) restores the saved
 * position; an explicit hash always wins. Restoration falls back to top when
 * nothing was saved (handled by ScrollPolicy.apply, not here).
 */
export function decideScroll(intent: NavIntent, hash: string | null): ScrollTarget {
  if (hash) return 'hash'
  if (intent === 'pop') return 'restore'
  return 'top'
}

export class ScrollPolicy {
  private cache = new Map<string, number>()

  constructor(private exec: ScrollExecutor) {}

  /** Snapshot the current scroll for a path before navigating away. */
  save(path: string): void {
    this.cache.set(path, this.exec.getY())
  }

  hasSaved(path: string): boolean {
    return this.cache.has(path)
  }

  getSaved(path: string): number | undefined {
    return this.cache.get(path)
  }

  /** Resolve a target to a concrete scroll action. */
  apply(target: ScrollTarget, path: string, hash: string | null): void {
    if (target === 'hash' && hash) {
      if (this.exec.scrollToHash(hash)) return
      this.exec.scrollToY(0)
      return
    }
    if (target === 'restore') {
      this.exec.scrollToY(this.cache.get(path) ?? 0)
      return
    }
    if (typeof target === 'number') {
      this.exec.scrollToY(target)
      return
    }
    // 'top' or unresolved 'hash'
    this.exec.scrollToY(0)
  }

  clear(): void {
    this.cache.clear()
  }
}

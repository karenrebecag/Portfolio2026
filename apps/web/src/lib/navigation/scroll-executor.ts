/**
 * Real ScrollExecutor backed by Lenis (browser-only). Injected into ScrollPolicy
 * so the policy logic stays pure and testable while this thin adapter does the
 * actual scrolling.
 */

import { getLenis, getScrollY } from '@/lib/lenis-scroll'
import type { ScrollExecutor } from '@/lib/navigation/scroll-policy'

export function createLenisScrollExecutor(): ScrollExecutor {
  return {
    getY: () => getScrollY(getLenis()),
    scrollToY: (y) => {
      window.scrollTo(0, y)
      getLenis()?.scrollTo(y, { immediate: true })
    },
    scrollToHash: (hash) => {
      const id = hash.replace(/^#/, '')
      if (!id) return false
      const target = document.getElementById(id)
      if (!target) return false
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(target, { immediate: true })
        return true
      }
      const y = target.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, y)
      return true
    },
  }
}

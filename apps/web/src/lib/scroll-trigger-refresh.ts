import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type ScrollLayoutSnapshot = {
  scrollHeight: number
  parallaxTriggerCount: number
}

let refreshRaf = 0
let lastRefreshAt = 0

export function captureScrollLayoutSnapshot(): ScrollLayoutSnapshot {
  return {
    scrollHeight: document.documentElement.scrollHeight,
    parallaxTriggerCount: document.querySelectorAll('[data-parallax="trigger"]').length,
  }
}

/** Refresh only when route/layout meaningfully changed (avoids full recalc every navigation). */
export function shouldRefreshScrollLayout(before: ScrollLayoutSnapshot, after: ScrollLayoutSnapshot): boolean {
  if (before.parallaxTriggerCount !== after.parallaxTriggerCount) return true
  return Math.abs(after.scrollHeight - before.scrollHeight) > 64
}

export function scheduleScrollTriggerRefresh(force = false) {
  cancelAnimationFrame(refreshRaf)
  refreshRaf = requestAnimationFrame(() => {
    const now = performance.now()
    if (!force && now - lastRefreshAt < 120) return
    lastRefreshAt = now
    ScrollTrigger.refresh(true)
  })
}
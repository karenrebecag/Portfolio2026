import { getLenis, getScrollY } from '@/lib/lenis-scroll'

export type NavigationIntent = 'push' | 'pop' | 'replace'

const scrollCache = new Map<string, number>()

let navigationIntent: NavigationIntent = 'push'

/** Osmo-style manual restoration — we own scroll on SPA navigations. */
export function initScrollSession(): () => void {
  if (typeof window === 'undefined') return () => {}

  history.scrollRestoration = 'manual'

  const onPopState = () => {
    navigationIntent = 'pop'
  }

  window.addEventListener('popstate', onPopState)
  return () => window.removeEventListener('popstate', onPopState)
}

export function markNavigationPush() {
  navigationIntent = 'push'
}

export function peekNavigationIntent(): NavigationIntent {
  return navigationIntent
}

export function consumeNavigationIntent(): NavigationIntent {
  const current = navigationIntent
  navigationIntent = 'push'
  return current
}

export function saveScrollForPath(pathname: string) {
  scrollCache.set(pathname, getScrollY(getLenis()))
}

export function getSavedScrollForPath(pathname: string): number | undefined {
  return scrollCache.get(pathname)
}

export function scrollToY(y: number) {
  window.scrollTo(0, y)
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(y, { immediate: true })
  }
}

export function scrollToTop() {
  scrollToY(0)
}

export function restoreScrollForPath(pathname: string): boolean {
  const saved = getSavedScrollForPath(pathname)
  if (saved == null) return false
  scrollToY(saved)
  return true
}

export function scrollToHash(hash: string, offset = 0) {
  if (!hash || hash === '#') return false

  const id = hash.replace(/^#/, '')
  const target = document.getElementById(id)
  if (!target) return false

  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset: -offset, immediate: true })
    return true
  }

  const y = target.getBoundingClientRect().top + window.scrollY - offset
  scrollToY(y)
  return true
}
import type { NavigationIntent } from '@/lib/scroll-session'

/** First visit: overlay finished. Controllers may init and play mount/reveal. */
export const PAGE_READY_EVENT = 'page-ready'

/**
 * Client navigations: new route DOM is committed; run controller setup synchronously
 * (useLayoutEffect) before the enter transition paints content.
 */
export const PAGE_MOUNT_EVENT = 'page-navigation-complete'

/** Hide GSAP targets (CSS) while route DOM swaps and controllers re-init. */
export function beginPageMount(intent: NavigationIntent = 'push') {
  document.body.setAttribute('data-page-mounting', '')
  document.body.setAttribute('data-nav-intent', intent)
}

export function completePageMount() {
  document.body.removeAttribute('data-page-mounting')
  document.body.removeAttribute('data-nav-intent')
}

export function isPopNavigation() {
  return document.body.getAttribute('data-nav-intent') === 'pop'
}

export function dispatchPageMount() {
  document.dispatchEvent(new CustomEvent(PAGE_MOUNT_EVENT))
}

export function markPageReady() {
  document.body.setAttribute('data-page-ready', '')
  document.dispatchEvent(new CustomEvent(PAGE_READY_EVENT))
}
/** First visit: overlay finished. Controllers may init and play mount/reveal. */
export const PAGE_READY_EVENT = 'page-ready'

/**
 * Client navigations: new route DOM is committed; run controller setup synchronously
 * (useLayoutEffect) before the enter transition paints content.
 */
export const PAGE_MOUNT_EVENT = 'page-navigation-complete'

export function dispatchPageMount() {
  document.dispatchEvent(new CustomEvent(PAGE_MOUNT_EVENT))
}

export function markPageReady() {
  document.body.setAttribute('data-page-ready', '')
  document.dispatchEvent(new CustomEvent(PAGE_READY_EVENT))
}
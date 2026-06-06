/**
 * Link interceptor — extracted from PageTransition's god effect.
 *
 * Pure DOM wiring with injected callbacks so the orchestrator owns the actual
 * navigation/timeline/scroll work. Not attached in PR1 (flag off); wired by the
 * NavigationProvider in a later PR.
 */

export type LinkInterceptorOptions = {
  /** Strip locale prefix / normalize a raw href to a logical path+hash. */
  resolveHref: (rawHref: string) => string
  /** Current logical pathname (no locale prefix). */
  currentPath: () => string
  /** True while a transition is mid-flight; clicks are ignored. */
  isAnimating: () => boolean
  /** Commit a navigation. `hash` is the in-page anchor or null. */
  onNavigate: (href: string, hash: string | null) => void
  /** Best-effort prefetch on hover. */
  onPrefetch?: (href: string, path: string) => void
}

function isInternalRouteHref(href: string): boolean {
  return !(
    href.startsWith('http') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
}

function eligibleLink(target: EventTarget | null): {
  link: HTMLAnchorElement
  rawHref: string
} | null {
  const el = target as HTMLElement | null
  const link = el?.closest('a')
  if (!link) return null
  const rawHref = link.getAttribute('href')
  if (!rawHref || !isInternalRouteHref(rawHref)) return null
  if (link.hasAttribute('data-no-transition')) return null
  return { link, rawHref }
}

export function attachLinkInterceptor(opts: LinkInterceptorOptions): () => void {
  const onPointerOver = (e: MouseEvent) => {
    const hit = eligibleLink(e.target)
    if (!hit) return
    const href = opts.resolveHref(hit.rawHref)
    const current = opts.currentPath()
    if (href === current || href.split('#')[0] === current) return
    const path = href.split('#')[0] || '/'
    opts.onPrefetch?.(href, path)
  }

  const onClick = (e: MouseEvent) => {
    const hit = eligibleLink(e.target)
    if (!hit) return
    const href = opts.resolveHref(hit.rawHref)
    const current = opts.currentPath()
    if (href === current || href.split('#')[0] === current) return
    if (opts.isAnimating()) return

    const hashIndex = href.indexOf('#')
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : null
    e.preventDefault()
    opts.onNavigate(href, hash)
  }

  document.addEventListener('mouseover', onPointerOver, true)
  document.addEventListener('click', onClick, true)
  return () => {
    document.removeEventListener('mouseover', onPointerOver, true)
    document.removeEventListener('click', onClick, true)
  }
}

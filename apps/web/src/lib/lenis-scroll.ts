import type Lenis from 'lenis'

export function getLenis(): Lenis | undefined {
  const lenis = (window as unknown as { lenis?: Lenis }).lenis
  if (lenis && typeof lenis.on === 'function') return lenis
  return undefined
}

/** Subscribe to Lenis scroll; retries until instance exists. Returns cleanup. */
export function subscribeLenisScroll(handler: (lenis: Lenis) => void): () => void {
  let bound = false
  let retryId: ReturnType<typeof setInterval> | null = null

  const bind = () => {
    const lenis = getLenis()
    if (!lenis || bound) return
    lenis.on('scroll', handler)
    bound = true
  }

  const unbind = () => {
    const lenis = getLenis()
    if (lenis && bound) lenis.off('scroll', handler)
    bound = false
  }

  bind()
  if (!bound) {
    retryId = setInterval(() => {
      bind()
      if (bound && retryId) {
        clearInterval(retryId)
        retryId = null
      }
    }, 50)
    setTimeout(() => {
      if (retryId) {
        clearInterval(retryId)
        retryId = null
      }
    }, 2000)
  }

  return () => {
    if (retryId) clearInterval(retryId)
    unbind()
  }
}

export function getScrollY(lenis?: Lenis): number {
  return lenis?.scroll ?? window.scrollY
}

/** Lenis-native: -1 up, 1 down, 0 idle. Fallback compares positions. */
export function isScrollingUp(lenis: Lenis | undefined, scrollY: number, lastScrollY: number): boolean {
  if (lenis) {
    if (lenis.direction === -1) return true
    if (lenis.direction === 1) return false
    return scrollY < lastScrollY - 2
  }
  return scrollY < lastScrollY - 2
}
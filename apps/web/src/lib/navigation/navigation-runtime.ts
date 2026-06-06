'use client'

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname, useRouter } from '@/i18n/navigation'
import { stripLocalePrefix } from '@/lib/i18n-href'
import { prefetchHeroForRoute } from '@/lib/hero-assets'
import {
  hideWipeLines,
  playWipeEnter,
  playWipeLeave,
  resetWipeColumns,
} from '@/lib/column-wipe'
import {
  beginPageMount,
  completePageMount,
  dispatchPageMount,
  markPageReady,
} from '@/lib/page-mount'
import { whenFontsReady } from '@/lib/fonts-ready'
import { ScrollPolicy } from '@/lib/navigation/scroll-policy'
import { createLenisScrollExecutor } from '@/lib/navigation/scroll-executor'
import { useNavigationOrchestrator } from '@/lib/navigation/navigation-context'
import type { NavIntent, NavPhase, ScrollTarget } from '@/lib/navigation/types'

gsap.registerPlugin(ScrollTrigger)

type LenisInstance = { stop: () => void; start: () => void; resize: () => void }

function getLenis(): LenisInstance | null {
  return (window as unknown as { lenis?: LenisInstance }).lenis ?? null
}

function setNavPhase(phase: NavPhase) {
  document.body.dataset.navPhase = phase
}

function isInternalRouteHref(href: string): boolean {
  return !(
    href.startsWith('http') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Resolve when fonts are ready, but never block the reveal past the timeout
 *  (document.fonts.ready always settles, but a hung load shouldn't stick the
 *  gate forever). */
function whenFontsReadyOrTimeout(ms = 2500): Promise<void> {
  return Promise.race([
    whenFontsReady(),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ])
}

type WipeSurface = {
  overlayRef: RefObject<HTMLDivElement | null>
  contentRef: RefObject<HTMLDivElement | null>
}

/**
 * Orchestrator-driven navigation. Active only when the flag is on (the shell
 * that calls this only renders then). Mirrors the legacy PageTransition
 * sequence but routes phases through the state machine and fixes two bugs:
 *  - pop/interrupted settles now force the wipe lines hidden (they linger at the
 *    CSS default 0.1 otherwise);
 *  - scroll restore is re-asserted after ScrollTrigger.refresh + lenis.resize,
 *    so long pages land at the right position instead of a clamped one.
 *
 * Reuses the existing body attributes (data-page-mounting / data-page-ready /
 * data-nav-intent) and events so the current controllers keep working untouched
 * until they migrate to the registry (PR4).
 */
export function useNavigationRuntime({ overlayRef, contentRef }: WipeSurface) {
  const pathname = usePathname()
  const router = useRouter()
  const orchestrator = useNavigationOrchestrator()

  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  const scrollRef = useRef<ScrollPolicy | null>(null)
  if (!scrollRef.current) scrollRef.current = new ScrollPolicy(createLenisScrollExecutor())

  const intentRef = useRef<NavIntent>('push')
  const isAnimating = useRef(false)
  const isFirstRender = useRef(true)
  const prevPathname = useRef(pathname)
  const pendingNavigation = useRef(false)
  const coverTimeline = useRef<gsap.core.Timeline | null>(null)
  const revealTimeline = useRef<gsap.core.Timeline | null>(null)
  const pendingHashRef = useRef<string | null>(null)
  const didScrollOnLeaveRef = useRef(false)

  const killCoverTimeline = () => {
    coverTimeline.current?.kill()
    coverTimeline.current = null
  }
  const killRevealTimeline = () => {
    revealTimeline.current?.kill()
    revealTimeline.current = null
  }

  /** Resolve the scroll target for this settle (mirrors decideScroll). */
  const settleTarget = (): ScrollTarget => {
    if (pendingHashRef.current) return 'hash'
    if (intentRef.current === 'pop') return 'restore'
    return 'top'
  }

  const applyScroll = (target: ScrollTarget, path: string) => {
    scrollRef.current?.apply(target, path, pendingHashRef.current)
  }

  const onPageReady = (path: string) => {
    const scroll = scrollRef.current
    const target = settleTarget()

    // Position before the browser paints (no flash on instant pop reveals).
    applyScroll(target, path)
    pendingHashRef.current = null
    didScrollOnLeaveRef.current = false
    intentRef.current = 'push'

    const lenis = getLenis()
    lenis?.resize()
    lenis?.start()
    ScrollTrigger.refresh()

    // Re-assert after layout settles — long pages clamp an early restore.
    if (target === 'restore' || target === 'top' || typeof target === 'number') {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scroll?.apply(target, path, null)),
      )
    }

    const overlay = overlayRef.current
    if (overlay) hideWipeLines(overlay)

    isAnimating.current = false
    pendingNavigation.current = false

    // Controllers init now; text/rotating defer to fonts internally.
    dispatchPageMount()

    // Hold the CSS gate + 'mounting' until fonts are ready so split headings
    // reveal coherently instead of popping in after the page already settled.
    // Warm (cached) fonts resolve instantly — no perceptible delay.
    whenFontsReadyOrTimeout().then(() => {
      orchestrator?.dispatch({ type: 'CONTROLLERS_READY' })
      setNavPhase('stable')
      completePageMount()
    })
  }

  const prepareForwardLeave = () => {
    scrollRef.current?.save(pathnameRef.current)
    scrollRef.current?.apply('top', pathnameRef.current, null)
    didScrollOnLeaveRef.current = true
  }

  // First visit — Osmo once: columns reset, page visible, no wipe.
  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) {
      markPageReady()
      orchestrator?.dispatch({ type: 'BOOT_COMPLETE' })
      setNavPhase('stable')
      return
    }

    resetWipeColumns(overlay)
    gsap.set(content, { autoAlpha: 1 })

    if (!prefersReducedMotion()) {
      const hash = window.location.hash
      if (hash) scrollRef.current?.apply('hash', pathnameRef.current, hash)
    }

    hideWipeLines(overlay)
    markPageReady()
    orchestrator?.dispatch({ type: 'BOOT_COMPLETE' })
    setNavPhase('stable')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Browser back/forward sets the pop intent for the next swap.
  useEffect(() => {
    const onPopState = () => {
      intentRef.current = 'pop'
      orchestrator?.dispatch({
        type: 'NAVIGATE',
        intent: 'pop',
        from: pathnameRef.current,
        to: pathnameRef.current,
        hash: null,
        reducedMotion: prefersReducedMotion(),
      })
      setNavPhase('swapping')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Enter — new route DOM committed.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevPathname.current = pathname
      return
    }
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    beginPageMount(intentRef.current)
    orchestrator?.dispatch({ type: 'DOM_SWAPPED' })

    const overlay = overlayRef.current
    const content = contentRef.current

    // Pop / no click-initiated wipe: reveal instantly, restore before paint.
    if (!pendingNavigation.current) {
      if (intentRef.current === 'pop') applyScroll('restore', pathname)
      if (overlay) {
        resetWipeColumns(overlay)
        hideWipeLines(overlay)
      }
      if (content) gsap.set(content, { autoAlpha: 1 })
      onPageReady(pathname)
      return
    }

    if (!overlay || !content) {
      onPageReady(pathname)
      return
    }

    killCoverTimeline()
    killRevealTimeline()
    setNavPhase('entering')

    if (prefersReducedMotion()) {
      resetWipeColumns(overlay)
      hideWipeLines(overlay)
      gsap.set(content, { autoAlpha: 1 })
      onPageReady(pathname)
      return
    }

    revealTimeline.current = playWipeEnter(overlay, content, () => {
      orchestrator?.dispatch({ type: 'WIPE_ENTER_DONE' })
      onPageReady(pathname)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Intercept internal links — leave wipe then push.
  useEffect(() => {
    const prefetchHref = (href: string) => {
      try {
        router.prefetch(href)
      } catch {
        // best-effort
      }
    }

    const eligible = (target: EventTarget | null) => {
      const link = (target as HTMLElement | null)?.closest('a')
      if (!link) return null
      const rawHref = link.getAttribute('href')
      if (!rawHref || !isInternalRouteHref(rawHref)) return null
      if (link.hasAttribute('data-no-transition')) return null
      const href = stripLocalePrefix(rawHref)
      const current = pathnameRef.current
      if (href === current || href.split('#')[0] === current) return null
      return href
    }

    const handlePointerOver = (e: MouseEvent) => {
      const href = eligible(e.target)
      if (!href) return
      prefetchHref(href)
      prefetchHeroForRoute(href.split('#')[0] || '/')
    }

    const handleClick = (e: MouseEvent) => {
      const href = eligible(e.target)
      if (!href) return
      if (isAnimating.current) return

      const hashIndex = href.indexOf('#')
      intentRef.current = 'push'
      pendingHashRef.current = hashIndex >= 0 ? href.slice(hashIndex) : null

      orchestrator?.dispatch({
        type: 'NAVIGATE',
        intent: 'push',
        from: pathnameRef.current,
        to: href.split('#')[0] || '/',
        hash: pendingHashRef.current,
        reducedMotion: prefersReducedMotion(),
      })
      setNavPhase('leaving')

      const overlay = overlayRef.current
      const content = contentRef.current
      if (!overlay || !content) {
        pendingNavigation.current = true
        router.push(href)
        return
      }

      e.preventDefault()
      isAnimating.current = true
      pendingNavigation.current = true
      killCoverTimeline()
      killRevealTimeline()
      prefetchHref(href)

      if (prefersReducedMotion()) {
        prepareForwardLeave()
        router.push(href)
        return
      }

      getLenis()?.stop()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

      coverTimeline.current = playWipeLeave(overlay, () => {
        orchestrator?.dispatch({ type: 'WIPE_LEAVE_DONE' })
        setNavPhase('swapping')
        prepareForwardLeave()
        gsap.set(content, { autoAlpha: 0 })
        router.push(href)
      })
    }

    document.addEventListener('mouseover', handlePointerOver, true)
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('mouseover', handlePointerOver, true)
      document.removeEventListener('click', handleClick, true)
      killCoverTimeline()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])
}

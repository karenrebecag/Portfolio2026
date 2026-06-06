'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { stripLocalePrefix } from '@/lib/i18n-href'
import { prefetchHeroForRoute } from '@/lib/hero-assets'
import {
  COLUMN_WIPE,
  playWipeEnter,
  playWipeLeave,
  resetWipeColumns,
} from '@/lib/column-wipe'
import { beginPageMount, completePageMount, dispatchPageMount, markPageReady } from '@/lib/page-mount'
import {
  consumeNavigationIntent,
  initScrollSession,
  markNavigationPush,
  peekNavigationIntent,
  restoreScrollForPath,
  saveScrollForPath,
  scrollToHash,
  scrollToTop,
} from '@/lib/scroll-session'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type LenisInstance = { stop: () => void; start: () => void; resize: () => void }

function getLenis(): LenisInstance | null {
  return (window as unknown as { lenis?: LenisInstance }).lenis ?? null
}

function isInternalRouteHref(href: string): boolean {
  if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false
  }
  return true
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const isFirstRender = useRef(true)
  const prevPathname = useRef(pathname)
  const pendingNavigation = useRef(false)
  const coverTimeline = useRef<gsap.core.Timeline | null>(null)
  const revealTimeline = useRef<gsap.core.Timeline | null>(null)
  const didScrollOnLeaveRef = useRef(false)
  const pendingHashRef = useRef<string | null>(null)

  const killCoverTimeline = () => {
    coverTimeline.current?.kill()
    coverTimeline.current = null
  }

  const killRevealTimeline = () => {
    revealTimeline.current?.kill()
    revealTimeline.current = null
  }

  const settleScroll = (pathname: string) => {
    const hash = pendingHashRef.current
    if (hash) {
      pendingHashRef.current = null
      scrollToHash(hash)
      return
    }

    const navIntent = consumeNavigationIntent()
    if (navIntent === 'pop') {
      restoreScrollForPath(pathname)
      return
    }

    if (!didScrollOnLeaveRef.current) {
      scrollToTop()
    }
    didScrollOnLeaveRef.current = false
  }

  const onPageReady = () => {
    settleScroll(pathnameRef.current)
    const lenis = getLenis()
    lenis?.resize()
    lenis?.start()
    ScrollTrigger.refresh()
    isAnimating.current = false
    pendingNavigation.current = false
    dispatchPageMount()
    completePageMount()
  }

  const prepareForwardLeave = () => {
    saveScrollForPath(pathnameRef.current)
    scrollToTop()
    didScrollOnLeaveRef.current = true
  }

  // First visit — Osmo once: reset columns, page visible (no column animation)
  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) {
      markPageReady()
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resetWipeColumns(overlay)
    gsap.set(content, { autoAlpha: 1 })

    if (reducedMotion) {
      markPageReady()
      return
    }

    const hash = window.location.hash
    if (hash) {
      scrollToHash(hash)
    }

    markPageReady()
  }, [])

  useEffect(() => initScrollSession(), [])

  // Enter — after leave + navigation, columns at 100 → 200
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevPathname.current = pathname
      return
    }

    if (pathname === prevPathname.current) return

    beginPageMount(peekNavigationIntent())

    if (!pendingNavigation.current && peekNavigationIntent() === 'pop') {
      restoreScrollForPath(pathname)
    }

    prevPathname.current = pathname

    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) {
      onPageReady()
      return
    }

    if (!pendingNavigation.current) {
      onPageReady()
      return
    }

    killCoverTimeline()
    killRevealTimeline()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      resetWipeColumns(overlay)
      gsap.set(content, { autoAlpha: 1 })
      onPageReady()
      return
    }

    const tl = playWipeEnter(overlay, content, onPageReady)
    revealTimeline.current = tl
  }, [pathname])

  // Intercept internal links — stable effect
  useEffect(() => {
    function prefetchHref(href: string) {
      try {
        router.prefetch(href)
      } catch {
        // prefetch is best-effort
      }
    }

    function resolveHref(rawHref: string) {
      return stripLocalePrefix(rawHref)
    }

    function handlePointerOver(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      const rawHref = link.getAttribute('href')
      if (!rawHref || !isInternalRouteHref(rawHref)) return
      if (link.hasAttribute('data-no-transition')) return
      const href = resolveHref(rawHref)
      const current = pathnameRef.current
      if (href === current || href.split('#')[0] === current) return
      const path = href.split('#')[0] || '/'
      prefetchHref(href)
      prefetchHeroForRoute(path)
    }

    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      const rawHref = link.getAttribute('href')
      if (!rawHref || !isInternalRouteHref(rawHref)) return
      if (link.hasAttribute('data-no-transition')) return
      const href = resolveHref(rawHref)
      const current = pathnameRef.current
      if (href === current || href.split('#')[0] === current) return
      if (isAnimating.current) return

      const hashIndex = href.indexOf('#')
      markNavigationPush()
      pendingHashRef.current = hashIndex >= 0 ? href.slice(hashIndex) : null

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

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        prepareForwardLeave()
        router.push(href)
        return
      }

      getLenis()?.stop()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

      const tl = playWipeLeave(overlay, () => {
        prepareForwardLeave()
        gsap.set(content, { autoAlpha: 0 })
        router.push(href)
      })
      coverTimeline.current = tl
    }

    document.addEventListener('mouseover', handlePointerOver, true)
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('mouseover', handlePointerOver, true)
      document.removeEventListener('click', handleClick, true)
      killCoverTimeline()
    }
  }, [router])

  return (
    <>
      <div ref={overlayRef} data-transition-wrap className="transition">
        <div className="transition__panels">
          {Array.from({ length: COLUMN_WIPE.panelCount }, (_, i) => (
            <div key={i} data-transition-column className="transition__panel bg-surface" />
          ))}
        </div>
        <div className="transition__lines">
          {Array.from({ length: COLUMN_WIPE.panelCount }, (_, i) => (
            <div key={i} className={`transition__line${i === COLUMN_WIPE.panelCount - 1 ? ' is--last' : ''}`} />
          ))}
        </div>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  )
}
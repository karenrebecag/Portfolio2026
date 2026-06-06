'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { stripLocalePrefix } from '@/lib/i18n-href'
import { prefetchHeroForRoute } from '@/lib/hero-assets'
import { dispatchPageMount } from '@/lib/page-mount'
import gsap from 'gsap'

/** Visual timing — tuned for ~1.1–1.4s total perceived transition (plus network). */
const LEAVE = {
  panel: 0.55,
  content: 0.55,
  label: 0.28,
  loader: 0.7,
  /** Start RSC fetch while the wipe is still running (was: after full 1.6s leave). */
  navigateAt: 0.18,
} as const

const ENTER = {
  delay: 0.12,
  panel: 0.55,
  content: 0.55,
  label: 0.22,
} as const

function getPageName(href: string): string {
  const path = stripLocalePrefix(href).split('#')[0] || '/'
  if (path === '/' || path === '') return 'Home'
  const segments = path.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ')
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
  const t = useTranslations('page_transition')
  const contentRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const labelTextRef = useRef<HTMLSpanElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const isFirstRender = useRef(true)
  const prevPathname = useRef(pathname)
  const pendingNavigation = useRef(false)
  const activeTimeline = useRef<gsap.core.Timeline | null>(null)

  const killActiveTimeline = () => {
    activeTimeline.current?.kill()
    activeTimeline.current = null
  }

  const finishTransition = () => {
    const content = contentRef.current
    const panel = panelRef.current
    const loader = loaderRef.current

    gsap.set(content, { clearProps: 'all', autoAlpha: 1 })
    gsap.set(panel, { autoAlpha: 0, yPercent: 0 })
    if (loader) gsap.set(loader, { scaleX: 0 })
    isAnimating.current = false
    pendingNavigation.current = false
    dispatchPageMount()
  }

  // Enter — layout effect: mount controllers before paint, then play enter tween
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevPathname.current = pathname
      return
    }

    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    if (!pendingNavigation.current) {
      isAnimating.current = false
      dispatchPageMount()
      return
    }

    const content = contentRef.current
    const panel = panelRef.current
    const label = labelRef.current
    if (!content || !panel || !label) {
      finishTransition()
      return
    }

    window.scrollTo(0, 0)
    killActiveTimeline()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loader = loaderRef.current

    if (reducedMotion) {
      finishTransition()
      return
    }

    // Mount flow: controllers apply GSAP initial state before this paint.
    dispatchPageMount()

    gsap.set(content, { autoAlpha: 0, y: '12vh' })
    gsap.set(panel, { autoAlpha: 1, yPercent: -100 })
    if (loader) gsap.set(loader, { scaleX: 1, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false
        pendingNavigation.current = false
        const loaderEl = loaderRef.current
        gsap.set(content, { clearProps: 'all', autoAlpha: 1 })
        gsap.set(panel, { autoAlpha: 0, yPercent: 0 })
        if (loaderEl) gsap.set(loaderEl, { scaleX: 0 })
      },
    })
    activeTimeline.current = tl

    tl.add('startEnter', ENTER.delay)

    tl.set(content, { autoAlpha: 1 }, 'startEnter')

    tl.fromTo(
      panel,
      { yPercent: -100 },
      { yPercent: -200, duration: ENTER.panel, ease: 'power3.inOut', overwrite: 'auto', immediateRender: false },
      'startEnter',
    )

    tl.fromTo(
      label,
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: ENTER.label, overwrite: 'auto', immediateRender: false },
      'startEnter+=0.06',
    )

    if (loader) {
      tl.to(loader, { scaleX: 0, duration: ENTER.panel * 0.6, ease: 'power2.in' }, 'startEnter')
    }

    tl.to(content, { y: 0, duration: ENTER.content, ease: 'power3.inOut' }, 'startEnter')
  }, [pathname])

  // Intercept internal links + prefetch on hover
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
      if (href === pathname || href.split('#')[0] === pathname) return
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
      if (href === pathname || href.split('#')[0] === pathname) return
      if (isAnimating.current) return

      e.preventDefault()
      isAnimating.current = true
      pendingNavigation.current = true
      killActiveTimeline()

      const content = contentRef.current
      const panel = panelRef.current
      const label = labelRef.current
      const labelText = labelTextRef.current
      if (!content || !panel || !label || !labelText) {
        pendingNavigation.current = true
        router.push(href)
        return
      }

      labelText.innerText = getPageName(href)
      prefetchHref(href)

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        pendingNavigation.current = true
        router.push(href)
        return
      }

      const loader = loaderRef.current
      const tl = gsap.timeline()
      activeTimeline.current = tl

      tl.set(panel, { autoAlpha: 1, yPercent: 0 }, 0)
      if (loader) tl.set(loader, { scaleX: 0, transformOrigin: 'left center' }, 0)

      tl.fromTo(panel, { yPercent: 0 }, { yPercent: -100, duration: LEAVE.panel, ease: 'power3.inOut' }, 0)

      tl.fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: LEAVE.label }, '<+=0.12')

      if (loader) {
        tl.to(loader, { scaleX: 1, duration: LEAVE.loader, ease: 'power1.inOut' }, 0.22)
      }

      tl.fromTo(content, { y: '0vh' }, { y: '-12vh', duration: LEAVE.content, ease: 'power3.inOut' }, 0)

      tl.call(
        () => {
          gsap.set(content, { autoAlpha: 0, clearProps: 'y' })
          router.push(href)
        },
        [],
        LEAVE.navigateAt,
      )
    }

    document.addEventListener('mouseover', handlePointerOver, true)
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('mouseover', handlePointerOver, true)
      document.removeEventListener('click', handleClick, true)
      killActiveTimeline()
    }
  }, [pathname, router])

  return (
    <>
      <div className="page-transition">
        <div ref={panelRef} className="page-transition__panel">
          <div className="page-transition__content">
            <span ref={labelRef} className="page-transition__label">
              <span>[ </span>
              <span ref={labelTextRef}>{t('welcome')}</span>
              <span> ]</span>
            </span>
            <div className="page-transition__loader">
              <div ref={loaderRef} className="page-transition__loader-bar" />
            </div>
          </div>
        </div>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  )
}
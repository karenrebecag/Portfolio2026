'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

const DURATION = 1.2
const PARALLAX_EASE = 'power3.inOut'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const snapshotRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const prevPathname = useRef(pathname)
  const isAnimating = useRef(false)

  const captureSnapshot = useCallback(() => {
    const content = contentRef.current
    const snapshot = snapshotRef.current
    if (!content || !snapshot || isAnimating.current) return

    // Clone current visible content into snapshot
    snapshot.innerHTML = content.innerHTML
    snapshot.style.cssText = `
      position: fixed; top: ${-window.scrollY}px; left: 0; right: 0;
      z-index: 1; pointer-events: none; display: block;
      background: var(--background);
    `
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevPathname.current = pathname
      return
    }

    if (pathname === prevPathname.current) return
    if (isAnimating.current) return

    prevPathname.current = pathname
    isAnimating.current = true

    const content = contentRef.current
    const snapshot = snapshotRef.current
    const dark = darkRef.current
    const wrap = wrapRef.current

    if (!content || !snapshot || !dark || !wrap) {
      isAnimating.current = false
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Only scroll to top when navigating to a subpage, not back to home
    const isNavigatingToSubpage = pathname.includes('/projects/')
    const savedScrollY = isNavigatingToSubpage ? 0 : window.scrollY

    if (prefersReduced) {
      if (isNavigatingToSubpage) window.scrollTo(0, 0)
      snapshot.style.display = 'none'
      snapshot.innerHTML = ''
      isAnimating.current = false
      document.dispatchEvent(new CustomEvent('page-navigation-complete'))
      return
    }

    if (isNavigatingToSubpage) window.scrollTo(0, 0)

    // -- LEAVE: snapshot (old page) moves up + dark overlay --
    // Transition wrap at z-index 2 (between snapshot z1 and content z3)
    gsap.set(wrap, { zIndex: 2 })
    gsap.set(dark, { autoAlpha: 0 })

    // New content starts at 100vh below, z-index 3 (on top of everything)
    // Background ensures no gap visible during slide
    gsap.set(content, {
      y: '100vh', position: 'relative', zIndex: 3,
      backgroundColor: 'var(--background)',
    })

    const tl = gsap.timeline({
      onComplete: () => {
        snapshot.style.display = 'none'
        snapshot.innerHTML = ''
        gsap.set(content, { clearProps: 'all' })
        gsap.set(dark, { autoAlpha: 0 })
        gsap.set(wrap, { clearProps: 'zIndex' })

        // Restore scroll for back navigation
        if (!isNavigatingToSubpage) {
          window.scrollTo(0, savedScrollY)
        }

        isAnimating.current = false

        // Re-init animations for new page content
        document.dispatchEvent(new CustomEvent('page-navigation-complete'))
      },
    })

    // Old page (snapshot): parallax up at slower rate
    tl.fromTo(snapshot,
      { y: 0 },
      { y: '-25vh', duration: DURATION, ease: PARALLAX_EASE },
      0,
    )

    // Dark overlay fades in over old page
    tl.fromTo(dark,
      { autoAlpha: 0 },
      { autoAlpha: 0.8, duration: DURATION, ease: PARALLAX_EASE },
      0,
    )

    // New page (content): slides up from 100vh to 0
    tl.fromTo(content,
      { y: '100vh' },
      { y: '0vh', duration: DURATION, ease: PARALLAX_EASE, clearProps: 'all' },
      0,
    )

    // Reset dark at end
    tl.set(dark, { autoAlpha: 0 })
  }, [pathname])

  // Capture snapshot on internal link click before Next.js navigates
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href) return
      // Skip external, anchor, mailto, tel links
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      captureSnapshot()
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [captureSnapshot])

  return (
    <>
      {/* Transition wrap with dark overlay -- z-index 2 during transition */}
      <div ref={wrapRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div ref={darkRef} style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0 }} />
      </div>
      {/* Snapshot of previous page -- z-index 1 */}
      <div ref={snapshotRef} style={{ display: 'none' }} />
      {/* Current page content -- z-index 3 during transition */}
      <div ref={contentRef}>{children}</div>
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'
import { stripLocalePrefix } from '@/lib/i18n-href'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.165,
      wheelMultiplier: 1.25,
    })
    lenisRef.current = lenis
    // Expose globally so data-attr components (TOC, etc.) can use it for smooth scroll
    ;(window as any).lenis = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    // Anchor scroll-to with easing (Lenis pattern for in-page # anchors).
    // Supports pure "#contact", "/#projects", and locale-prefixed variants when
    // they target the current page. Cross-page hashes (e.g. /#contact while on /about)
    // are left for the navigation runtime + page transition.
    function handleHashClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      const rawHref = anchor.getAttribute('href')
      if (!rawHref || !rawHref.includes('#')) return

      const stripped = stripLocalePrefix(rawHref)
      const hashIndex = stripped.indexOf('#')
      if (hashIndex < 0) return
      const hash = stripped.slice(hashIndex)
      if (!hash || hash === '#') return

      // Same-page anchor? (pure # or path part matches current logical path after locale strip)
      const currentPathname = window.location.pathname
      const currentStripped = stripLocalePrefix(currentPathname)
      const linkPathPart = stripped.slice(0, hashIndex) || '/'
      const normalizedLinkPath = linkPathPart === '' ? '/' : linkPathPart
      const isPureHash = rawHref.startsWith('#')
      const isSamePageAnchor = isPureHash || normalizedLinkPath === currentStripped

      if (!isSamePageAnchor) return

      e.preventDefault()
      const id = hash.replace(/^#/, '')
      const targetEl = id ? document.getElementById(id) : null
      const scrollTarget = targetEl || hash
      lenis.scrollTo(scrollTarget, {
        easing: (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
        duration: 1.2,
        offset: 0,
      })
    }

    document.addEventListener('click', handleHashClick)

    const initialHash = window.location.hash
    if (initialHash && initialHash !== '#') {
      requestAnimationFrame(() => {
        const target = document.getElementById(initialHash.replace(/^#/, ''))
        if (target) lenis.scrollTo(target, { immediate: true })
      })
    }

    return () => {
      document.removeEventListener('click', handleHashClick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

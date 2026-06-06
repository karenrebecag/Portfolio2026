'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

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

    // Anchor scroll-to with easing
    function handleHashClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      e.preventDefault()
      lenis.scrollTo(hash, {
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

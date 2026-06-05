'use client'

import { useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import {
  captureScrollLayoutSnapshot,
  scheduleScrollTriggerRefresh,
  shouldRefreshScrollLayout,
} from '@/lib/scroll-trigger-refresh'

gsap.registerPlugin(ScrollTrigger)

function initParallax() {
  const layoutBefore = captureScrollLayoutSnapshot()
  const mm = gsap.matchMedia()
  mm.add(
    { isMobile: '(max-width:479px)', isMobileLandscape: '(max-width:767px)', isTablet: '(max-width:991px)', isDesktop: '(min-width:992px)' },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions!
      const ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>('[data-parallax="trigger"]').forEach((trigger) => {
          const disable = trigger.getAttribute('data-parallax-disable')
          if ((disable === 'mobile' && isMobile) || (disable === 'mobileLandscape' && isMobileLandscape) || (disable === 'tablet' && isTablet)) return
          const target = trigger.querySelector('[data-parallax="target"]') || trigger
          const direction = trigger.getAttribute('data-parallax-direction') || 'vertical'
          const prop = direction === 'horizontal' ? 'xPercent' : 'yPercent'
          const scrubAttr = trigger.getAttribute('data-parallax-scrub')
          const scrub = scrubAttr ? parseFloat(scrubAttr) : true
          const startVal = parseFloat(trigger.getAttribute('data-parallax-start') || '20')
          const endVal = parseFloat(trigger.getAttribute('data-parallax-end') || '-20')
          const scrollStart = `clamp(${trigger.getAttribute('data-parallax-scroll-start') || 'top bottom'})`
          const scrollEnd = `clamp(${trigger.getAttribute('data-parallax-scroll-end') || 'bottom top'})`
          gsap.fromTo(target, { [prop]: startVal }, { [prop]: endVal, ease: 'none', scrollTrigger: { trigger, start: scrollStart, end: scrollEnd, scrub } })
        })
        const layoutAfter = captureScrollLayoutSnapshot()
        if (shouldRefreshScrollLayout(layoutBefore, layoutAfter)) {
          scheduleScrollTriggerRefresh()
        }
      })
      return () => ctx.revert()
    },
  )
  return () => mm.revert()
}

function initFooterParallax() {
  const triggers: ScrollTrigger[] = []
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  document.querySelectorAll<HTMLElement>('[data-footer-parallax]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('[data-footer-parallax-inner]')
    const dark = el.querySelector<HTMLElement>('[data-footer-parallax-dark]')

    if (prefersReduced) {
      if (inner) gsap.set(inner, { yPercent: 0, clearProps: 'transform' })
      if (dark) gsap.set(dark, { opacity: 0, clearProps: 'opacity' })
      return
    }

    // fromTo: at scroll progress 0 the footer sits below (yPercent > 0), not pulled up.
    // `from({ yPercent: -25 })` left the footer shifted up whenever progress === 0
    // (page load, bottom of page, after navigation) — overlapping contact + grid.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'clamp(top bottom)',
        end: 'clamp(top top)',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    if (inner) {
      tl.fromTo(inner, { yPercent: 24 }, { yPercent: 0, ease: 'none' })
    }

    if (dark) {
      tl.fromTo(dark, { opacity: 1 }, { opacity: 0, ease: 'none' }, '<')
    }

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
  })

  scheduleScrollTriggerRefresh(true)

  return () => triggers.forEach((t) => t.kill())
}

export function ParallaxProvider({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => {
    const cleanupParallax = initParallax()
    const cleanupFooter = initFooterParallax()
    return () => {
      cleanupParallax()
      cleanupFooter()
    }
  }, []))
  return <>{children}</>
}

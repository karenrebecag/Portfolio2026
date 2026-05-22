'use client'

import { useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'

gsap.registerPlugin(ScrollTrigger)

function initParallax() {
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
      })
      return () => ctx.revert()
    },
  )
  return () => mm.revert()
}

function initFooterParallax() {
  const triggers: ScrollTrigger[] = []

  document.querySelectorAll<HTMLElement>('[data-footer-parallax]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('[data-footer-parallax-inner]')
    const dark = el.querySelector<HTMLElement>('[data-footer-parallax-dark]')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'clamp(top bottom)',
        end: 'clamp(top top)',
        scrub: true,
      },
    })

    if (inner) {
      tl.from(inner, { yPercent: -25, ease: 'linear' })
    }

    if (dark) {
      tl.from(dark, { opacity: 0.5, ease: 'linear' }, '<')
    }

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
  })

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

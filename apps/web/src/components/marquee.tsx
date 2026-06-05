'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

const PIXELS_PER_SECOND = 60

export function Marquee() {
  const t = useTranslations('marquee')
  const services = t('services').split(', ')
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)

  // Hide on scroll down, reveal on scroll up. Plain listener, no ScrollTrigger.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let lastScrollY = 0
    let isVisible = true

    function handleScroll() {
      const scrollY = window.scrollY
      const shouldShow = scrollY <= 10 || scrollY < lastScrollY
      if (shouldShow !== isVisible) {
        isVisible = shouldShow
        wrap!.style.transform = shouldShow ? 'translateY(0)' : 'translateY(-100%)'
      }
      lastScrollY = scrollY
    }

    type LenisInstance = { on: (e: string, fn: () => void) => void; off: (e: string, fn: () => void) => void }
    const lenis = (window as unknown as { lenis?: LenisInstance }).lenis

    window.addEventListener('scroll', handleScroll, { passive: true })
    lenis?.on('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      lenis?.off('scroll', handleScroll)
    }
  }, [])

  // Pure-CSS marquee: clone the group until the rail spans >2x the viewport so
  // the right edge never runs dry, then drive a CSS keyframe by exactly one
  // group width. No GSAP, no ScrollTrigger, no refresh reanchoring.
  useEffect(() => {
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group) return

    function build() {
      track!.querySelectorAll('[data-marquee-clone]').forEach((n) => n.remove())

      const groupWidth = group!.offsetWidth || 1
      const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / groupWidth))

      for (let i = 1; i < copies; i++) {
        const clone = group!.cloneNode(true) as HTMLElement
        clone.setAttribute('data-marquee-clone', '')
        clone.setAttribute('aria-hidden', 'true')
        track!.appendChild(clone)
      }

      track!.style.setProperty('--marquee-duration', `${groupWidth / PIXELS_PER_SECOND}s`)
      track!.style.setProperty('--marquee-shift', `-${groupWidth}px`)
    }

    build()

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      track!.querySelectorAll('[data-marquee-clone]').forEach((n) => n.remove())
    }
  }, [services.join('|')])

  return (
    <div
      ref={wrapRef}
      className="fixed top-0 left-0 right-0 z-[99] transition-transform duration-300 ease-out"
    >
      <div
        data-css-marquee
        className="marquee-css w-full overflow-hidden bg-primary text-primary-foreground"
      >
        <div ref={trackRef} className="marquee-rail">
          <div ref={groupRef} className="marquee-advanced__item flex items-center flex-none">
            {services.map((service) => (
              <div key={service} className="flex items-center gap-3 flex-none py-2 pr-3">
                <p className="marquee__advanced__p whitespace-nowrap text-xs font-semibold tracking-wide font-display m-0">
                  {service}
                </p>
                <span className="w-1 h-1 rounded-full bg-current shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

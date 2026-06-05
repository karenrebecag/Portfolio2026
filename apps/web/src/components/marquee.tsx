'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

function MarqueeServices({ services }: { services: string[] }) {
  return (
    <div className="marquee-advanced__item flex items-center flex-none">
      {services.map((service) => (
        <div key={service} className="flex items-center gap-3 flex-none py-2 pr-3">
          <p className="marquee__advanced__p whitespace-nowrap text-xs font-semibold tracking-wide font-display m-0">
            {service}
          </p>
          <span className="w-1 h-1 rounded-full bg-current shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function Marquee() {
  const t = useTranslations('marquee')
  const services = t('services').split(', ')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let lastScrollY = 0
    let isVisible = true

    function handleScroll() {
      const scrollY = window.scrollY
      const atTop = scrollY <= 10
      const scrollingUp = scrollY < lastScrollY
      const shouldShow = atTop || scrollingUp

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

  return (
    <div
      ref={wrapRef}
      className="fixed top-0 left-0 right-0 z-[99] transition-transform duration-300 ease-out"
    >
      <div
        data-marquee-scroll-direction-target=""
        data-marquee-duplicate="1"
        data-marquee-direction="left"
        data-marquee-status="normal"
        data-marquee-speed="15"
        data-marquee-scroll-speed="0"
        data-css-marquee
        className="marquee-advanced w-full overflow-hidden bg-primary text-primary-foreground"
      >
        <div data-marquee-scroll-target="" className="marquee-advanced__scroll flex w-full relative will-change-transform">
          <div data-marquee-collection-target="" className="marquee-advanced__collection flex relative will-change-transform">
            <MarqueeServices services={services} />
          </div>
        </div>
      </div>
    </div>
  )
}
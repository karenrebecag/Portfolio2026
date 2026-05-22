'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

function MarqueeList({ services }: { services: string[] }) {
  return (
    <div data-css-marquee-list className="flex items-center flex-none">
      {services.map((service) => (
        <div key={service} className="flex items-center gap-3 flex-none py-2 pr-3">
          <p className="whitespace-nowrap text-xs font-semibold tracking-wide font-display">{service}</p>
          <span className="w-1 h-1 rounded-full bg-current shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function Marquee() {
  const t = useTranslations('marquee')
  const services = t('services').split(', ')
  const ref = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    const wrap = wrapRef.current
    if (!container || !wrap) return

    let lastScrollY = 0
    let isVisible = true

    function init() {
      if (!container) return
      const pixelsPerSecond = 75
      const lists = container.querySelectorAll<HTMLElement>('[data-css-marquee-list]')

      lists.forEach((list) => {
        const clone = list.cloneNode(true) as HTMLElement
        container.appendChild(clone)
      })

      const allLists = container.querySelectorAll<HTMLElement>('[data-css-marquee-list]')

      allLists.forEach((list) => {
        list.style.animationDuration = `${list.offsetWidth / pixelsPerSecond}s`
        list.style.animationPlayState = 'running'
      })
    }

    function handleScroll() {
      if (!wrap) return
      const scrollY = window.scrollY
      const atTop = scrollY <= 10
      const scrollingUp = scrollY < lastScrollY

      const shouldShow = atTop || scrollingUp

      if (shouldShow !== isVisible) {
        isVisible = shouldShow
        wrap.style.transform = shouldShow ? 'translateY(0)' : 'translateY(-100%)'
      }

      lastScrollY = scrollY
    }

    if (document.body.hasAttribute('data-page-ready')) {
      init()
    } else {
      document.addEventListener('page-ready', init, { once: true })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    function onNavigate() { init() }
    document.addEventListener('page-navigation-complete', onNavigate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('page-ready', init)
      document.removeEventListener('page-navigation-complete', onNavigate)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="fixed top-0 left-0 right-0 z-[99] transition-transform duration-300 ease-out"
    >
      <div
        ref={ref}
        data-css-marquee
        className="w-full flex overflow-hidden bg-primary text-primary-foreground"
      >
        <MarqueeList services={services} />
      </div>
    </div>
  )
}

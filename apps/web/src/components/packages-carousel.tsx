'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import { NumberOdometer } from '@/components/number-odometer'
import type { ProposalPackageView } from '@/content/proposals'
import styles from './packages-carousel.module.css'

gsap.registerPlugin(ScrollTrigger)

type PackagesCarouselProps = {
  packages: ProposalPackageView[]
  featuredLabel: string
  className?: string
}

const MOBILE_QUERY = '(min-width: 520px) and (max-width: 1199px)'

/**
 * Carrusel horizontal pinned de pricing cards (port de MWG 087). Es la mitad
 * < 1200px del switch de packages (el grid es la otra mitad). Se auto-gatea con
 * matchMedia: solo inicializa el ScrollTrigger cuando está visible (<1200px),
 * y re-inicializa al cruzar el breakpoint. Pin con `pinType: 'transform'`.
 */
export function PackagesCarousel({ packages, featuredLabel, className = '' }: PackagesCarouselProps) {
  const rootRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  usePageInit(
    useCallback(() => {
      if (!isMobile) {
        scheduleScrollTriggerRefresh(true)
        return
      }
      const container = containerRef.current
      const cards = cardsRef.current
      if (!container || !cards) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const ctx = gsap.context(() => {
        gsap.to(cards, {
          x: () => -(cards.scrollWidth - container.clientWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            pinType: 'transform',
            scrub: true,
            start: 'top top',
            end: () => '+=' + (cards.scrollWidth - container.clientWidth),
            invalidateOnRefresh: true,
          },
        })
      }, rootRef)

      scheduleScrollTriggerRefresh(true)

      return () => ctx.revert()
    }, [packages, isMobile]),
  )

  return (
    <section
      ref={rootRef}
      data-semantic-role="pricing"
      data-theme-section="dark"
      className={`${styles.carousel} ${className}`}
    >
      <div ref={containerRef} className={styles.container}>
        <div ref={cardsRef} className={styles.cards}>
          {packages.map((pkg) => (
            <div key={pkg.name} className={styles.card}>
              <div
                style={
                  {
                    background: pkg.gradient.bg,
                    color: pkg.gradient.text,
                    '--button-061-color': '#fdf9ed',
                    '--button-061-color-background': pkg.gradient.text,
                    '--button-061-hover-color-background': 'rgba(0, 0, 0, 0.22)',
                  } as React.CSSProperties
                }
                className={`relative flex w-full flex-col overflow-hidden rounded-2xl p-8 ${pkg.featured ? 'shadow-2xl' : 'shadow-lg'}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold leading-tight tracking-tight">{pkg.name}</h3>
                  {pkg.featured && (
                    <span
                      style={{ background: 'rgba(0, 0, 0, 0.14)' }}
                      className="rounded-full px-2 py-1 text-2xs font-accent uppercase tracking-widest"
                    >
                      {featuredLabel}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <NumberOdometer items={[{ value: pkg.priceValue }]} numberClassName="text-[2.5rem] font-bold leading-none tracking-tight" />
                  <span className="pb-1 text-2xs font-accent uppercase tracking-wide opacity-60">{pkg.priceUnit}</span>
                </div>
                <p className="mt-1.5 text-2xs font-medium opacity-75">{pkg.projectsIncludedNote}</p>
                <p className="mt-1 text-2xs opacity-60">{pkg.extraProjectNote}</p>

                <p className="mt-5 text-base font-medium leading-snug opacity-95">{pkg.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{pkg.audience}</p>

                <span className="mt-8 block text-2xs font-accent uppercase tracking-widest opacity-60">{pkg.includesLabel}</span>
                <ul className="mt-3 space-y-3 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-[1.6]">
                      <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      <span className="opacity-85">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.weeklyVisitNote && (
                  <p className="mt-5 border-t border-current/15 pt-4 text-xs font-medium leading-snug opacity-80">{pkg.weeklyVisitNote}</p>
                )}

                {pkg.disclaimer && (
                  <p className="mt-5 flex gap-1.5 border-t border-current/15 pt-4 font-accent text-2xs leading-[1.5] opacity-50">
                    <span aria-hidden>*</span>
                    <span>{pkg.disclaimer}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import type { ProposalService } from '@/content/proposals'
import styles from './services-stack-cards.module.css'

gsap.registerPlugin(ScrollTrigger)

type StackLabels = {
  eyebrow: string
  heading: string
  count: string
  scrollHint: string
  itemLabel: string
  includesLabel: string
}

type ServicesStackCardsProps = {
  services: ProposalService[]
  labels: StackLabels
  /** Gatea el ScrollTrigger: false = no inicializa (lo usa el switch responsive). */
  active?: boolean
}

const SPARKLE = (
  <svg className={styles.glyph} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0z" fill="currentColor" />
  </svg>
)

/**
 * Stack de cards al scroll (port de MWG 031). Alternativa responsive al efecto
 * fan para viewports < 1200px: cada slide pinea su content-wrapper mientras la
 * card se inclina hacia atrás en 3D y se desvanece. Pin con `pinType:'transform'`
 * (ver docs/scrolltrigger-pin-fix). Mismo contenido que el fan.
 */
export function ServicesStackCards({ services, labels, active = true }: ServicesStackCardsProps) {
  const rootRef = useRef<HTMLElement>(null)

  usePageInit(
    useCallback(() => {
      const root = rootRef.current
      if (!root) return
      if (!active) {
        scheduleScrollTriggerRefresh(true)
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const scrollHint = root.querySelector<HTMLElement>(`.${styles.scroll}`)
      const slides = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.slide}`))
      if (!slides.length) return

      const ctx = gsap.context(() => {
        if (scrollHint) {
          gsap.to(scrollHint, {
            autoAlpha: 0,
            duration: 0.2,
            scrollTrigger: { trigger: root, start: 'top top', end: 'top top-=1', toggleActions: 'play none reverse none' },
          })
        }

        slides.forEach((slide, i) => {
          const wrapper = slide.querySelector<HTMLElement>(`.${styles.contentWrapper}`)
          const content = slide.querySelector<HTMLElement>(`.${styles.content}`)
          if (!wrapper || !content) return

          const tiltZ = (i % 2 === 0 ? 1 : -1) * (3 + (i % 3))

          gsap.to(content, {
            rotationZ: tiltZ,
            scale: 0.7,
            rotationX: 40,
            ease: 'power1.in',
            scrollTrigger: {
              pin: wrapper,
              pinType: 'transform',
              trigger: slide,
              start: 'top top',
              end: () => '+=' + window.innerHeight,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })

          gsap.to(content, {
            autoAlpha: 0,
            ease: 'power1.in',
            scrollTrigger: {
              trigger: content,
              start: 'top -80%',
              end: () => '+=' + 0.2 * window.innerHeight,
              scrub: true,
            },
          })
        })
      }, root)

      scheduleScrollTriggerRefresh(true)

      return () => ctx.revert()
    }, [services, active]),
  )

  const total = String(services.length).padStart(2, '0')

  return (
    <section
      ref={rootRef}
      data-semantic-role="services"
      data-llm-context="capabilities-offerings"
      data-theme-section="dark"
      className={styles.stack}
    >
      <div className={styles.header}>
        <p>{labels.eyebrow}</p>
        <p>{labels.count}</p>
      </div>

      <p className={styles.scroll}>{labels.scrollHint}</p>

      {services.map((service, index) => {
        const num = String(index + 1).padStart(2, '0')
        return (
          <div key={service.title} className={styles.slide}>
            <div className={styles.contentWrapper}>
              <div className={styles.content}>
                <div className={styles.top}>
                  <span>
                    {labels.itemLabel} · {service.category}
                  </span>
                  <span>
                    {num} / {total}
                  </span>
                </div>

                <div>
                  {SPARKLE}
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.tagline}>{service.tagline}</p>
                </div>

                <div className={styles.includes}>
                  <span className={styles.includesLabel}>{labels.includesLabel}</span>
                  <ul>
                    {service.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

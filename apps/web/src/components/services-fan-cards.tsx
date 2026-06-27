'use client'

import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import type { ProposalService } from '@/content/proposals'
import styles from './services-fan-cards.module.css'

gsap.registerPlugin(ScrollTrigger)

type FanLabels = {
  eyebrow: string
  heading: string
  count: string
  scrollHint: string
  itemLabel: string
  includesLabel: string
}

type ServicesFanCardsProps = {
  services: ProposalService[]
  labels: FanLabels
  /** Gatea el ScrollTrigger: false = no inicializa (lo usa el switch responsive). */
  active?: boolean
}

/**
 * Efecto "fan cards" (port de MWG 003). Cada card vive en el borde superior de
 * un circle gigante; al hacer scroll, los circles rotan en abanico y barren las
 * cards por el centro del viewport.
 *
 * Implementación con UN solo ScrollTrigger que hace el pin y controla un único
 * timeline con scrub. Cada card ocupa un slot secuencial [index, index+1], así
 * el progreso del scroll mapea linealmente a todo el abanico. Esto evita el
 * problema de múltiples triggers con offsets en px dentro de un contenedor
 * pinned (que se amontonaban al final). Reutiliza el ScrollTrigger/Lenis global.
 */
export function ServicesFanCards({ services, labels, active = true }: ServicesFanCardsProps) {
  const rootRef = useRef<HTMLElement>(null)

  usePageInit(
    useCallback(() => {
    const root = rootRef.current
    if (!root) return
    // Al desactivarse, el ctx.revert previo quitó el pin; reprogramar un refresh
    // reconstruye el sort global de ScrollTrigger y evita lecturas corruptas.
    if (!active) {
      scheduleScrollTriggerRefresh(true)
      return
    }

    const pinHeight = root.querySelector<HTMLElement>(`.${styles.fanPin}`)
    const container = root.querySelector<HTMLElement>(`.${styles.fanContainer}`)
    const circlesWrap = root.querySelector<HTMLElement>(`.${styles.fanCircles}`)
    const scrollHint = root.querySelector<HTMLElement>(`.${styles.fanScroll}`)
    const circles = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.fanCircle}`))
    if (!pinHeight || !container || !circlesWrap || !circles.length) return

    const ctx = gsap.context(() => {
      if (scrollHint) {
        gsap.to(scrollHint, {
          autoAlpha: 0,
          duration: 0.2,
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'top top-=1',
            toggleActions: 'play none reverse none',
          },
        })
      }

      const angle = 3
      const halfRange = ((circles.length - 1) * angle) / 2

      const tl = gsap.timeline({
        defaults: { ease: 'power1.out' },
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top',
          end: 'bottom bottom',
          pin: container,
          // [data-main] lleva un transform (gsap.set x:0 de la navbar), que
          // rompe el pin con position:fixed. Transform-pin lo evita.
          pinType: 'transform',
          scrub: true,
          invalidateOnRefresh: true,
          id: 'fan-cards',
        },
      })

      // Drift sutil de todo el set de circles a lo largo del timeline completo.
      tl.fromTo(circlesWrap, { y: '5%' }, { y: '-5%', ease: 'none', duration: circles.length }, 0)

      // Cada card barre y rota durante su slot [index, index+1].
      circles.forEach((circle, index) => {
        const rot = -halfRange + angle * index
        const card = circle.querySelector<HTMLElement>(`.${styles.fanCard}`)
        tl.to(circle, { rotation: rot, duration: 1 }, index)
        if (card) tl.to(card, { rotation: rot, y: '-50%', duration: 1 }, index)
      })
    }, root)

    scheduleScrollTriggerRefresh(true)

    return () => ctx.revert()
    }, [services, active]),
  )

  return (
    <section
      ref={rootRef}
      data-semantic-role="services"
      data-llm-context="capabilities-offerings"
      data-theme-section="dark"
      className={styles.fanCards}
    >
      <div className={styles.fanHeader}>
        <p>{labels.eyebrow}</p>
        <p>{labels.heading}</p>
        <p>{labels.count}</p>
      </div>

      <p className={styles.fanScroll}>{labels.scrollHint}</p>

      <div className={styles.fanPin}>
        <div className={styles.fanContainer}>
          <div className={styles.fanCircles}>
            {services.map((service, index) => {
              const num = String(index + 1).padStart(2, '0')
              const total = String(services.length).padStart(2, '0')
              return (
                <div key={service.title} className={styles.fanCircle}>
                  <div className={styles.fanCard}>
                    <div className={styles.fanCardTop}>
                      <p>
                        <span>{labels.itemLabel}</span>
                        <span>{service.category}</span>
                      </p>
                      <p>
                        <span>{num}</span>
                        <span>/ {total}</span>
                      </p>
                    </div>

                    <div>
                      <span className={styles.fanCardAka}>{num}</span>
                      <h3 className={styles.fanCardTitle}>{service.title}</h3>
                    </div>

                    <div className={styles.fanCardFoot}>
                      <p className={styles.fanCardDesc}>{service.tagline}</p>
                      <div className={styles.fanCardIncludes}>
                        <span className={styles.fanCardIncludesLabel}>{labels.includesLabel}</span>
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
          </div>
        </div>
      </div>
    </section>
  )
}

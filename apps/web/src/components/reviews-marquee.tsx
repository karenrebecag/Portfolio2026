'use client'

import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import { REVIEWS } from '@/lib/reviews'
import styles from './reviews-marquee.module.css'

gsap.registerPlugin(ScrollTrigger)

type ReviewsMarqueeProps = {
  eyebrow: string
  heading: string
  subheading: string
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/**
 * Galería horizontal de testimonios (port de MWG 087). El scroll vertical
 * desplaza las cards en X mientras la sección queda pinned (scrub); cada card
 * hace un "catch-up" de parallax al entrar en el viewport horizontal, con la
 * velocidad tomada de un ticker. El header (eyebrow + heading + subheading) vive
 * dentro del container pinned, así queda fijo mientras las cards se desplazan.
 * Consume el mismo REVIEWS que el home. Pin con `pinType: 'transform'` por
 * compatibilidad con Lenis (ver otros componentes pinned del proyecto).
 */
export function ReviewsMarquee({ eyebrow, heading, subheading }: ReviewsMarqueeProps) {
  const rootRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  usePageInit(
    useCallback(() => {
      const root = rootRef.current
      const container = containerRef.current
      const cards = cardsRef.current
      if (!root || !container || !cards) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        scheduleScrollTriggerRefresh(true)
        return
      }

      let tickerFn: (() => void) | null = null

      const ctx = gsap.context(() => {
        const cardEls = gsap.utils.toArray<HTMLElement>(`.${styles.card}`)
        const getDistance = () => cards.scrollWidth - window.innerWidth

        let transformBetweenTwoTicks = 0
        let oldTransform = 0
        tickerFn = () => {
          const current = gsap.getProperty(cards, 'x') as number
          transformBetweenTwoTicks = current - oldTransform
          oldTransform = current
        }

        const scrollTween = gsap.to(cards, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            pinType: 'transform',
            scrub: true,
            start: 'top top',
            end: () => '+=' + getDistance(),
            invalidateOnRefresh: true,
          },
        })

        function transformCard(el: Element) {
          gsap.fromTo(
            el,
            { xPercent: -transformBetweenTwoTicks * 3 },
            { xPercent: 0, ease: 'power3.out', duration: 0.7 },
          )
        }

        cardEls.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: scrollTween,
            start: 'left 100%',
            end: 'right 0%',
            onEnter: () => transformCard(card.children[0]!),
            onEnterBack: () => transformCard(card.children[0]!),
          })
        })

        // El ticker solo corre mientras la sección está en pantalla.
        ScrollTrigger.create({
          trigger: root,
          onEnter: () => tickerFn && gsap.ticker.add(tickerFn),
          onLeave: () => tickerFn && gsap.ticker.remove(tickerFn),
          onEnterBack: () => tickerFn && gsap.ticker.add(tickerFn),
          onLeaveBack: () => tickerFn && gsap.ticker.remove(tickerFn),
        })
      }, root)

      scheduleScrollTriggerRefresh(true)

      return () => {
        if (tickerFn) gsap.ticker.remove(tickerFn)
        ctx.revert()
      }
    }, []),
  )

  return (
    <section
      ref={rootRef}
      data-semantic-role="testimonials"
      data-llm-context="client-testimonials-social-proof"
      data-theme-section="dark"
      className={styles.section}
    >
      <div ref={containerRef} className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 data-split="heading" data-split-reveal="words" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.subheading}>{subheading}</p>
        </div>
        <div className={styles.cardsArea}>
          <div ref={cardsRef} className={styles.cards}>
            {REVIEWS.map((review) => (
              <div key={review.name} className={styles.card}>
                <div className={styles.cardContent}>
                  <p className={styles.top}>&ldquo;{review.quote}&rdquo;</p>
                  <div className={styles.bottom}>
                    <div className={styles.avatar}>
                      {review.photo ? (
                        <img src={review.photo} alt={review.name} />
                      ) : (
                        <span className={styles.monogram}>{initials(review.name)}</span>
                      )}
                    </div>
                    <p className={styles.meta}>
                      <strong>{review.name}</strong>
                      <br />
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

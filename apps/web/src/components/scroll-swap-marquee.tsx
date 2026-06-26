'use client'

import { Fragment, useCallback, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import styles from './scroll-swap-marquee.module.css'

gsap.registerPlugin(ScrollTrigger)

type ScrollSwapMarqueeProps = {
  /** Frases del marquee, separadas por el glyph. Se duplican para loop seamless. */
  items: string[]
  /** Fila inferior de metadatos (opcional), con borde punteado superior. Solo full. */
  texts?: string[]
  /** Glyph separador entre frases. Por defecto, un asterisco en currentColor. */
  glyph?: ReactNode
  /** Duración del loop horizontal en segundos (mayor = más lento). */
  speed?: number
  /**
   * Modo banda: una sola fila delgada como separador, sin pin ni swap vertical.
   * Solo el auto-scroll horizontal. Ideal justo debajo de un hero.
   */
  compact?: boolean
  className?: string
}

const DEFAULT_GLYPH = (
  <svg className={styles.glyph} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Marquee con dos modos:
 * - full (MWG 024): pinned con swap vertical al scroll.
 * - compact: banda separadora delgada, solo scroll horizontal.
 * Reutiliza el ScrollTrigger/Lenis global. CSS scopeado en el módulo hermano.
 */
export function ScrollSwapMarquee({
  items,
  texts,
  glyph = DEFAULT_GLYPH,
  speed = 16,
  compact = false,
  className = '',
}: ScrollSwapMarqueeProps) {
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLParagraphElement>(null)
  const line2Ref = useRef<HTMLParagraphElement>(null)

  usePageInit(
    useCallback(() => {
      const line1 = line1Ref.current
      if (!line1) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const ctx = gsap.context(() => {
        const line2 = line2Ref.current

        // Auto-scroll horizontal continuo, fila 1 (ambos modos).
        gsap.to(line1, { xPercent: -50, ease: 'none', duration: speed, repeat: -1 })

        if (!line2) return

        // Fila 2: arranca un renglón abajo y corre en sentido opuesto.
        gsap.set(line2, { yPercent: 100 })
        gsap.fromTo(
          line2,
          { xPercent: -50 },
          { xPercent: 0, ease: 'none', duration: speed, repeat: -1 },
        )

        if (compact) {
          // Swap vertical atado al paso de la banda por el viewport (sin pin).
          gsap.to([line1, line2], {
            yPercent: '-=100',
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          })
          return
        }

        // --- Full (MWG 024): swap vertical pinned ---
        const pin = pinRef.current
        const container = containerRef.current
        if (!pin || !container) return

        gsap.to([line1, line2], {
          yPercent: '-=100',
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            // [data-main] lleva un transform (gsap.set x:0 de la navbar), lo que
            // rompe el pin con position:fixed. Transform-pin funciona dentro de
            // ancestros transformados y conserva el scope data-palette.
            pinType: 'transform',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        })
      }, rootRef)

      scheduleScrollTriggerRefresh(true)

      return () => ctx.revert()
    }, [items, texts, speed, compact]),
  )

  // Duplicar la secuencia para que el loop a -50% sea seamless.
  const sequence = [...items, ...items]
  const renderLine = (ref: React.Ref<HTMLParagraphElement>) => (
    <p ref={ref} className={styles.line}>
      {sequence.map((label, i) => (
        <Fragment key={i}>
          <span>{label}</span>
          {glyph}
        </Fragment>
      ))}
    </p>
  )

  if (compact) {
    return (
      <section
        ref={rootRef}
        data-semantic-role="marquee"
        data-theme-section="dark"
        className={`${styles.band} ${className}`}
        aria-hidden
      >
        <div className={styles.bandSentences}>
          <div className={styles.sentence}>{renderLine(line1Ref)}</div>
          <div className={`${styles.sentence} ${styles.sentence2}`}>{renderLine(line2Ref)}</div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={rootRef}
      data-semantic-role="marquee"
      data-theme-section="dark"
      className={`${styles.marquee} ${className}`}
    >
      <div ref={pinRef} className={styles.pinHeight}>
        <div ref={containerRef} className={styles.container}>
          <div className={styles.sentences} aria-hidden>
            <div className={styles.sentence}>{renderLine(line1Ref)}</div>
            <div className={`${styles.sentence} ${styles.sentence2}`}>{renderLine(line2Ref)}</div>
          </div>

          {texts && texts.length > 0 && (
            <div className={styles.texts}>
              {texts.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

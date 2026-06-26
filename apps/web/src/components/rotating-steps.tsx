'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import { GridGuides } from '@/components/ui/grid-guides'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import styles from './rotating-steps.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

type RotatingStep = {
  title: string
  description: string
}

type RotatingStepsProps = {
  steps: RotatingStep[]
  /** Shapes para el image trail decorativo (reusa los del hero). */
  shapes?: string[]
}

/**
 * Steps que voltean en 3D al scrollear (port de MWG 053). Cada step se apila en
 * la misma celda con perspectiva; un timeline scrubbed rota el actual hacia
 * afuera (rotationY -90) mientras entra el siguiente (90 → 0). Cada rotación es
 * un step. Pinned con `pinType: 'transform'` (ver docs/scrolltrigger-pin-fix).
 */
const DESKTOP_QUERY = '(min-width: 768px)'

export function RotatingSteps({ steps, shapes }: RotatingStepsProps) {
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(true)

  // El pin + 3D no funciona bien < 768px (vh inestable por la barra de URL); ahí
  // se cae al fallback apilado (CSS) y se gatea el JS para no crear el pin.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  usePageInit(
    useCallback(() => {
      const root = rootRef.current
      const pin = pinRef.current
      const container = containerRef.current
      if (!root || !pin || !container) return
      if (!isDesktop) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const paragraphs = Array.from(
        container.querySelectorAll<HTMLElement>(`.${styles.paragraph}`),
      )
      if (paragraphs.length < 2) return

      let splits: SplitText[] = []

      const ctx = gsap.context(() => {
        splits = paragraphs.map((p) => {
          const split = SplitText.create(p, { type: 'lines', linesClass: styles.line })
          split.lines.forEach((line) => {
            line.innerHTML = `<div class="${styles.lineInner}">${line.innerHTML}</div>`
          })
          return split
        })

        // Solo el primer step arranca de frente; el resto, de canto.
        splits.forEach((split, i) => {
          if (i > 0) gsap.set(split.lines, { rotationY: 90 })
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: 'bottom bottom',
            pin: container,
            pinType: 'transform',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        splits.forEach((split, i) => {
          const next = splits[i + 1]
          if (!next) return
          tl.to(split.lines, {
            rotationY: -90,
            stagger: 0.07,
            duration: 1,
            ease: 'back.inOut(1.5)',
          })
          tl.to(
            next.lines,
            { rotationY: 0, stagger: 0.07, duration: 1, ease: 'back.inOut(1.5)' },
            '<',
          )
        })
      }, root)

      scheduleScrollTriggerRefresh(true)

      return () => {
        splits.forEach((s) => s.revert())
        ctx.revert()
      }
    }, [steps, isDesktop]),
  )

  return (
    <section
      ref={rootRef}
      data-semantic-role="process"
      data-llm-context="how-i-work"
      data-theme-section="dark"
      className={styles.section}
    >
      <div ref={pinRef} className={styles.pinHeight} style={{ height: `${steps.length * 150}vh` }}>
        <div ref={containerRef} className={styles.container}>
          <GridGuides className="z-0" style={{ opacity: 0.04 }} />
          {shapes && shapes.length > 0 && (
            <CursorImageTrail
              images={shapes}
              autoIntervalMs={900}
              className="absolute inset-0 z-0"
            />
          )}
          {steps.map((step, i) => (
            <p key={step.title} className={styles.paragraph}>
              <span className={styles.num}>{i + 1}</span>{' '}
              <span className={styles.title}>{step.title}.</span>{' '}
              <span className={styles.desc}>{step.description}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

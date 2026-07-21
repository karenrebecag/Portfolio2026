'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import styles from './scroll-reveal-list.module.css'

gsap.registerPlugin(ScrollTrigger)

type ScrollRevealItem = {
  key: string
  content: ReactNode
}

type ScrollRevealListProps = {
  items: ScrollRevealItem[]
  /** vh de scroll dedicados a cada item; controla el ritmo del reveal. */
  vhPerItem?: number
  className?: string
}

const DESKTOP_QUERY = '(min-width: 900px)'

/**
 * Lista que se revela item por item mientras el bloque queda pinned al
 * scroll (adaptación de MWG 090 a nivel de item en vez de carácter: ahí un
 * párrafo revela sus letras al hacer scroll con scrub; acá cada item pasa de
 * opacidad baja a visible en su turno). No conoce el contenido de cada item,
 * así que es reusable para cualquier lista.
 */
export function ScrollRevealList({ items, vhPerItem = 30, className = '' }: ScrollRevealListProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(true)

  // Bajo el umbral, el pin + scrub se siente forzado en pantallas chicas;
  // ahí cae al fallback estático (CSS) y el JS se gatea sin crear el pin.
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
      if (!isDesktop) {
        scheduleScrollTriggerRefresh(true)
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const itemEls = Array.from(container.querySelectorAll<HTMLElement>(`.${styles.item}`))
      if (itemEls.length === 0) return

      const ctx = gsap.context(() => {
        gsap.set(itemEls, { opacity: 0.12, y: 14 })

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

        itemEls.forEach((el, i) => {
          tl.to(el, { opacity: 1, y: 0, duration: 1, ease: 'none' }, i)
        })
      }, root)

      scheduleScrollTriggerRefresh(true)

      return () => ctx.revert()
    }, [items, isDesktop]),
  )

  return (
    <div ref={rootRef} className={className}>
      <div ref={pinRef} className={styles.pinHeight} style={{ height: `${items.length * vhPerItem}vh` }}>
        <div ref={containerRef} className={styles.container}>
          {items.map((item) => (
            <div key={item.key} className={styles.item}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

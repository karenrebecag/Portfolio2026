'use client'

import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import styles from './number-odometer.module.css'

gsap.registerPlugin(ScrollTrigger)

export type OdometerItem = {
  /** Valor final mostrado, con símbolos/separadores: "€248.750", "99%", "+120". */
  value: string
  /** Valor inicial; las columnas extra crecen al animar. Default 0. */
  start?: string
  /** Duración del roll en segundos. Default 1. */
  duration?: number
  /** Etiqueta opcional bajo el número. */
  label?: string
}

type NumberOdometerProps = {
  items: OdometerItem[]
  /** Orden en que arrancan los elementos del grupo. Default 'left'. */
  staggerOrder?: 'left' | 'right' | 'random'
  /** Delay entre elementos del grupo, en segundos. Default 0.1. */
  stagger?: number
  /** ScrollTrigger start. Default 'top 80%'. */
  triggerStart?: string
  className?: string
  /** Clase para cada número (tipografía/tamaño). */
  numberClassName?: string
  /** Clase para cada etiqueta. */
  labelClassName?: string
}

const CONFIG = {
  duration: 1,
  ease: 'power3.out',
  elementStagger: 0.1,
  digitStagger: 0.04,
  revealDuration: 0.5,
  revealEase: 'power2.out',
  digitCycles: 2,
} as const

type Segment = { type: 'digit' | 'static'; char: string; startDigit?: number; hidden?: boolean }
type Roller = { roller: HTMLElement; targetPos: number }

function getLineHeightRatio(el: HTMLElement): number {
  const cs = getComputedStyle(el)
  const lh = cs.lineHeight
  if (lh === 'normal') return 1.2
  return parseFloat(lh) / parseFloat(cs.fontSize)
}

function parseSegments(text: string): Segment[] {
  return [...text].map((char) => ({ type: /\d/.test(char) ? 'digit' : 'static', char }))
}

function mapStartDigits(segments: Segment[], startValue: number): Segment[] {
  const digitSlots = segments.filter((s) => s.type === 'digit')
  const padded = String(Math.floor(Math.abs(startValue)))
    .padStart(digitSlots.length, '0')
    .slice(-digitSlots.length)
  let di = 0
  return segments.map((s) =>
    s.type === 'digit' ? { ...s, startDigit: parseInt(padded[di++]!, 10) } : s,
  )
}

function markHiddenSegments(segments: Segment[], startValue: number): Segment[] {
  const totalDigits = segments.filter((s) => s.type === 'digit').length
  const absStart = Math.floor(Math.abs(startValue))
  const startDigitCount = absStart === 0 ? 1 : String(absStart).length
  const leadingZeros = Math.max(0, totalDigits - startDigitCount)
  if (leadingZeros === 0) return segments
  let digitsSeen = 0
  let firstDigitSeen = false
  let prevDigitHidden = false
  return segments.map((seg) => {
    if (seg.type === 'digit') {
      firstDigitSeen = true
      const hidden = digitsSeen < leadingZeros
      prevDigitHidden = hidden
      digitsSeen++
      return { ...seg, hidden }
    }
    const hidden = firstDigitSeen && prevDigitHidden
    return { ...seg, hidden }
  })
}

function shouldGrow(
  el: HTMLElement,
  hasExplicitStart: boolean,
  startValue: number,
  segments: Segment[],
): boolean {
  if (el.hasAttribute('data-odometer-grow')) {
    return el.getAttribute('data-odometer-grow') !== 'false'
  }
  if (!hasExplicitStart) return false
  const absStart = Math.floor(Math.abs(startValue))
  const startDigitCount = absStart === 0 ? 1 : String(absStart).length
  const endDigitCount = segments.filter((s) => s.type === 'digit').length
  return startDigitCount < endDigitCount
}

function buildRollerDOM(el: HTMLElement, segments: Segment[], step: number, grow: boolean) {
  el.innerHTML = ''
  el.style.height = ''
  const rollers: Roller[] = []
  const revealEls: HTMLElement[] = []
  const totalCells = 10 * CONFIG.digitCycles

  segments.forEach((seg) => {
    if (seg.type === 'static') {
      const span = document.createElement('span')
      span.setAttribute('data-odometer-part', 'static')
      span.style.height = step + 'em'
      span.style.lineHeight = String(step)
      span.textContent = seg.char
      el.appendChild(span)
      if (grow && seg.hidden) {
        gsap.set(span, { opacity: 0 })
        revealEls.push(span)
      }
      return
    }

    const mask = document.createElement('span')
    mask.setAttribute('data-odometer-part', 'mask')
    mask.style.height = step + 'em'
    mask.style.lineHeight = String(step)
    const roller = document.createElement('span')
    roller.setAttribute('data-odometer-part', 'roller')
    roller.style.lineHeight = String(step)

    const digits: number[] = []
    for (let d = 0; d < totalCells; d++) digits.push(d % 10)
    roller.textContent = digits.join('\n')
    mask.appendChild(roller)
    el.appendChild(mask)

    const startDigit = seg.startDigit ?? 0
    const isReveal = grow && Boolean(seg.hidden)
    gsap.set(roller, { y: isReveal ? step + 'em' : -startDigit * step + 'em' })
    const endDigit = parseInt(seg.char, 10)
    const targetPos = endDigit > startDigit ? endDigit : 10 + endDigit
    rollers.push({ roller, targetPos })
    if (isReveal) revealEls.push(mask)
  })

  return { rollers, revealEls }
}

function cleanupElement(el: HTMLElement, originalText: string) {
  el.style.overflow = ''
  el.style.height = ''
  const digits = [...originalText].filter((c) => /\d/.test(c))
  let di = 0
  el.querySelectorAll<HTMLElement>('[data-odometer-part="mask"]').forEach((mask) => {
    const roller = mask.querySelector('[data-odometer-part="roller"]')
    if (roller) roller.remove()
    mask.textContent = digits[di++] || ''
    mask.style.opacity = ''
    mask.style.overflow = ''
  })
  el.querySelectorAll<HTMLElement>('[data-odometer-part="static"]').forEach((stat) => {
    stat.style.opacity = ''
  })
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

function applyStaggerOrder<T>(items: T[], order: 'left' | 'right' | 'random'): T[] {
  const arr = [...items]
  if (order === 'right') return arr.reverse()
  if (order === 'random') return shuffle(arr)
  return arr
}

/**
 * Number Odometer (Osmo): roll mecánico de dígitos que aterriza en el valor
 * final al entrar en viewport. Funciona con cualquier formato (comas, puntos,
 * símbolos de moneda, %). Reescrito al patrón del proyecto: data-driven, scoped
 * al root (no a `document`), `usePageInit` + `scheduleScrollTriggerRefresh` y
 * `gsap.context` para limpieza. Respeta prefers-reduced-motion.
 */
export function NumberOdometer({
  items,
  staggerOrder = 'left',
  stagger,
  triggerStart = 'top 80%',
  className = '',
  numberClassName = '',
  labelClassName = '',
}: NumberOdometerProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  usePageInit(
    useCallback(() => {
      const group = rootRef.current
      if (!group) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const elements = Array.from(group.querySelectorAll<HTMLElement>('[data-odometer-element]'))
      if (!elements.length) return

      const originals = elements.map((el) => el.textContent?.trim() ?? '')
      const elementStagger = stagger ?? CONFIG.elementStagger
      let rafId = 0

      const ctx = gsap.context(() => {
        const elementData = elements.map((el) => {
          const originalText = el.textContent?.trim() ?? ''
          const hasExplicitStart = el.hasAttribute('data-odometer-start')
          const startValue = parseFloat(el.getAttribute('data-odometer-start') || '') || 0
          const duration = parseFloat(el.getAttribute('data-odometer-duration') || '') || CONFIG.duration
          const step = getLineHeightRatio(el)

          let segments = parseSegments(originalText)
          segments = mapStartDigits(segments, startValue)
          segments = markHiddenSegments(segments, startValue)

          const grow = shouldGrow(el, hasExplicitStart, startValue, segments)
          const { rollers, revealEls } = buildRollerDOM(el, segments, step, grow)

          const fontSize = parseFloat(getComputedStyle(el).fontSize)
          const revealData = revealEls.map((revealEl) => {
            const widthEm = revealEl.offsetWidth / fontSize
            gsap.set(revealEl, { width: 0, overflow: 'hidden' })
            return { el: revealEl, widthEm }
          })

          return { el, rollers, duration, step, revealData, originalText }
        })

        const ordered = applyStaggerOrder(elementData, staggerOrder)

        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: triggerStart, once: true },
          onComplete() {
            elementData.forEach(({ el, originalText }) => cleanupElement(el, originalText))
          },
        })

        ordered.forEach((data, orderIdx) => {
          const { rollers, duration, step, revealData } = data
          const offset = orderIdx * elementStagger

          revealData.forEach(({ el, widthEm }) => {
            tl.to(
              el,
              { width: widthEm + 'em', opacity: 1, duration: CONFIG.revealDuration, ease: CONFIG.revealEase },
              offset,
            )
          })

          rollers.forEach(({ roller, targetPos }, digitIdx) => {
            const reversedIdx = rollers.length - 1 - digitIdx
            tl.to(
              roller,
              { y: -targetPos * step + 'em', duration, ease: CONFIG.ease, force3D: true },
              offset + reversedIdx * CONFIG.digitStagger,
            )
          })
        })

        // Fallback: si la sección ya está en viewport al montar (p. ej. cambio
        // de idioma con soft-nav, sin remontar), el ScrollTrigger `once` no
        // dispara onEnter — reproducimos el timeline directo.
        rafId = requestAnimationFrame(() => {
          const st = tl.scrollTrigger
          if (!st || st.progress > 0) return
          if (!ScrollTrigger.isInViewport(group, 0.1)) return
          st.kill()
          tl.play(0)
        })
      }, group)

      scheduleScrollTriggerRefresh(true)

      return () => {
        cancelAnimationFrame(rafId)
        ctx.revert()
        // Restaura el texto plano: deja el DOM consistente con React y permite un
        // re-init limpio (el componente no remonta al cambiar de idioma).
        elements.forEach((el, i) => {
          el.textContent = originals[i] ?? ''
        })
      }
    }, [items, staggerOrder, stagger, triggerStart]),
  )

  return (
    <div ref={rootRef} data-odometer-group className={`${styles.group} ${className}`}>
      {items.map((item, i) => (
        <div key={`${item.value}-${i}`} className={styles.cell}>
          <span
            data-odometer-element
            data-odometer-start={item.start}
            data-odometer-duration={item.duration}
            className={`${styles.element} ${numberClassName}`}
          >
            {item.value}
          </span>
          {item.label && <span className={`${styles.label} ${labelClassName}`}>{item.label}</span>}
        </div>
      ))}
    </div>
  )
}

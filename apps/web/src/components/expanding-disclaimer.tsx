'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ensureOsmoEase } from '@/lib/column-wipe'
import styles from './expanding-disclaimer.module.css'

/** id del contenedor fixed compartido con el IconButton de LinkedIn, en el layout raíz. */
const PORTAL_TARGET_ID = 'fixed-corner-actions'

type DisclaimerItem = {
  key: string
  content: ReactNode
}

type ExpandingDisclaimerProps = {
  /** Texto del pill cerrado. */
  label: string
  primaryLabel: string
  primaryItems: DisclaimerItem[]
  secondaryLabel: string
  secondaryItems: DisclaimerItem[]
  className?: string
}

/**
 * Pill que se expande a un panel (port de "Expanding Bottom Navigation",
 * osmo.supply) — repurposed como disclaimer de contenido, no como nav.
 * Absolute, ancla la esquina del contenedor posicionado del caller. Un solo
 * timeline GSAP con CustomEase morph de width/height del `inner`; abre y
 * cierra desde el mismo timeline (pausa en `enterEnd`, reversa o continúa
 * según el estado), igual que el original.
 */
export function ExpandingDisclaimer({
  label,
  primaryLabel,
  primaryItems,
  secondaryLabel,
  secondaryItems,
  className = '',
}: ExpandingDisclaimerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const barTopRef = useRef<HTMLSpanElement>(null)
  const barBotRef = useRef<HTMLSpanElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  // Portal al div fixed compartido con el IconButton de LinkedIn (layout raíz),
  // en vez de duplicar position:fixed acá — mismo container, mismo z-index.
  // Mientras el disclaimer ocupa la esquina, se oculta el IconButton hermano.
  useEffect(() => {
    const target = document.getElementById(PORTAL_TARGET_ID)
    setPortalTarget(target)
    const linkedin = target?.querySelector<HTMLElement>('.icon-button')
    const prevDisplay = linkedin?.style.display
    if (linkedin) linkedin.style.display = 'none'
    return () => {
      if (linkedin) linkedin.style.display = prevDisplay ?? ''
    }
  }, [])

  useEffect(() => {
    const inner = innerRef.current
    const bar = barRef.current
    const panel = panelRef.current
    const toggle = toggleRef.current
    const barTop = barTopRef.current
    const barBot = barBotRef.current
    const divider = dividerRef.current
    if (!inner || !bar || !panel || !toggle || !barTop || !barBot) return

    // Sin motion: toggle simple de display, sin timeline ni morph.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let open = false
      const onClick = () => {
        open = !open
        panel.style.display = open ? 'flex' : 'none'
        toggle.setAttribute('aria-expanded', String(open))
      }
      panel.style.display = 'none'
      toggle.addEventListener('click', onClick)
      return () => toggle.removeEventListener('click', onClick)
    }

    ensureOsmoEase()

    const reveals = Array.from(panel.querySelectorAll<HTMLElement>(`.${styles.reveal}`))

    let isOpen = false
    let enterEnd = 0
    let dimensions = { closedW: 0, closedH: 0, openW: 0, openH: 0 }
    let tl: gsap.core.Timeline

    function measure() {
      const w = inner!.style.width
      const h = inner!.style.height
      inner!.style.width = 'var(--disclaimer-open-width)'
      inner!.style.height = 'auto'
      const openW = inner!.offsetWidth
      const openH = inner!.offsetHeight
      inner!.style.width = 'var(--disclaimer-closed-width)'
      const closedW = inner!.offsetWidth
      inner!.style.width = w
      inner!.style.height = h
      return { closedW, closedH: bar!.offsetHeight, openW, openH }
    }

    function applyClosed() {
      gsap.set(inner, { width: dimensions.closedW, height: dimensions.closedH })
    }

    function buildTimeline() {
      tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'osmo', easeReverse: 'power2.inOut' },
      })

      tl.to(inner, { width: () => dimensions.openW, height: () => dimensions.openH, duration: 0.65 }, 0)
        .to(barTop, { y: '0.175em', rotation: 45, duration: 0.4, ease: 'back.out(2)', easeReverse: 'power3.out' }, 0.05)
        .to(barBot, { y: '-0.175em', rotation: -45, duration: 0.4, ease: 'back.out(2)', easeReverse: 'power3.out' }, 0.05)
        .set(panel, { autoAlpha: 1 }, 0.1)
        .fromTo(
          reveals,
          { autoAlpha: 0, yPercent: 100 },
          { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.03 },
          0.1,
        )

      if (divider) {
        tl.fromTo(divider, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 1.1 }, 0)
      }

      enterEnd = tl.duration()
      tl.addPause()

      // Mitad de cierre: se agrega al mismo timeline, después del pause.
      tl.to(reveals, { autoAlpha: 0, yPercent: 10, duration: 0.25, stagger: { each: 0.01, from: 'end' } })
        .to(inner, { width: () => dimensions.closedW, height: () => dimensions.closedH, duration: 0.45, ease: 'power3.inOut' }, '<')
        .to([barTop, barBot], { y: 0, rotation: 0, duration: 0.3, ease: 'power3.in' }, '<')
        .set(panel, { autoAlpha: 0 })
    }

    function setState(open: boolean) {
      isOpen = open
      rootRef.current?.setAttribute('data-disclaimer-open', String(open))
      toggle!.setAttribute('aria-expanded', String(open))
      panel!.setAttribute('aria-hidden', String(!open))
    }

    function toggleDisclaimer() {
      setState(!isOpen)
      if (isOpen) {
        tl.invalidate()
        if (tl.time() >= enterEnd) tl.timeScale(1).restart()
        else tl.timeScale(1).play()
      } else if (tl.time() < enterEnd) {
        tl.timeScale(1).reverse()
      } else {
        tl.timeScale(1).play()
      }
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        toggleDisclaimer()
        toggle!.focus()
      }
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        dimensions = measure()
        if (isOpen) gsap.set(inner, { width: dimensions.openW, height: dimensions.openH })
        else {
          tl.invalidate()
          applyClosed()
        }
      }, 150)
    }

    // Cierra al hacer scroll (cualquier desplazamiento), solo si está abierto.
    function onScroll() {
      if (isOpen) toggleDisclaimer()
    }

    dimensions = measure()
    applyClosed()
    buildTimeline()

    toggle.addEventListener('click', toggleDisclaimer)
    document.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      toggle.removeEventListener('click', toggleDisclaimer)
      document.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(resizeTimer)
      tl?.kill()
    }
    // portalTarget: el primer render (antes del portal) no monta el DOM real
    // (el componente devuelve null), así que los refs siguen vacíos hasta que
    // portalTarget deja de ser null y el markup se monta de verdad.
  }, [portalTarget])

  if (!portalTarget) return null

  return createPortal(
    <div ref={rootRef} data-expanding-disclaimer data-disclaimer-open="false" className={`${styles.root} ${className}`}>
      <div ref={innerRef} className={styles.inner}>
        <div ref={barRef} className={styles.bar}>
          <span className={styles.label}>{label}</span>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={false}
            aria-controls={panelId}
            aria-label={label}
            className={styles.toggle}
          >
            <span ref={barTopRef} className={`${styles.toggleBar} ${styles.toggleBarTop}`} />
            <span ref={barBotRef} className={`${styles.toggleBar} ${styles.toggleBarBtm}`} />
          </button>
        </div>
        <div ref={panelRef} id={panelId} aria-hidden="true" className={styles.panel}>
          <span className={`${styles.reveal} ${styles.sectionLabel}`}>{primaryLabel}</span>
          <ul className={styles.list}>
            {primaryItems.map((item) => (
              <li key={item.key} className={`${styles.reveal} ${styles.listItem}`}>
                {item.content}
              </li>
            ))}
          </ul>
          <div ref={dividerRef} className={styles.divider} />
          <span className={`${styles.reveal} ${styles.sectionLabel}`}>{secondaryLabel}</span>
          <ul className={styles.list}>
            {secondaryItems.map((item) => (
              <li key={item.key} className={`${styles.reveal} ${styles.listItem}`}>
                {item.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    portalTarget,
  )
}

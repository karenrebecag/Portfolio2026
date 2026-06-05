'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PANEL_COUNT = 5

export function TransitionOverlay() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const columns = wrap.querySelectorAll<HTMLElement>('[data-transition-column]')
    const lines = wrap.querySelector<HTMLElement>('.transition__lines')

    const tl = gsap.timeline({
      delay: 0.08,
      onComplete: () => {
        document.body.setAttribute('data-page-ready', '')
        document.dispatchEvent(new CustomEvent('page-ready'))
      },
    })

    tl.to(columns, {
      yPercent: 100,
      duration: 0.38,
      stagger: 0.04,
      ease: 'power3.inOut',
    })

    if (lines) {
      tl.to(lines, { autoAlpha: 0, duration: 0.22 }, '-=0.18')
    }
  }, [])

  return (
    <div ref={wrapRef} className="transition">
      <div className="transition__panels">
        {Array.from({ length: PANEL_COUNT }, (_, i) => (
          <div
            key={i}
            data-transition-column
            className="transition__panel bg-surface"
          />
        ))}
      </div>
      <div className="transition__lines">
        {Array.from({ length: PANEL_COUNT }, (_, i) => (
          <div
            key={i}
            className={`transition__line${i === PANEL_COUNT - 1 ? ' is--last' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

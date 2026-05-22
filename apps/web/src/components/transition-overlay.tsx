'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PANEL_COLORS = ['#253c37', '#253c37', '#253c37', '#253c37', '#253c37']

export function TransitionOverlay() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const columns = wrap.querySelectorAll<HTMLElement>('[data-transition-column]')
    const lines = wrap.querySelector<HTMLElement>('.transition__lines')

    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        document.body.setAttribute('data-page-ready', '')
        document.dispatchEvent(new CustomEvent('page-ready'))
      },
    })

    tl.to(columns, {
      yPercent: 100,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power3.inOut',
    })

    if (lines) {
      tl.to(lines, { autoAlpha: 0, duration: 0.3 }, '-=0.2')
    }
  }, [])

  return (
    <div ref={wrapRef} className="transition">
      <div className="transition__panels">
        {PANEL_COLORS.map((color, i) => (
          <div
            key={i}
            data-transition-column
            className="transition__panel"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="transition__lines">
        {PANEL_COLORS.map((_, i) => (
          <div
            key={i}
            className={`transition__line${i === PANEL_COLORS.length - 1 ? ' is--last' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

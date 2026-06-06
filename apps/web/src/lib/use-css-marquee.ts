'use client'

import { useEffect, useRef } from 'react'

export const CSS_MARQUEE_PIXELS_PER_SECOND = 60

/** Pure-CSS infinite marquee — clones one group until the rail spans 2× viewport. */
export function useCssMarquee(deps: unknown[] = []) {
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group) return

    function build() {
      track!.querySelectorAll('[data-marquee-clone]').forEach((n) => n.remove())

      const groupWidth = group!.offsetWidth || 1
      const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / groupWidth))

      for (let i = 1; i < copies; i++) {
        const clone = group!.cloneNode(true) as HTMLElement
        clone.setAttribute('data-marquee-clone', '')
        clone.setAttribute('aria-hidden', 'true')
        track!.appendChild(clone)
      }

      track!.style.setProperty('--marquee-duration', `${groupWidth / CSS_MARQUEE_PIXELS_PER_SECOND}s`)
      track!.style.setProperty('--marquee-shift', `-${groupWidth}px`)
    }

    build()

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      track!.querySelectorAll('[data-marquee-clone]').forEach((n) => n.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { trackRef, groupRef }
}
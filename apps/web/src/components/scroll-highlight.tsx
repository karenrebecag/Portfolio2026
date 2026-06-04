'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ScrollHighlight({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const highlights = section.querySelectorAll<HTMLElement>('[data-highlight]')
    if (!highlights.length) return

    const ctx = gsap.context(() => {
      highlights.forEach((mark) => {
        gsap.fromTo(
          mark,
          { backgroundSize: '0% 100%' },
          {
            backgroundSize: '100% 100%',
            ease: 'none',
            scrollTrigger: {
              trigger: mark,
              start: 'top 80%',
              end: 'top 40%',
              scrub: true,
            },
          },
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return <div ref={sectionRef}>{children}</div>
}

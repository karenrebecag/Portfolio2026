'use client'

import { useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { usePageInit } from '@/lib/use-page-init'

gsap.registerPlugin(ScrollTrigger, SplitText)

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
}

function initTextReveals() {
  document.querySelectorAll<HTMLElement>('[data-split="heading"]').forEach((heading) => {
    const trigger = heading.getAttribute('data-split-trigger') || 'scroll'
    const type = (heading.getAttribute('data-split-reveal') || 'lines') as 'lines' | 'words' | 'chars'
    const typesToSplit = type === 'lines' ? ['lines'] : type === 'words' ? ['lines', 'words'] : ['lines', 'words', 'chars']

    gsap.set(heading, { autoAlpha: 1 })

    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance) {
        const targets = instance[type]
        const config = splitConfig[type]

        if (trigger === 'mount') {
          return gsap.from(targets, { yPercent: 110, duration: config.duration, stagger: config.stagger, ease: 'expo.out' })
        }

        return gsap.from(targets, {
          yPercent: 110, duration: config.duration, stagger: config.stagger, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'clamp(top 80%)', once: true },
        })
      },
    })
  })
}

export function TextRevealProvider({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => {
    document.fonts.ready.then(() => initTextReveals())
  }, []))
  return <>{children}</>
}

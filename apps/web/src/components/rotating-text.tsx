'use client'

import { useCallback } from 'react'
import { usePageInit } from '@/lib/use-page-init'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

function initRotatingText() {
  document.querySelectorAll<HTMLElement>('[data-rotating-title]').forEach((heading) => {
    const stepDuration = parseFloat(heading.getAttribute('data-step-duration') || '1.75')

    SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'rotating-line',
      onSplit() {
        const rotatingSpan = heading.querySelector<HTMLElement>('[data-rotating-words]')
        if (!rotatingSpan) return

        const rawWords = rotatingSpan.getAttribute('data-rotating-words') || ''
        const words = rawWords.split(',').map((w) => w.trim()).filter(Boolean)
        if (!words.length) return

        const wrapper = document.createElement('span')
        wrapper.className = 'rotating-text__inner'

        const wordEls = words.map((word) => {
          const el = document.createElement('span')
          el.className = 'rotating-text__word'
          el.textContent = word
          wrapper.appendChild(el)
          return el
        })

        rotatingSpan.textContent = ''
        rotatingSpan.appendChild(wrapper)

        requestAnimationFrame(() => {
          const inDuration = 0.75
          const outDuration = 0.6

          gsap.set(wordEls, { yPercent: 150, autoAlpha: 0 })

          let activeIndex = 0
          const firstWord = wordEls[activeIndex]
          gsap.set(firstWord, { yPercent: 0, autoAlpha: 1 })

          const firstWidth = firstWord.getBoundingClientRect().width
          wrapper.style.width = firstWidth + 'px'

          function showNext() {
            const nextIndex = (activeIndex + 1) % wordEls.length
            const prev = wordEls[activeIndex]
            const current = wordEls[nextIndex]
            const targetWidth = current.getBoundingClientRect().width

            gsap.to(wrapper, { width: targetWidth, duration: inDuration, ease: 'power4.inOut' })

            if (prev && prev !== current) {
              gsap.to(prev, { yPercent: -150, autoAlpha: 0, duration: outDuration, ease: 'power4.inOut' })
            }

            gsap.fromTo(current,
              { yPercent: 150, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: inDuration, ease: 'power4.inOut' },
            )

            activeIndex = nextIndex
            gsap.delayedCall(stepDuration, showNext)
          }

          if (wordEls.length > 1) {
            gsap.delayedCall(stepDuration, showNext)
          }
        })
      },
    })
  })
}

export function RotatingTextProvider({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => {
    document.fonts.ready.then(() => initRotatingText())
  }, []))

  return <>{children}</>
}

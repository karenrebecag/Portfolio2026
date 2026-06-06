import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText, ScrollTrigger)

type ManagedRotating = {
  fingerprint: string
  cleanup: () => void
}

const activeRotating = new Set<HTMLElement>()
const managedRotating = new Map<HTMLElement, ManagedRotating>()

function getRotatingFingerprint(heading: HTMLElement): string {
  const words = heading.querySelector('[data-rotating-words]')?.getAttribute('data-rotating-words') ?? ''
  const duration = heading.getAttribute('data-step-duration') ?? ''
  const text = heading.textContent?.trim() ?? ''
  return `${words}|${duration}|${text}`
}

function destroyRotating(heading: HTMLElement) {
  const managed = managedRotating.get(heading)
  if (!managed) return
  managed.cleanup()
  managedRotating.delete(heading)
  activeRotating.delete(heading)
}

export function destroyAllRotatingText() {
  for (const heading of activeRotating) {
    destroyRotating(heading)
  }
  activeRotating.clear()
}

function mountRotatingText(heading: HTMLElement) {
  const fingerprint = getRotatingFingerprint(heading)
  const existing = managedRotating.get(heading)

  if (existing?.fingerprint === fingerprint) {
    return
  }

  if (existing) {
    destroyRotating(heading)
  }

  const stepDuration = parseFloat(heading.getAttribute('data-step-duration') || '1.75')
  const delayedCalls: gsap.core.Tween[] = []
  const scrollTriggers: ScrollTrigger[] = []
  let isVisible = false
  let activeIndex = 0
  let wordEls: HTMLElement[] = []
  let wrapper: HTMLSpanElement | null = null

  const splitInstance = SplitText.create(heading, {
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

      wrapper = document.createElement('span')
      wrapper.className = 'rotating-text__inner'

      wordEls = words.map((word) => {
        const el = document.createElement('span')
        el.className = 'rotating-text__word'
        el.textContent = word
        wrapper!.appendChild(el)
        return el
      })

      rotatingSpan.textContent = ''
      rotatingSpan.appendChild(wrapper)

      requestAnimationFrame(() => {
        if (!wrapper) return
        const inDuration = 0.75
        const outDuration = 0.6

        gsap.set(wordEls, { yPercent: 150, autoAlpha: 0 })

        activeIndex = 0
        const firstWord = wordEls[activeIndex]
        gsap.set(firstWord, { yPercent: 0, autoAlpha: 1 })
        wrapper.style.width = `${firstWord.getBoundingClientRect().width}px`
        heading.setAttribute('data-rotating-ready', '')

        function showNext() {
          if (!isVisible || wordEls.length <= 1) return

          const nextIndex = (activeIndex + 1) % wordEls.length
          const prev = wordEls[activeIndex]
          const current = wordEls[nextIndex]
          const targetWidth = current.getBoundingClientRect().width

          gsap.to(wrapper, { width: targetWidth, duration: inDuration, ease: 'power4.inOut' })

          if (prev && prev !== current) {
            gsap.to(prev, { yPercent: -150, autoAlpha: 0, duration: outDuration, ease: 'power4.inOut' })
          }

          gsap.fromTo(
            current,
            { yPercent: 150, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: inDuration, ease: 'power4.inOut' },
          )

          activeIndex = nextIndex
          delayedCalls.push(gsap.delayedCall(stepDuration, showNext))
        }

        function scheduleLoop() {
          delayedCalls.forEach((call) => call.kill())
          delayedCalls.length = 0
          if (isVisible && wordEls.length > 1) {
            delayedCalls.push(gsap.delayedCall(stepDuration, showNext))
          }
        }

        const visibility = ScrollTrigger.create({
          trigger: heading,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            isVisible = true
            scheduleLoop()
          },
          onEnterBack: () => {
            isVisible = true
            scheduleLoop()
          },
          onLeave: () => {
            isVisible = false
            delayedCalls.forEach((call) => call.kill())
            delayedCalls.length = 0
            gsap.killTweensOf(wordEls)
            gsap.killTweensOf(wrapper)
          },
          onLeaveBack: () => {
            isVisible = false
            delayedCalls.forEach((call) => call.kill())
            delayedCalls.length = 0
            gsap.killTweensOf(wordEls)
            gsap.killTweensOf(wrapper)
          },
        })
        scrollTriggers.push(visibility)
      })
    },
  })

  const cleanup = () => {
    scrollTriggers.forEach((st) => st.kill())
    scrollTriggers.length = 0
    delayedCalls.forEach((call) => call.kill())
    delayedCalls.length = 0
    gsap.killTweensOf(heading.querySelectorAll('.rotating-text__word, .rotating-text__inner'))
    splitInstance.kill()
    splitInstance.revert()
    heading.removeAttribute('data-rotating-ready')
    gsap.set(heading, { clearProps: 'all' })
  }

  managedRotating.set(heading, { fingerprint, cleanup })
  activeRotating.add(heading)
}

export function initRotatingText(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-rotating-title]').forEach(mountRotatingText)
}
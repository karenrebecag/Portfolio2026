import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const IMAGE_CLIP_HIDDEN = 'circle(0% at 50% 50%)'
const IMAGE_CLIP_VISIBLE = 'circle(50% at 50% 50%)'

type Slide = {
  item: HTMLElement
  image: HTMLElement | null
  splitTargets: HTMLElement[]
  splitInstances: SplitText[]
}

export type TestimonialSlider = {
  destroy: () => void
  next: () => void
  prev: () => void
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function linesOf(slide: Slide): Element[] {
  return slide.splitInstances.flatMap((instance) => instance.lines)
}

/** Osmo "Line Reveal Testimonials" — one active slide, line-by-line swap. */
export function initTestimonialSlider(wrap: HTMLElement): TestimonialSlider {
  const noop: TestimonialSlider = { destroy: () => {}, next: () => {}, prev: () => {} }

  const list = wrap.querySelector<HTMLElement>('[data-testimonial-list]')
  if (!list) return noop

  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-testimonial-item]'))
  if (!items.length) return noop

  const elCurrent = wrap.querySelector<HTMLElement>('[data-current]')
  const elTotal = wrap.querySelector<HTMLElement>('[data-total]')
  if (elTotal) elTotal.textContent = pad(items.length)

  let activeIndex = items.findIndex((el) => el.classList.contains('is--active'))
  if (activeIndex < 0) activeIndex = 0

  let isAnimating = false
  let isInView = true
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const autoplayEnabled = wrap.getAttribute('data-autoplay') === 'true'
  const autoplayDuration = parseInt(wrap.getAttribute('data-autoplay-duration') || '', 10) || 5000
  let autoplayCall: gsap.core.Tween | null = null

  const slides: Slide[] = items.map((item) => ({
    item,
    image: item.querySelector<HTMLElement>('[data-testimonial-img]'),
    splitTargets: [
      item.querySelector<HTMLElement>('[data-testimonial-text]'),
      ...Array.from(item.querySelectorAll<HTMLElement>('[data-testimonial-split]')),
    ].filter((el): el is HTMLElement => el !== null),
    splitInstances: [],
  }))

  function setSlideState(slideIndex: number, isActive: boolean) {
    const { item } = slides[slideIndex]
    item.classList.toggle('is--active', isActive)
    item.setAttribute('aria-hidden', String(!isActive))
    gsap.set(item, { autoAlpha: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' })
  }

  function updateCounter() {
    if (elCurrent) elCurrent.textContent = pad(activeIndex + 1)
  }

  function startAutoplay() {
    if (!autoplayEnabled) return
    if (autoplayCall) autoplayCall.kill()
    autoplayCall = gsap.delayedCall(autoplayDuration / 1000, () => {
      if (!isInView || isAnimating) {
        startAutoplay()
        return
      }
      goTo((activeIndex + 1) % slides.length)
      startAutoplay()
    })
  }
  function pauseAutoplay() {
    autoplayCall?.pause()
  }
  function resumeAutoplay() {
    if (!autoplayEnabled) return
    if (!autoplayCall) startAutoplay()
    else autoplayCall.resume()
  }
  function resetAutoplay() {
    if (autoplayEnabled) startAutoplay()
  }

  slides.forEach((_, i) => setSlideState(i, i === activeIndex))
  updateCounter()

  slides.forEach((slide, slideIndex) => {
    slide.splitInstances = slide.splitTargets.map((el) =>
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'text-line',
        autoSplit: true,
        onSplit(self) {
          if (reduceMotion) return
          const isActive = slideIndex === activeIndex
          gsap.set(self.lines, { yPercent: isActive ? 0 : 110 })
          if (slide.image) {
            gsap.set(slide.image, { clipPath: isActive ? IMAGE_CLIP_VISIBLE : IMAGE_CLIP_HIDDEN })
          }
        },
      }),
    )
  })

  function goTo(nextIndex: number) {
    if (isAnimating || nextIndex === activeIndex) return
    isAnimating = true

    const outgoing = slides[activeIndex]
    const incoming = slides[nextIndex]

    const tl = gsap.timeline({
      onComplete: () => {
        setSlideState(activeIndex, false)
        setSlideState(nextIndex, true)
        activeIndex = nextIndex
        updateCounter()
        isAnimating = false
      },
    })

    if (reduceMotion) {
      tl.to(outgoing.item, { autoAlpha: 0, duration: 0.4, ease: 'power2' }, 0).fromTo(
        incoming.item,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: 'power2' },
        0,
      )
      return
    }

    const outgoingLines = linesOf(outgoing)
    const incomingLines = linesOf(incoming)

    gsap.set(incoming.item, { autoAlpha: 1, pointerEvents: 'auto' })
    gsap.set(incomingLines, { yPercent: 110 })
    if (outgoing.image) gsap.set(outgoing.image, { clipPath: IMAGE_CLIP_VISIBLE })

    tl.to(outgoingLines, {
      yPercent: -110,
      duration: 0.6,
      ease: 'power4.inOut',
      stagger: { amount: 0.25 },
    }, 0)

    if (outgoing.image) {
      tl.to(outgoing.image, { clipPath: IMAGE_CLIP_HIDDEN, duration: 0.6, ease: 'power4.inOut' }, 0)
    }

    tl.to(incomingLines, {
      yPercent: 0,
      duration: 0.7,
      ease: 'power4.inOut',
      stagger: { amount: 0.4 },
    }, '>-=0.3')

    if (incoming.image) {
      tl.fromTo(
        incoming.image,
        { clipPath: IMAGE_CLIP_HIDDEN },
        { clipPath: IMAGE_CLIP_VISIBLE, duration: 0.75, ease: 'power4.inOut' },
        '<',
      )
    }

    tl.set(outgoing.item, { autoAlpha: 0 }, '>')
  }

  function next() {
    resetAutoplay()
    goTo((activeIndex + 1) % slides.length)
  }
  function prev() {
    resetAutoplay()
    goTo((activeIndex - 1 + slides.length) % slides.length)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!isInView) return
    const target = e.target as HTMLElement | null
    const isTyping =
      !!target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
    if (isTyping) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  window.addEventListener('keydown', onKeyDown)

  const scrollTrigger = ScrollTrigger.create({
    trigger: wrap,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => {
      isInView = true
      resumeAutoplay()
    },
    onEnterBack: () => {
      isInView = true
      resumeAutoplay()
    },
    onLeave: () => {
      isInView = false
      pauseAutoplay()
    },
    onLeaveBack: () => {
      isInView = false
      pauseAutoplay()
    },
  })

  startAutoplay()

  return {
    next,
    prev,
    destroy() {
      autoplayCall?.kill()
      window.removeEventListener('keydown', onKeyDown)
      scrollTrigger.kill()
      slides.forEach((slide) => slide.splitInstances.forEach((instance) => instance.revert()))
    },
  }
}

import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Observer, ScrollTrigger)

type MarqueeCleanup = () => void

const activeMarquees = new Map<HTMLElement, MarqueeCleanup>()

export function teardownMarquee(wrapper: HTMLElement) {
  const cleanup = activeMarquees.get(wrapper)
  if (!cleanup) return
  cleanup()
  activeMarquees.delete(wrapper)
  wrapper.removeAttribute('data-draggable-marquee-init')
}

export function destroyAllDraggableMarquees(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-draggable-marquee-init]').forEach(teardownMarquee)
}

export function mountMarquee(wrapper: HTMLElement) {
  if (activeMarquees.has(wrapper)) return

  const collection = wrapper.querySelector<HTMLElement>('[data-draggable-marquee-collection]')
  const list = wrapper.querySelector<HTMLElement>('[data-draggable-marquee-list]')
  if (!collection || !list) return

  const duration = parseFloat(wrapper.getAttribute('data-duration') || '20') || 20
  const multiplier = parseFloat(wrapper.getAttribute('data-multiplier') || '35') || 35
  const sensitivity = parseFloat(wrapper.getAttribute('data-sensitivity') || '0.01') || 0.01

  const wrapperWidth = wrapper.getBoundingClientRect().width
  const listWidth = list.scrollWidth || list.getBoundingClientRect().width
  if (!wrapperWidth || !listWidth) return

  const minRequiredWidth = wrapperWidth + listWidth + 2
  let cloneGuard = 0
  while (collection.scrollWidth < minRequiredWidth && cloneGuard < 12) {
    const clone = list.cloneNode(true) as HTMLElement
    clone.setAttribute('data-draggable-marquee-clone', '')
    clone.setAttribute('aria-hidden', 'true')
    collection.appendChild(clone)
    cloneGuard += 1
  }

  const wrapX = gsap.utils.wrap(-listWidth, 0)
  gsap.set(collection, { x: 0 })

  const marqueeLoop = gsap.to(collection, {
    x: -listWidth,
    duration,
    ease: 'none',
    repeat: -1,
    paused: true,
    onReverseComplete: () => marqueeLoop.progress(1),
    modifiers: { x: (x: string) => wrapX(parseFloat(x)) + 'px' },
  })

  const baseDirection = (wrapper.getAttribute('data-direction') || 'left').toLowerCase() === 'right' ? -1 : 1
  const timeScale = { value: baseDirection }
  wrapper.setAttribute('data-direction', baseDirection < 0 ? 'right' : 'left')
  if (baseDirection < 0) marqueeLoop.progress(1)

  function applyTimeScale() {
    marqueeLoop.timeScale(timeScale.value)
    wrapper.setAttribute('data-direction', timeScale.value < 0 ? 'right' : 'left')
  }

  applyTimeScale()

  const marqueeObserver = Observer.create({
    target: wrapper,
    type: 'pointer,touch',
    preventDefault: true,
    debounce: true,
    onChangeX: (e: { velocityX: number }) => {
      let v = e.velocityX * -sensitivity
      v = gsap.utils.clamp(-multiplier, multiplier, v)
      gsap.killTweensOf(timeScale)
      const rest = v < 0 ? -1 : 1
      gsap.timeline({ onUpdate: applyTimeScale })
        .to(timeScale, { value: v, duration: 0.1, overwrite: true })
        .to(timeScale, { value: rest, duration: 1.0 })
    },
  })

  marqueeObserver.disable()

  const visibility = ScrollTrigger.create({
    trigger: wrapper,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => {
      marqueeLoop.play()
      applyTimeScale()
      marqueeObserver.enable()
    },
    onEnterBack: () => {
      marqueeLoop.play()
      applyTimeScale()
      marqueeObserver.enable()
    },
    onLeave: () => {
      marqueeLoop.pause()
      marqueeObserver.disable()
    },
    onLeaveBack: () => {
      marqueeLoop.pause()
      marqueeObserver.disable()
    },
  })

  wrapper.setAttribute('data-draggable-marquee-init', 'initialized')

  const cleanup: MarqueeCleanup = () => {
    visibility.kill()
    marqueeObserver.kill()
    marqueeLoop.kill()
    gsap.killTweensOf(timeScale)
    collection.querySelectorAll('[data-draggable-marquee-clone]').forEach((node) => node.remove())
    gsap.set(collection, { clearProps: 'x' })
  }

  activeMarquees.set(wrapper, cleanup)
}

export function initDraggableMarquees(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-draggable-marquee-init]').forEach((wrapper) => {
    if (wrapper.getAttribute('data-draggable-marquee-init') === 'initialized') {
      teardownMarquee(wrapper)
    }
    mountMarquee(wrapper)
  })
}
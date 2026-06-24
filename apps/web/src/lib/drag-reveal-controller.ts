import gsap from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

type DragRevealCleanup = () => void

const activeGalleries = new Map<HTMLElement, DragRevealCleanup>()

interface ItemData {
  el: HTMLElement
  offsetLeft: number
  width: number
}

export function teardownDragReveal(wrapper: HTMLElement) {
  const cleanup = activeGalleries.get(wrapper)
  if (!cleanup) return
  cleanup()
  activeGalleries.delete(wrapper)
  wrapper.removeAttribute('data-drag-reveal-init')
}

export function destroyAllDragReveal(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-drag-reveal-init]').forEach(teardownDragReveal)
}

export function mountDragReveal(wrapper: HTMLElement) {
  if (activeGalleries.has(wrapper)) return

  const trackEl = wrapper.querySelector<HTMLElement>('[data-drag-reveal-track]')
  if (!trackEl) return
  const track: HTMLElement = trackEl

  // La sección de home es `hidden md:block`; sin ancho no hay nada que medir.
  if (!wrapper.clientWidth) return

  let viewportWidth = wrapper.clientWidth
  const inViewport = new Set<HTMLElement>()
  let total = 0
  let oldX = 0

  const items: ItemData[] = Array.from(
    track.querySelectorAll<HTMLElement>('[data-drag-reveal-item]'),
  ).map((el) => ({
    el,
    offsetLeft: el.offsetLeft,
    width: el.offsetWidth,
  }))

  items.forEach(({ el, offsetLeft, width }) => {
    if (offsetLeft < viewportWidth && offsetLeft + width > 0) {
      inViewport.add(el)
    } else {
      gsap.set(el, { autoAlpha: 0 })
    }
  })

  const xTo = gsap.quickTo(track, 'x', {
    duration: 0.5,
    ease: 'power4',
    onUpdate: checkViewport,
  })

  function checkViewport() {
    const currentX = gsap.getProperty(track, 'x') as number
    const delta = currentX - oldX
    if (delta === 0) return
    oldX = currentX

    items.forEach(({ el, offsetLeft, width }) => {
      const left = offsetLeft + currentX
      const isInView = left < viewportWidth && left + width > 0

      if (isInView && !inViewport.has(el)) {
        inViewport.add(el)

        const direction = Math.sign(delta)
        const xFrom = direction * (-100 / (1 + delta / 500))

        gsap.fromTo(
          el,
          { x: xFrom * 4, scale: 0.6, autoAlpha: 1 },
          { x: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        )
      } else if (!isInView && inViewport.has(el)) {
        inViewport.delete(el)
        gsap.set(el, { autoAlpha: 0 })
      }
    })
  }

  let isTouch = false
  const mm = gsap.matchMedia()
  mm.add('(hover: none)', () => {
    isTouch = true
  })

  const observer = Observer.create({
    target: wrapper,
    type: 'touch,pointer',
    onDrag: (self: { deltaX: number }) => {
      total += isTouch ? self.deltaX * 1.5 : self.deltaX * 1.4
      total = gsap.utils.clamp(viewportWidth - track.scrollWidth, 0, total)
      xTo(total)
    },
  })

  function handleResize() {
    viewportWidth = wrapper.clientWidth
    items.forEach((item) => {
      item.offsetLeft = item.el.offsetLeft
      item.width = item.el.offsetWidth
    })
    total = gsap.utils.clamp(viewportWidth - track.scrollWidth, 0, total)
    xTo(total)
  }

  window.addEventListener('resize', handleResize)

  wrapper.setAttribute('data-drag-reveal-init', 'initialized')

  const cleanup: DragRevealCleanup = () => {
    window.removeEventListener('resize', handleResize)
    observer.kill()
    mm.kill()
    gsap.killTweensOf(track)
    items.forEach(({ el }) => gsap.set(el, { clearProps: 'all' }))
    gsap.set(track, { clearProps: 'x' })
  }

  activeGalleries.set(wrapper, cleanup)
}

export function initDragReveal(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-drag-reveal-init]').forEach((wrapper) => {
    if (wrapper.getAttribute('data-drag-reveal-init') === 'initialized') {
      teardownDragReveal(wrapper)
    }
    mountDragReveal(wrapper)
  })
}

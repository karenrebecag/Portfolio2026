import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type MarqueeCleanup = () => void

// WeakMap: keys are garbage-collected when the element leaves the DOM.
const activeMarquees = new WeakMap<HTMLElement, MarqueeCleanup>()
// Strong set needed only to support destroyAll iteration.
const mountedSet = new Set<HTMLElement>()

function speedMultiplier() {
  if (typeof window === 'undefined') return 1
  if (window.innerWidth < 479) return 0.25
  if (window.innerWidth < 991) return 0.5
  return 1
}

export function teardownMarqueeScrollDirection(marquee: HTMLElement) {
  const cleanup = activeMarquees.get(marquee)
  if (!cleanup) return
  cleanup()
  activeMarquees.delete(marquee)
  mountedSet.delete(marquee)
  marquee.removeAttribute('data-marquee-mounted')
}

export function destroyAllMarqueeScrollDirections(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-marquee-scroll-direction-target]').forEach(teardownMarqueeScrollDirection)
}

function mountMarqueeScrollDirection(marquee: HTMLElement) {
  if (activeMarquees.has(marquee)) return

  const marqueeContent = marquee.querySelector<HTMLElement>('[data-marquee-collection-target]')
  const marqueeScroll = marquee.querySelector<HTMLElement>('[data-marquee-scroll-target]')
  if (!marqueeContent || !marqueeScroll) return

  const {
    marqueeSpeed: speed = '15',
    marqueeDirection: direction = 'left',
    marqueeDuplicate: duplicate = '0',
    marqueeScrollSpeed: scrollSpeed = '10',
  } = marquee.dataset

  const marqueeSpeedAttr = parseFloat(speed)
  const marqueeDirectionAttr = direction === 'right' ? 1 : -1
  const authorDuplicate = parseInt(duplicate, 10) || 0
  const scrollSpeedAttr = parseFloat(scrollSpeed)
  const hasScrollEffect = scrollSpeedAttr > 0

  const contentWidth = marqueeContent.offsetWidth || 1
  let marqueeSpeed =
    marqueeSpeedAttr * (contentWidth / window.innerWidth) * speedMultiplier()

  if (!Number.isFinite(marqueeSpeed) || marqueeSpeed <= 0) marqueeSpeed = marqueeSpeedAttr

  if (hasScrollEffect) {
    marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`
    marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`
  }

  // The xPercent:-100 loop only stays gapless if the tiled copies span more
  // than one viewport with a full copy to spare during the wrap. When the
  // content is narrower than the screen, the author's duplicate count isn't
  // enough and the trailing edge runs dry. Raise it to cover 2x the viewport.
  const railWidth = hasScrollEffect
    ? window.innerWidth * (scrollSpeedAttr * 2 + 100) / 100
    : window.innerWidth
  const minCopies = Math.max(2, Math.ceil((railWidth * 2) / contentWidth))
  const duplicateAmount = Math.max(authorDuplicate, minCopies - 1)

  marqueeScroll.querySelectorAll('[data-marquee-duplicate-clone]').forEach((node) => node.remove())

  if (duplicateAmount > 0) {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < duplicateAmount; i++) {
      const clone = marqueeContent.cloneNode(true) as HTMLElement
      clone.setAttribute('data-marquee-duplicate-clone', '')
      clone.setAttribute('aria-hidden', 'true')
      fragment.appendChild(clone)
    }
    marqueeScroll.appendChild(fragment)
  }

  const marqueeItems = marquee.querySelectorAll<HTMLElement>('[data-marquee-collection-target]')
  if (!marqueeItems.length) return

  const animation = gsap.to(marqueeItems, {
    xPercent: -100,
    repeat: -1,
    duration: marqueeSpeed,
    ease: 'linear',
  })
  animation.totalProgress(0.5)

  gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 })
  animation.timeScale(marqueeDirectionAttr)
  animation.play()

  marquee.setAttribute('data-marquee-status', 'normal')

  // A fixed element has no meaningful scroll-position range: ScrollTrigger
  // computes its start/end from the rect, which never moves, and every
  // ScrollTrigger.refresh() reanchors it to the current scrollY — leaving the
  // play/pause and direction triggers permanently desynced. Track direction
  // across the whole page instead, and never pause (the bar is always mounted;
  // the component hides it via transform).
  const isFixed = getComputedStyle(marquee).position === 'fixed'

  function applyDirection(self: ScrollTrigger) {
    const isInverted = self.direction === 1
    const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr
    animation.timeScale(currentDirection)
    marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted')
  }

  const directionTrigger = isFixed
    ? ScrollTrigger.create({ onUpdate: applyDirection })
    : ScrollTrigger.create({
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: applyDirection,
      })

  const visibilityTrigger = isFixed
    ? null
    : ScrollTrigger.create({
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => animation.play(),
        onEnterBack: () => animation.play(),
        onLeave: () => animation.pause(),
        onLeaveBack: () => animation.pause(),
      })

  // Skip scroll parallax for fixed elements or when scroll-speed is 0 —
  // a fixed element's trigger position is unreliable and leaves the tween
  // stuck at a permanent offset.
  let scrollTween: gsap.core.Timeline | null = null

  if (hasScrollEffect && !isFixed) {
    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr
    const scrollEnd = -scrollStart

    scrollTween = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0,
      },
    })
    scrollTween.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' })
  }

  marquee.setAttribute('data-marquee-mounted', 'true')

  const cleanup: MarqueeCleanup = () => {
    directionTrigger.kill()
    visibilityTrigger?.kill()
    scrollTween?.scrollTrigger?.kill()
    scrollTween?.kill()
    animation.kill()
    gsap.set(marqueeItems, { clearProps: 'xPercent' })
    gsap.set(marqueeScroll, { clearProps: 'x,marginLeft,width' })
    marqueeScroll.querySelectorAll('[data-marquee-duplicate-clone]').forEach((node) => node.remove())
    marquee.removeAttribute('data-marquee-status')
    marquee.removeAttribute('data-marquee-mounted')
  }

  activeMarquees.set(marquee, cleanup)
  mountedSet.add(marquee)
}

export function initMarqueeScrollDirection(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-marquee-scroll-direction-target]').forEach((marquee) => {
    teardownMarqueeScrollDirection(marquee)
    mountMarqueeScrollDirection(marquee)
  })
  ScrollTrigger.refresh()
}

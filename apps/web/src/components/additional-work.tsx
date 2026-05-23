'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Observer, ScrollTrigger)

const QUICK_PROJECTS = [
  { title: 'Ingles Individual', type: 'Fullstack Platform', url: 'https://www.figma.com/design/wOLxrlsIUMvcRJyOzgjIoD', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/InglesIndividualFrontend.webp' },
  { title: 'JarvioAI Canvas', type: 'UI Prototype', url: 'https://github.com/karenrebecag/JarvioPrototype', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/ChatGPT%20Image%20Sep%2029%2C%202025%2C%2011_13_13%20AM.webp' },
  { title: 'ToTou Energy Bars', type: 'Complete Site', url: 'https://www.figma.com/proto/XrmpPR40YlSaTVcTuNR4Hr', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/ToYou.webp' },
  { title: 'Cadence OTC', type: 'E-Commerce', url: 'https://www.figma.com/proto/DL7gTFQHcZpLk9qdMLnPjF', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/cadenceotp.webp' },
  { title: 'Metaverse Dashboard', type: 'Landing Page', url: 'https://www.figma.com/design/2EkRHWv6kzGtflVeymrd52', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/metaverse.webp' },
  { title: 'Health-Ade Kombucha', type: 'E-Commerce', url: 'https://health-ade.com/', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/HealtAde.webp' },
  { title: 'Ancient Tech', type: 'Complete Site', url: 'https://www.figma.com/design/wOLxrlsIUMvcRJyOzgjIoD', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/AncientTech.webp' },
  { title: 'Zachariel Banking', type: 'Fintech', url: 'https://www.figma.com/design/B5hLcZbHpNdXNf0KZDcNEL', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/Zachariel.webp' },
  { title: 'AWE MX', type: 'Community', url: 'https://awexr.mx/', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/AWEMX.webp' },
]

function initDraggableMarquee() {
  const wrappers = document.querySelectorAll<HTMLElement>('[data-draggable-marquee-init]')

  wrappers.forEach((wrapper) => {
    if (wrapper.getAttribute('data-draggable-marquee-init') === 'initialized') return

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
    while (collection.scrollWidth < minRequiredWidth) {
      const clone = list.cloneNode(true) as HTMLElement
      clone.setAttribute('data-draggable-marquee-clone', '')
      clone.setAttribute('aria-hidden', 'true')
      collection.appendChild(clone)
    }

    const wrapX = gsap.utils.wrap(-listWidth, 0)
    gsap.set(collection, { x: 0 })

    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: 'none',
      repeat: -1,
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
      debounce: false,
      onChangeX: (e: any) => {
        let v = e.velocityX * -sensitivity
        v = gsap.utils.clamp(-multiplier, multiplier, v)
        gsap.killTweensOf(timeScale)
        const rest = v < 0 ? -1 : 1
        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: v, duration: 0.1, overwrite: true })
          .to(timeScale, { value: rest, duration: 1.0 })
      },
    })

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable() },
      onEnterBack: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable() },
      onLeave: () => { marqueeLoop.pause(); marqueeObserver.disable() },
      onLeaveBack: () => { marqueeLoop.pause(); marqueeObserver.disable() },
    })

    wrapper.setAttribute('data-draggable-marquee-init', 'initialized')
  })
}

export function AdditionalWorkMarquee() {
  useEffect(() => {
    function start() {
      initDraggableMarquee()
    }

    if (document.body.hasAttribute('data-page-ready')) {
      start()
    } else {
      document.addEventListener('page-ready', start, { once: true })
    }

    document.addEventListener('page-navigation-complete', start)
    return () => document.removeEventListener('page-navigation-complete', start)
  }, [])

  return (
    <div
      data-draggable-marquee-init
      data-direction="left"
      data-duration="45"
      data-multiplier="35"
      data-sensitivity="0.01"
      className="draggable-marquee mt-16"
      data-cursor="Drag"
    >
      <div data-draggable-marquee-collection className="draggable-marquee__collection">
        <div data-draggable-marquee-list className="draggable-marquee__list">
          {QUICK_PROJECTS.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="draggable-marquee__item group"
            >
              <img draggable={false} loading="eager" src={item.image} alt={item.title} className="draggable-marquee__item-img" />
              <div className="draggable-marquee__item-overlay">
                <span className="item-tag">{item.type}</span>
                <span className="block text-base font-bold text-surface-foreground mt-2">{item.title}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useCallback } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { usePageInit } from '@/lib/use-page-init'

gsap.registerPlugin(Observer)

const IMAGES = [
  { src: '/gallery/1.webp', landscape: false },
  { src: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/me.webp', landscape: false },
  { src: '/gallery/2.webp', landscape: true },
  { src: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/jj.webp', landscape: true },
  { src: '/gallery/3.webp', landscape: false },
  { src: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Artboard%201.webp', landscape: true },
  { src: '/gallery/3.webp', landscape: false },
  { src: '/gallery/4.webp', landscape: false },
  { src: '/gallery/5.webp', landscape: false },
  { src: '/gallery/6.webp', landscape: false },
  { src: '/gallery/7.webp', landscape: true },
  { src: '/gallery/8.webp', landscape: false },
]

function initInfiniteDraggableGrid() {
  const wrappers = document.querySelectorAll<HTMLElement>('[data-infinite-grid-init]')

  const wheelSpeed = 0.75
  const dragSpeed = 1.25

  const cleanups: (() => void)[] = []

  wrappers.forEach((wrapper) => {
    const collection = wrapper.querySelector<HTMLElement>('[data-infinite-grid-collection]')
    const sourceList = wrapper.querySelector<HTMLElement>('[data-infinite-grid-list]')
    const originalItems = Array.from(sourceList?.querySelectorAll<HTMLElement>('[data-infinite-grid-item]') || [])

    if (!collection || !sourceList || !originalItems.length) return

    let observer: Observer | null = null
    let resizeTimer: ReturnType<typeof setTimeout>
    let scrollTimeout: ReturnType<typeof setTimeout>
    let hasMouseLeaveListener = false
    let tileWidth = 0
    let tileHeight = 0
    let currentX = 0
    let currentY = 0
    let xTo: ReturnType<typeof gsap.quickTo>
    let yTo: ReturnType<typeof gsap.quickTo>

    function setStatus(status: string) {
      wrapper.setAttribute('data-infinite-grid-status', status)
    }

    function handleMouseLeave() {
      setStatus('idle')
      if (observer) {
        observer.disable()
        observer.enable()
      }
    }

    function handleMovement(self: Observer, axis: 'x' | 'y') {
      const isWheel = (self.event as Event).type === 'wheel'

      if (isWheel) {
        setStatus('scrolling')
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => setStatus('idle'), 200)
      }

      const multiplier = isWheel ? wheelSpeed : dragSpeed
      const delta = gsap.utils.clamp(-80, 80, self[`delta${axis.toUpperCase() as 'X' | 'Y'}`] * multiplier)

      if (axis === 'x') {
        currentX += isWheel ? -delta : delta
        xTo(currentX)
      } else {
        currentY += isWheel ? -delta : delta
        yTo(currentY)
      }
    }

    function setGrid() {
      const lists = Array.from(collection!.querySelectorAll<HTMLElement>('[data-infinite-grid-list]'))
      const firstList = lists[0]
      if (!firstList) return

      const firstItem = firstList.querySelector<HTMLElement>('[data-infinite-grid-item]')
      if (!firstItem) return

      const listRect = firstList.getBoundingClientRect()
      const itemRect = firstItem.getBoundingClientRect()

      tileWidth = listRect.width
      tileHeight = listRect.height

      const itemHeight = itemRect.height

      gsap.set(lists[0], { xPercent: 0, yPercent: 0 })
      gsap.set(lists[1], { xPercent: 100, yPercent: 0 })
      gsap.set(lists[2], { xPercent: 0, yPercent: 100 })
      gsap.set(lists[3], { xPercent: 100, yPercent: 100 })

      const wrapX = gsap.utils.wrap(-tileWidth, 0)
      const wrapY = gsap.utils.wrap(-tileHeight, 0)

      currentX = wrapX((wrapper.clientWidth - tileWidth) * 0.5)
      currentY = wrapY((wrapper.clientHeight - itemHeight) * 0.5)

      xTo = gsap.quickTo(collection!, 'x', {
        duration: 1.2,
        ease: 'expo.out',
        modifiers: { x: gsap.utils.unitize(wrapX) },
      })

      yTo = gsap.quickTo(collection!, 'y', {
        duration: 1.2,
        ease: 'expo.out',
        modifiers: { y: gsap.utils.unitize(wrapY) },
      })

      gsap.set(collection!, { x: currentX, y: currentY })

      requestAnimationFrame(() => setStatus('idle'))

      observer = Observer.create({
        target: wrapper,
        type: 'touch,pointer',
        preventDefault: true,
        dragMinimum: 3,
        onPress() { setStatus('dragging') },
        onRelease() { setStatus('idle') },
        onStop() { setStatus('idle') },
        onChangeX(self) { handleMovement(self, 'x') },
        onChangeY(self) { handleMovement(self, 'y') },
      })

      if (!hasMouseLeaveListener) {
        document.documentElement.addEventListener('mouseleave', handleMouseLeave)
        hasMouseLeaveListener = true
      }
    }

    function buildGrid() {
      if (observer) observer.kill()
      setStatus('loading')
      collection!.innerHTML = ''

      const measureItem = originalItems[0].cloneNode(true) as HTMLElement
      measureItem.style.position = 'absolute'
      measureItem.style.visibility = 'hidden'
      measureItem.style.pointerEvents = 'none'
      wrapper.appendChild(measureItem)

      const itemRect = measureItem.getBoundingClientRect()
      const itemWidth = itemRect.width
      const itemHeight = itemRect.height
      measureItem.remove()

      if (!itemWidth || !itemHeight) return

      const columns = Math.max(1, Math.ceil(wrapper.clientWidth / itemWidth) + 1)
      const rows = Math.max(1, Math.ceil(wrapper.clientHeight / itemHeight) + 1)
      const requiredItems = columns * rows
      const wantedItems = Math.max(requiredItems, originalItems.length)
      const itemsPerList = Math.ceil(wantedItems / columns) * columns
      const fragment = document.createDocumentFragment()

      for (let listIndex = 0; listIndex < 4; listIndex++) {
        const list = sourceList!.cloneNode(false) as HTMLElement
        list.style.setProperty('--grid-columns', String(columns))
        if (listIndex > 0) list.setAttribute('aria-hidden', 'true')

        for (let itemIndex = 0; itemIndex < itemsPerList; itemIndex++) {
          const item = originalItems[itemIndex % originalItems.length].cloneNode(true) as HTMLElement
          if (listIndex > 0) item.setAttribute('aria-hidden', 'true')
          list.appendChild(item)
        }
        fragment.appendChild(list)
      }

      collection!.appendChild(fragment)
      requestAnimationFrame(setGrid)
    }

    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => buildGrid(), 200)
    }

    window.addEventListener('resize', onResize)
    buildGrid()

    cleanups.push(() => {
      if (observer) observer.kill()
      window.removeEventListener('resize', onResize)
      if (hasMouseLeaveListener) {
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

export function InfiniteGrid() {
  usePageInit(useCallback(() => initInfiniteDraggableGrid(), []))

  return (
    <section
      data-infinite-grid-status="loading"
      data-infinite-grid-init=""
      className="infinite-grid"
    >
      <div data-infinite-grid-collection="" className="infinite-grid__collection">
        <div data-infinite-grid-list="" className="infinite-grid__list">
          {IMAGES.map((img, i) => (
            <div key={i} data-infinite-grid-item="" className="infinite-grid__item">
              <div className={`infinite-grid__card${img.landscape ? ' is--landscape' : ''}`}>
                <img
                  src={img.src}
                  loading="lazy"
                  alt=""
                  className="infinite-grid__card-img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

interface DraggableStickersProps {
  stickers: readonly { src: string; alt: string }[]
}

function initDraggableStickers() {
  if (window.matchMedia('(pointer: coarse)').matches) return

  const wrapper = document.querySelector<HTMLElement>('[data-sticker="wrap"]')
  const bounds = document.querySelector<HTMLElement>('[data-sticker-bounds]') || wrapper
  const items = document.querySelectorAll<HTMLElement>('[data-sticker="item"]')
  if (!wrapper || !items.length) return

  items.forEach((sticker) => {
    const initialRotation = gsap.utils.random(-15, 15)
    gsap.set(sticker, { rotation: initialRotation })

    Draggable.create(sticker, {
      bounds: bounds,
      dragResistance: 0.1,
      onPress() {
        gsap.to(this.target, {
          scale: 1.2,
          rotation: gsap.utils.random(-30, 30),
          filter: 'drop-shadow(0px 10px 8px rgba(0,0,0,0.3))',
          duration: 0.1,
        })
      },
      onRelease() {
        gsap.to(this.target, {
          scale: 1,
          rotation: initialRotation,
          ease: 'back.out(3)',
          filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))',
          duration: 0.2,
        })
      },
    })
  })
}

export function DraggableStickers({ stickers }: DraggableStickersProps) {
  useEffect(() => {
    function start() {
      initDraggableStickers()
    }

    if (document.body.hasAttribute('data-page-ready')) {
      start()
    } else {
      document.addEventListener('page-ready', start, { once: true })
    }

    function onNavigate() { start() }
    document.addEventListener('page-navigation-complete', onNavigate)

    return () => {
      document.removeEventListener('page-ready', start)
      document.removeEventListener('page-navigation-complete', onNavigate)
    }
  }, [])

  return (
    <div data-sticker="wrap" className="sticker-wrap">
      {stickers.map((s, i) => (
        <div
          key={i}
          data-sticker="item"
          data-cursor="Drag"
          className={`sticker-item sticker-item--${i + 1}`}
        >
          <img src={s.src} alt={s.alt} className="sticker-item__img" draggable={false} />
        </div>
      ))}
    </div>
  )
}

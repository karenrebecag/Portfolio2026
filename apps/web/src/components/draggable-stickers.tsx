'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { usePageInit } from '@/lib/use-page-init'

gsap.registerPlugin(Draggable)

interface DraggableStickersProps {
  stickers: readonly { src: string; alt: string }[]
}

function destroyDraggableStickers(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-sticker="item"]').forEach((sticker) => {
    Draggable.get(sticker)?.kill()
    gsap.killTweensOf(sticker)
    gsap.set(sticker, { clearProps: 'transform,filter' })
  })
}

function initDraggableStickers(root: ParentNode = document) {
  if (window.matchMedia('(pointer: coarse)').matches) return

  const wrapper = root.querySelector<HTMLElement>('[data-sticker="wrap"]')
  const bounds = root.querySelector<HTMLElement>('[data-sticker-bounds]') || wrapper
  const items = root.querySelectorAll<HTMLElement>('[data-sticker="item"]')
  if (!wrapper || !items.length) return

  items.forEach((sticker) => {
    if (Draggable.get(sticker)) return

    const initialRotation = gsap.utils.random(-15, 15)
    gsap.set(sticker, { rotation: initialRotation })

    Draggable.create(sticker, {
      bounds: bounds ?? undefined,
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
  const t = useTranslations('common')

  usePageInit(
    useCallback(() => {
      initDraggableStickers()
      return () => destroyDraggableStickers()
    }, []),
  )

  return (
    <div data-sticker="wrap" className="sticker-wrap">
      {stickers.map((s, i) => (
        <div
          key={i}
          data-sticker="item"
          data-cursor={t('drag')}
          className={`sticker-item sticker-item--${i + 1}`}
        >
          <img src={s.src} alt={s.alt} className="sticker-item__img" draggable={false} />
        </div>
      ))}
    </div>
  )
}
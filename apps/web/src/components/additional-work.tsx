'use client'

import { useCallback, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getAdditionalWorkItems, type AdditionalWorkItem } from '@/content/additional-work-items'
import { mountDragReveal, teardownDragReveal } from '@/lib/drag-reveal-controller'
import { usePageInit } from '@/lib/use-page-init'

interface MarqueeItem extends AdditionalWorkItem {}

interface DraggableMarqueeProps {
  items?: MarqueeItem[]
  className?: string
}

export function AdditionalWorkMarquee() {
  const locale = useLocale()
  const items = getAdditionalWorkItems(locale)
  return <DraggableMarqueeStrip items={items} />
}

export function DraggableMarqueeStrip({ items, className = '' }: DraggableMarqueeProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const resolvedItems = items ?? getAdditionalWorkItems(locale)
  const wrapperRef = useRef<HTMLDivElement>(null)

  usePageInit(
    useCallback(() => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      mountDragReveal(wrapper)
      return () => teardownDragReveal(wrapper)
    }, []),
  )

  return (
    <div
      ref={wrapperRef}
      data-drag-reveal-init=""
      className={`draggable-marquee ${className}`}
      data-cursor={t('drag')}
    >
      <div data-drag-reveal-track className="draggable-marquee__track">
        {resolvedItems.map((item) => {
          const Tag = item.url ? 'a' : 'div'
          const linkProps = item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {}
          return (
            <Tag
              key={item.title}
              {...linkProps}
              draggable={false}
              data-drag-reveal-item
              className="draggable-marquee__item group"
            >
              <img
                draggable={false}
                loading="lazy"
                decoding="async"
                src={item.image}
                alt={item.title}
                className="draggable-marquee__item-img"
              />
            </Tag>
          )
        })}
      </div>
    </div>
  )
}

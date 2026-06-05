'use client'

import { useCallback, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getAdditionalWorkItems, type AdditionalWorkItem } from '@/content/additional-work-items'
import { mountMarquee, teardownMarquee } from '@/lib/draggable-marquee-controller'
import { usePageInit } from '@/lib/use-page-init'

interface MarqueeItem extends AdditionalWorkItem {}

interface DraggableMarqueeProps {
  items?: MarqueeItem[]
  duration?: string
  className?: string
}

export function AdditionalWorkMarquee() {
  const locale = useLocale()
  const items = getAdditionalWorkItems(locale)
  return <DraggableMarqueeStrip items={items} />
}

export function DraggableMarqueeStrip({ items, duration = '45', className = '' }: DraggableMarqueeProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const tAdditional = useTranslations('additional')
  const resolvedItems = items ?? getAdditionalWorkItems(locale)
  const wrapperRef = useRef<HTMLDivElement>(null)

  usePageInit(
    useCallback(() => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      mountMarquee(wrapper)
      return () => teardownMarquee(wrapper)
    }, []),
  )

  return (
    <div
      ref={wrapperRef}
      data-draggable-marquee-init=""
      data-direction="left"
      data-duration={duration}
      data-multiplier="35"
      data-sensitivity="0.01"
      className={`draggable-marquee ${className}`}
      data-cursor={t('drag')}
    >
      <div data-draggable-marquee-collection className="draggable-marquee__collection">
        <div data-draggable-marquee-list className="draggable-marquee__list">
          {resolvedItems.map((item) => {
            const Tag = item.url ? 'a' : 'div'
            const linkProps = item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {}
            return (
              <Tag
                key={item.title}
                {...linkProps}
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
                <div className="draggable-marquee__item-overlay">
                  <span className="item-tag">{item.type}</span>
                  <span className="block text-base font-bold text-surface-foreground mt-2">{item.title}</span>
                  {(item.contributions || item.outcome) && (
                    <dl className="draggable-marquee__item-meta mt-3 space-y-1.5">
                      {item.contributions && (
                        <div>
                          <dt className="item-meta-label">{tAdditional('hover_contributions')}</dt>
                          <dd className="item-meta-value item-meta-value--emphasis">{item.contributions}</dd>
                        </div>
                      )}
                      {item.deliverable && (
                        <div>
                          <dt className="item-meta-label">{tAdditional('hover_deliverable')}</dt>
                          <dd className="item-meta-value">{item.deliverable}</dd>
                        </div>
                      )}
                      {item.outcome && (
                        <div>
                          <dt className="item-meta-label">{tAdditional('hover_outcome')}</dt>
                          <dd className="item-meta-value">{item.outcome}</dd>
                        </div>
                      )}
                      {item.stack && (
                        <div>
                          <dt className="item-meta-label">{tAdditional('hover_stack')}</dt>
                          <dd className="item-meta-value item-meta-value--muted">{item.stack}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </div>
              </Tag>
            )
          })}
        </div>
      </div>
    </div>
  )
}
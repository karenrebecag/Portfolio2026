'use client'

import { useCallback, type ComponentPropsWithoutRef } from 'react'
import { initTableOfContents } from '@/lib/toc'
import { initDisplayReadTime } from '@/lib/read-time'
import { usePageInit } from '@/lib/use-page-init'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins once for the TOC (and make them available globally for the init function)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // Expose on window so the data-attr init (which checks typeof ScrollTrigger) can find them
  ;(window as any).ScrollTrigger = ScrollTrigger
  ;(window as any).gsap = gsap
}

interface ArticleTOCRevealProps {
  stagger?: string
  start?: string
  distance?: string
}

interface ArticleTOCProps {
  title?: string
  levels?: string // "h2,h3"
  offset?: number
  children: React.ReactNode // the actual article content with h2/h3 inside
  tocWrapProps?: ComponentPropsWithoutRef<'div'>
  reveal?: ArticleTOCRevealProps
  /** Pairs article body with targets via data-read-time-* (default "main"). Set false to disable. */
  readTimeId?: string | false
  readTimeLabel?: string
  readTimeUnit?: string
}

export function ArticleTOC({
  title = 'On this page',
  levels = 'h2,h3',
  offset = 80,
  children,
  tocWrapProps,
  reveal,
  readTimeId = 'main',
  readTimeLabel,
  readTimeUnit = 'min',
}: ArticleTOCProps) {
  const readTimeMatch = readTimeId === false ? null : (readTimeId || 'main')

  usePageInit(
    useCallback(() => {
      const raf = requestAnimationFrame(() => {
        initTableOfContents()
        if (readTimeMatch) initDisplayReadTime()
      })
      return () => cancelAnimationFrame(raf)
    }, [readTimeMatch]),
  )

  return (
    <div
      data-toc-wrap
      data-toc-levels={levels}
      data-toc-offset={offset}
      className="toc-layout article-body"
      {...(reveal ? { 'data-reveal-group': '', 'data-stagger': reveal.stagger, 'data-start': reveal.start, 'data-distance': reveal.distance } : {})}
      {...tocWrapProps}
    >
      <aside className="toc-sidebar" aria-label={title}>
        <p className="toc-sidebar__label text-[10px] font-bold uppercase tracking-widest font-accent text-white/40">
          {title}
        </p>
        {readTimeMatch && readTimeLabel && (
          <p className="toc-read-time">
            {readTimeLabel}:{' '}
            <span data-read-time-target={readTimeMatch} className="toc-read-time__value">
              —
            </span>{' '}
            {readTimeUnit}
          </p>
        )}
        <nav data-toc-list className="toc-list">
          <a data-toc-link href="#" className="toc-link">
            <span data-toc-text="">Example heading</span>
          </a>
        </nav>
      </aside>

      <div className="toc-main">
        <div
          data-toc-content
          className="toc-article w-richtext"
          {...(readTimeMatch ? { 'data-read-time-article': readTimeMatch } : {})}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

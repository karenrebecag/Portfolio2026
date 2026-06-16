'use client'

import { useCallback, useRef, type ComponentPropsWithoutRef } from 'react'
import { initTableOfContents } from '@/lib/toc'
import { initDisplayReadTime } from '@/lib/read-time'
import { usePageInit } from '@/lib/use-page-init'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ;(window as Window & { ScrollTrigger?: typeof ScrollTrigger; gsap?: typeof gsap }).ScrollTrigger = ScrollTrigger
  ;(window as Window & { gsap?: typeof gsap }).gsap = gsap
}

const SIDEBAR_MOUNT_DELAY = 0.14
const SIDEBAR_MOUNT_DURATION = 0.75

interface ArticleTOCRevealProps {
  stagger?: string
  start?: string
  distance?: string
}

interface ArticleTOCProps {
  title?: string
  levels?: string // "h2,h3"
  offset?: number
  children: React.ReactNode
  tocWrapProps?: ComponentPropsWithoutRef<'div'>
  reveal?: ArticleTOCRevealProps
  readTimeId?: string | false
  readTimeLabel?: string
  readTimeUnit?: string
}

function mountTocSidebar(sidebar: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  sidebar.removeAttribute('data-toc-mounted')
  gsap.killTweensOf(sidebar)

  if (reduced) {
    gsap.set(sidebar, { clearProps: 'all', autoAlpha: 1, y: 0 })
    sidebar.setAttribute('data-toc-mounted', '')
    return
  }

  gsap.set(sidebar, { autoAlpha: 0, y: '1.25em' })
  gsap.to(sidebar, {
    autoAlpha: 1,
    y: 0,
    duration: SIDEBAR_MOUNT_DURATION,
    ease: 'power4.inOut',
    delay: SIDEBAR_MOUNT_DELAY,
    onComplete: () => {
      gsap.set(sidebar, { clearProps: 'all' })
      sidebar.setAttribute('data-toc-mounted', '')
    },
  })
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
  const wrapRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const readTimeMatch = readTimeId === false ? null : (readTimeId || 'main')

  usePageInit(
    useCallback(() => {
      const sidebar = sidebarRef.current
      const wrap = wrapRef.current
      if (!sidebar || !wrap) return

      let tocCleanup: (() => void) | undefined
      let mountRaf = 0

      mountRaf = requestAnimationFrame(() => {
        mountTocSidebar(sidebar)
        tocCleanup = initTableOfContents()
        if (readTimeMatch) initDisplayReadTime()
        scheduleScrollTriggerRefresh(true)
      })

      return () => {
        cancelAnimationFrame(mountRaf)
        gsap.killTweensOf(sidebar)
        sidebar.removeAttribute('data-toc-mounted')
        gsap.set(sidebar, { clearProps: 'all' })
        tocCleanup?.()
      }
    }, [readTimeMatch]),
  )

  return (
    <div
      ref={wrapRef}
      data-toc-wrap
      data-toc-levels={levels}
      data-toc-offset={offset}
      className="toc-layout article-body"
      {...(reveal
        ? {
            'data-reveal-group': '',
            'data-stagger': reveal.stagger,
            'data-start': reveal.start,
            'data-distance': reveal.distance,
          }
        : {})}
      {...tocWrapProps}
    >
      <aside ref={sidebarRef} className="toc-sidebar" aria-label={title}>
        <p className="toc-sidebar__label text-[11px] font-bold uppercase tracking-widest font-accent text-white/40">
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
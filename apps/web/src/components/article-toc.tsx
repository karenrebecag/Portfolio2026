'use client'

import { useEffect, useId } from 'react'
import { initTableOfContents } from '@/lib/toc'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins once for the TOC (and make them available globally for the init function)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // Expose on window so the data-attr init (which checks typeof ScrollTrigger) can find them
  ;(window as any).ScrollTrigger = ScrollTrigger
  ;(window as any).gsap = gsap
}

interface ArticleTOCProps {
  title?: string
  levels?: string // "h2,h3"
  offset?: number
  children: React.ReactNode // the actual article content with h2/h3 inside
}

export function ArticleTOC({
  title = 'On this page',
  levels = 'h2,h3',
  offset = 80,
  children,
}: ArticleTOCProps) {
  const templateId = useId()

  useEffect(() => {
    // Run after the DOM (with headings) is painted
    const raf = requestAnimationFrame(() => {
      initTableOfContents()
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      data-toc-wrap
      data-toc-levels={levels}
      data-toc-offset={offset}
      className="toc-layout"
    >
      {/* Sidebar */}
      <aside className="toc-sidebar">
        <p className="toc-hero__label text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">
          {title}
        </p>
        <nav data-toc-list className="toc-list">
          {/* Template link — will be cloned by JS for every heading and then removed */}
          <a
            data-toc-link
            href="#"
            className="toc-link"
          >
            <span data-toc-text="">Example heading</span>
          </a>
        </nav>
      </aside>

      {/* Article content — all h2/h3 here will be picked up automatically */}
      <div data-toc-content className="toc-article w-richtext">
        {children}
      </div>
    </div>
  )
}

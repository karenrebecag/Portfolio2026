'use client'

import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'

const THRESHOLDS = [25, 50, 75, 100] as const

/** Fires essay_scroll_depth once per threshold so we can see how far readers actually get. */
export function ScrollDepthTracker({ slug, variant = 'article' }: { slug: string; variant?: string }) {
  const fired = useRef<Set<number>>(new Set())

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const pct = scrollable <= 0 ? 100 : Math.round((doc.scrollTop / scrollable) * 100)
      for (const threshold of THRESHOLDS) {
        if (pct >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold)
          track('essay_scroll_depth', { slug, variant, depth: threshold })
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug, variant])

  return null
}

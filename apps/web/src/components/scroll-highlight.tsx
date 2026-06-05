'use client'

import { useCallback, useRef } from 'react'
import { destroyScrollHighlights, initScrollHighlights } from '@/lib/scroll-highlight-controller'
import { usePageInit } from '@/lib/use-page-init'

export function ScrollHighlight({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  usePageInit(
    useCallback(() => {
      const section = sectionRef.current
      if (!section) return
      initScrollHighlights(section)
      return () => destroyScrollHighlights(section)
    }, []),
  )

  return (
    <div ref={sectionRef} data-scroll-highlight>
      {children}
    </div>
  )
}
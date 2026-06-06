'use client'

import { useRef, type RefObject } from 'react'
import { COLUMN_WIPE } from '@/lib/column-wipe'
import { useNavigationRuntime } from '@/lib/navigation/navigation-runtime'

/** Wipe overlay + content wrapper. The navigation logic lives in
 *  useNavigationRuntime; this component just renders the surface. */
function WipeSurface({
  overlayRef,
  contentRef,
  children,
}: {
  overlayRef: RefObject<HTMLDivElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  return (
    <>
      <div ref={overlayRef} data-transition-wrap className="transition">
        <div className="transition__panels">
          {Array.from({ length: COLUMN_WIPE.panelCount }, (_, i) => (
            <div key={i} data-transition-column className="transition__panel bg-surface" />
          ))}
        </div>
        <div className="transition__lines">
          {Array.from({ length: COLUMN_WIPE.panelCount }, (_, i) => (
            <div key={i} className={`transition__line${i === COLUMN_WIPE.panelCount - 1 ? ' is--last' : ''}`} />
          ))}
        </div>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useNavigationRuntime({ overlayRef, contentRef })
  return (
    <WipeSurface overlayRef={overlayRef} contentRef={contentRef}>
      {children}
    </WipeSurface>
  )
}

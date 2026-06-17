type GridGuidesProps = {
  /** Extra classes — pass the z-index that keeps the guides behind content. */
  className?: string
}

/**
 * Decorative vertical guide lines aligned to the 1400px container. Drawn in
 * currentColor so each section renders them in its own foreground (light over
 * dark sections, dark over light). 2 columns on mobile, 4 on desktop.
 */
export function GridGuides({ className = '' }: GridGuidesProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-[0.08] ${className}`}>
      {/* Padding outside, max-width inside — mirrors `section px` + centered
          Container, so the guides land exactly on the content's inner width. */}
      <div className="h-full px-4 lg:px-6">
        <div className="mx-auto flex h-full w-full max-w-[1400px]">
          <div className="h-full flex-1 border-l border-current" />
          <div className="hidden h-full flex-1 border-l border-current md:block" />
          <div className="h-full flex-1 border-l border-current" />
          <div className="hidden h-full flex-1 border-l border-current md:block" />
          <div className="h-full border-l border-current" />
        </div>
      </div>
    </div>
  )
}

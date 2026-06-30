'use client'

import { useState } from 'react'

export type FaqItem = {
  q: string
  /** Una respuesta de un párrafo, o varios párrafos. */
  a: string | string[]
}

type FaqAccordionProps = {
  items: FaqItem[]
  className?: string
}

/**
 * Acordeón FAQ en card simple (inspirado en el home de ATOM Academy, técnica
 * OSMO: el body es un grid que anima `grid-template-rows` 0fr → 1fr con el inner
 * en overflow:hidden). Single-open. Consume tokens del proyecto (border, card,
 * foreground, muted-foreground), así sigue el theme activo.
 */
export function FaqAccordion({ items, className = '' }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-card px-5 md:px-7 ${className}`}
    >
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="border-b border-border last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <span className="text-[clamp(1rem,1.5vw,1.25rem)] font-semibold leading-snug text-foreground">{item.q}</span>
              <span aria-hidden className="relative ml-2 h-4 w-4 shrink-0 text-muted-foreground">
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                <span
                  className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? 'scale-y-0' : ''
                  }`}
                />
              </span>
            </button>

            <div
              id={`faq-panel-${i}`}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-4 pb-6 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-muted-foreground">
                  {(Array.isArray(item.a) ? item.a : [item.a]).map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

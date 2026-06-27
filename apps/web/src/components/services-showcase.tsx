'use client'

import { useEffect, useState } from 'react'
import { ServicesFanCards } from './services-fan-cards'
import { ServicesStackCards } from './services-stack-cards'
import type { ProposalService } from '@/content/proposals'

type ShowcaseLabels = {
  eyebrow: string
  heading: string
  count: string
  scrollHint: string
  itemLabel: string
  includesLabel: string
}

type ServicesShowcaseProps = {
  services: ProposalService[]
  labels: ShowcaseLabels
}

const DESKTOP_QUERY = '(min-width: 1200px)'
const TABLET_QUERY = '(min-width: 520px) and (max-width: 1199px)'

/**
 * Switch de diseño para los servicios, en 3 modos:
 * - ≥1200px: efecto fan (MWG 003).
 * - 520–1199px: stack con scroll (MWG 031).
 * - <520px: el mismo stack reflowa a columna estática (CSS), sin scroll.
 *
 * Todos viven en el DOM (SSR/SEO); CSS muestra el correcto y `active` gatea el
 * JS para no crear ScrollTriggers en el que está oculto o estático.
 */
export function ServicesShowcase({ services, labels }: ServicesShowcaseProps) {
  const [mode, setMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const tablet = window.matchMedia(TABLET_QUERY)
    const update = () => setMode(desktop.matches ? 'desktop' : tablet.matches ? 'tablet' : 'mobile')
    update()
    desktop.addEventListener('change', update)
    tablet.addEventListener('change', update)
    return () => {
      desktop.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
    }
  }, [])

  return (
    <>
      <div className="max-[1199px]:hidden">
        <ServicesFanCards services={services} labels={labels} active={mode === 'desktop'} />
      </div>
      {/* Stack: visible <1200; scroll en tablet, columna estática <520 (CSS). */}
      <div className="min-[1200px]:hidden">
        <ServicesStackCards services={services} labels={labels} active={mode === 'tablet'} />
      </div>
    </>
  )
}

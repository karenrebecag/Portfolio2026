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

/**
 * Switch de diseño para los servicios: el efecto fan (MWG 003) no funciona bien
 * < 1200px, así que ahí cambia al stack de cards (MWG 031) con el mismo contenido.
 * Ambos viven en el DOM (SSR/SEO); CSS oculta uno y `active` gatea su JS para no
 * crear ScrollTriggers/pins degenerados en el que está display:none.
 */
export function ServicesShowcase({ services, labels }: ServicesShowcaseProps) {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <>
      <div className="max-[1199px]:hidden">
        <ServicesFanCards services={services} labels={labels} active={isDesktop} />
      </div>
      <div className="min-[1200px]:hidden">
        <ServicesStackCards services={services} labels={labels} active={!isDesktop} />
      </div>
    </>
  )
}

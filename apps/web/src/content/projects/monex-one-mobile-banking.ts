/**
 * Client work case study: Monex One mobile banking (Mexico)
 */

import esMarkdown from './monex-one-mobile-banking-es.md'
import enMarkdown from './monex-one-mobile-banking-en.md'

export const monexOneMobileBankingMeta = {
  id: '1',
  slug: 'monex-one-mobile-banking',
  canonicalRoute: 'project' as const,
  status: 'published' as const,
  category: 'mobile' as const,
  role: 'UX/UI Designer',
  year: '2024',
  featured: true,
  tags: [
    { tag: 'Product Design' },
    { tag: 'UX Research' },
    { tag: 'Figma' },
    { tag: 'iOS' },
    { tag: 'Mobile Banking' },
    { tag: 'Design Systems' },
  ],
  liveUrl: 'https://apps.apple.com/uy/app/monex-m%C3%B3vil/id563606880',
  repoUrl: '',
  services: 'UX/UI Design, Flow Architecture, Design System, Mobile Product',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2ea2b1de5d693cf173_Elegant%20Ice%20Bottle%20Display.avif',
    alt: 'Monex One mobile banking',
  },
  createdAt: '2024-03-01',
  updatedAt: '2026-06-05',
}

export const monexOneMobileBankingI18n = {
  en: {
    title: 'Monex Móvil | Corporate Mobile Banking UX',
    summary:
      'Product design case study: FX, payments, and balances for Banco Monex, eight months with Aurin × Ancient Global, live on the App Store within a year.',
    description:
      'This is not a build log. It is how to order banking complexity (FX, payments, balances, security) without oversimplifying or cluttering screens: flow architecture, progressive disclosure, and a visual system reproducible across many designers. You take away a map of reusable practices: journeys, research, components, tokens, and MVP decisions, anchored in Monex Móvil, Banco Monex’s App Store product.',
    role: 'UX/UI Designer',
    services: 'UX/UI Design, Flow Architecture, Design System, Mobile Product',
  },
  es: {
    title: 'Monex Móvil | UX de banca móvil corporativa',
    summary:
      'Caso de diseño de producto: divisas, pagos y saldos para Banco Monex, ocho meses con Aurin × Ancient Global, en App Store al año.',
    description:
      'No es un log de implementación. Es cómo ordenar complejidad bancaria (divisas, pagos, saldos, seguridad) sin simplificar de más ni saturar pantallas: arquitectura de flujos, progressive disclosure y un sistema visual reproducible entre muchos diseñadores. Te llevas un mapa de prácticas reutilizables: journeys, research, componentes, tokens y decisiones de MVP, anclado en Monex Móvil, app de Banco Monex en App Store.',
    role: 'Diseñadora UX/UI',
    services: 'Diseño UX/UI, Arquitectura de flujos, Design system, Producto móvil',
  },
}

export const monexOneMobileBankingMarkdown_es = esMarkdown
export const monexOneMobileBankingMarkdown_en = enMarkdown
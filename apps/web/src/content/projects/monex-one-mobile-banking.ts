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
  tags: [{ tag: 'UX/UI' }, { tag: 'Figma' }, { tag: 'iOS' }, { tag: 'Mobile Banking' }],
  liveUrl: 'https://www.monex.com.mx/portal/monexone',
  repoUrl: '',
  services: 'UX/UI Design, Mobile Product',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2ea2b1de5d693cf173_Elegant%20Ice%20Bottle%20Display.avif',
    alt: 'Monex One mobile banking',
  },
  createdAt: '2024-03-01',
  updatedAt: '2025-06-01',
}

export const monexOneMobileBankingI18n = {
  en: {
    title: 'Monex One | Mobile Banking UX/UI for Mexico',
    summary:
      "Eight months embedded with Aurin and Ancient Global designing Monex One—the mobile banking app for Monex's Mexico division. Shipped on the App Store within a year.",
    role: 'UX/UI Designer',
    services: 'UX/UI Design, Mobile Product',
  },
  es: {
    title: 'Monex One | UX/UI de banca móvil para México',
    summary:
      'Ocho meses integrada con Aurin y Ancient Global diseñando Monex One—la app de banca móvil de la división México de Monex. En App Store al año del proyecto.',
    role: 'Diseñadora UX/UI',
    services: 'Diseño UX/UI, Producto móvil',
  },
}

export const monexOneMobileBankingMarkdown_es = esMarkdown
export const monexOneMobileBankingMarkdown_en = enMarkdown
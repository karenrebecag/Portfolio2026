/**
 * Client work case study: María Luisa de Mateo artist portfolio (JAMstack)
 */

import esMarkdown from './maria-luisa-de-mateo-jamstack-es.md'
import enMarkdown from './maria-luisa-de-mateo-jamstack-en.md'

export const mariaLuisaDeMateoJamstackMeta = {
  id: '3',
  slug: 'maria-luisa-de-mateo-jamstack',
  canonicalRoute: 'project' as const,
  status: 'published' as const,
  category: 'web' as const,
  role: 'UX Engineer & Product Designer',
  year: '2025',
  featured: true,
  tags: [
    { tag: 'Next.js' },
    { tag: 'JAMstack' },
    { tag: 'GSAP' },
    { tag: 'Artsy' },
    { tag: 'R2' },
    { tag: 'next-intl' },
  ],
  liveUrl: 'https://marialuisademateo.com',
  repoUrl: 'https://github.com/karenrebecag/MariaLuisadeMateo',
  services: 'UX Engineering, Product Design, JAMstack',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2e3a3b6987bbb92dfd_Serene%20Floral%20Arrangement.avif',
    alt: 'María Luisa de Mateo artist portfolio',
  },
  createdAt: '2025-06-01',
  updatedAt: '2026-06-01',
}

export const mariaLuisaDeMateoJamstackI18n = {
  en: {
    title: 'María Luisa de Mateo | Artsy & Instagram as the CMS',
    summary:
      'Most artist sites ship with a CMS the creator never opens. This one pulls live inventory from Artsy and Instagram—47 works on R2, bilingual Next.js, GSAP galleries—so María Luisa keeps selling where she already sells.',
    role: 'UX Engineer & Product Designer',
    services: 'UX Engineering, Product Design, JAMstack',
  },
  es: {
    title: 'María Luisa de Mateo | Artsy e Instagram como CMS',
    summary:
      'La mayoría de sitios para artistas traen un CMS que nadie abre. Este tira inventario vivo de Artsy e Instagram—47 obras en R2, Next.js bilingüe, galerías con GSAP—para que María Luisa siga vendiendo donde ya vende.',
    role: 'UX Engineer & Product Designer',
    services: 'UX Engineering, Diseño de producto, JAMstack',
  },
}

export const mariaLuisaDeMateoJamstackMarkdown_es = esMarkdown
export const mariaLuisaDeMateoJamstackMarkdown_en = enMarkdown
/**
 * Case study: Decoupled architectures and non-technical ownership
 */

import esMarkdown from './decoupled-ownership-platforms-es.md'
import enMarkdown from './decoupled-ownership-platforms-en.md'

export const decoupledOwnershipPlatformsMeta = {
  id: '10',
  slug: 'decoupled-ownership-non-technical-teams',
  articleSlug: 'decoupled-architecture-non-technical-ownership',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & Architecture',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Architecture' },
    { tag: 'ADR' },
    { tag: 'BFF' },
    { tag: 'LGPD' },
    { tag: 'Team Topologies' },
  ],
  liveUrl: 'https://atfxeducacao-porposal.vercel.app/',
  repoUrl: '',
  services: 'Solution architecture, ADRs, Platform engineering',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e349d92acc75bd79fa8_Minimalist%20Green%20Stools.avif',
    alt: 'Decoupled platforms and ownership boundaries',
  },
  createdAt: '2026-06-05',
  updatedAt: '2026-06-05',
}

export const decoupledOwnershipPlatformsI18n = {
  en: {
    title: 'Decoupled Architecture by Ownership | A Field Guide for Engineers',
    summary:
      'Conway\'s Law, three planes (experience / transaction / record), BFF, headless CMS, RLS, and ADRs — how to let non-technical teams ship without breaking payments or audits. Illustrated with LMS and production splits.',
  },
  es: {
    title: 'Arquitectura desacoplada por ownership | Guía para ingeniería',
    summary:
      'Ley de Conway, tres planos (experiencia / transacción / registro), BFF, CMS headless, RLS y ADR — cómo equipos no técnicos publican sin romper pagos ni auditorías. Con ejemplos LMS y producción.',
  },
}

export const decoupledOwnershipPlatformsMarkdown_es = esMarkdown
export const decoupledOwnershipPlatformsMarkdown_en = enMarkdown
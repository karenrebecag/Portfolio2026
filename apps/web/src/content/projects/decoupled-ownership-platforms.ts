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
      'The wrong architecture meeting asks "which framework?" The useful one asks who must change what without breaking the rest. This guide is for leaders and senior engineers planning products where marketing or education must publish often, while payments and privacy stay under engineering control. You will see how to draw boundaries so a headline change does not accidentally touch checkout or audit evidence—with examples from a live marketing site and a regulated learning proposal.',
  },
  es: {
    title: 'Arquitectura desacoplada por ownership | Guía para ingeniería',
    summary:
      'La reunión de arquitectura equivocada pregunta "¿qué framework?". La útil pregunta quién debe cambiar qué sin romper el resto. Esta guía es para líderes e ingeniería senior que planean productos donde marketing o educación deben publicar seguido, mientras pagos y privacidad quedan en ingeniería. Verás cómo trazar límites para que un cambio de titular no toque checkout ni evidencia de auditoría por accidente, con ejemplos de un sitio en producción y una propuesta de aprendizaje regulada.',
  },
}

export const decoupledOwnershipPlatformsMarkdown_es = esMarkdown
export const decoupledOwnershipPlatformsMarkdown_en = enMarkdown
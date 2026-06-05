/**
 * Case study: Context-driven development for vibecoding (client upskilling + reference repo)
 */

import esMarkdown from './context-driven-vibecoding-es.md'
import enMarkdown from './context-driven-vibecoding-en.md'

export const contextDrivenVibecodingMeta = {
  id: '9',
  slug: 'context-driven-development-vibecoding',
  articleSlug: 'context-driven-development-vibecoding',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & Instructor',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Next.js' },
    { tag: 'Claude Code' },
    { tag: 'Supabase' },
    { tag: 'Spec-Driven' },
    { tag: 'AI-Assisted' },
  ],
  liveUrl: '',
  repoUrl: '',
  services: 'Product Engineering, Technical Education, AI Workflows',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e349d92acc75bd79fa8_Minimalist%20Green%20Stools.avif',
    alt: 'Context-driven development for vibecoding',
  },
  createdAt: '2026-06-04',
  updatedAt: '2026-06-04',
}

export const contextDrivenVibecodingI18n = {
  en: {
    title:
      'The Problem with Vibecoding Without Context | How I Upskill Teams at the Companies I Work With',
    summary:
      'Hours on specs and agent orchestration before any code | then press play. Less token burn, more architecture, design, and review.',
  },
  es: {
    title:
      'El problema con el vibecoding sin contexto | Cómo capacito equipos en las empresas donde trabajo',
    summary:
      'Horas en specs y orquestación de agentes antes del código | después, darle play. Menos tokens, más arquitectura, diseño y revisión.',
  },
}

export const contextDrivenVibecodingMarkdown_es = esMarkdown
export const contextDrivenVibecodingMarkdown_en = enMarkdown
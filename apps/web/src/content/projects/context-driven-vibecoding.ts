/**
 * Case study: Context-driven development for vibecoding (client upskilling + reference repo)
 */

import esMarkdown from './context-driven-vibecoding-es.md'
import enMarkdown from './context-driven-vibecoding-en.md'

export const contextDrivenVibecodingMeta = {
  id: '9',
  slug: 'context-driven-development-vibecoding',
  articleSlug: 'context-driven-development-vibecoding',
  canonicalRoute: 'article' as const,
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
      'AI can build a convincing demo in an afternoon; keeping that demo safe for real users is a different job. Most teams lose decisions in chat history, so each new session rewrites things that were already settled. I teach client teams a workflow where plans and guardrails live in the project itself: shared documentation engineers actually honor. Less firefighting after handoff, more confident shipping from product and growth without blocking engineering on every small change.',
  },
  es: {
    title:
      'El problema con el vibecoding sin contexto | Cómo capacito equipos en las empresas donde trabajo',
    summary:
      'La IA puede armar un demo convincente en una tarde; que ese demo sea seguro para usuarios reales es otro trabajo. La mayoría de equipos pierde decisiones en el historial del chat, y cada sesión nueva reescribe lo que ya estaba cerrado. Enseño en empresas cliente un flujo donde planes y barandillas viven en el proyecto: documentación compartida que ingeniería sí respeta. Menos apagar incendios después del handoff, más confianza en producto y growth sin bloquear ingeniería en cada cambio chico.',
  },
}

export const contextDrivenVibecodingMarkdown_es = esMarkdown
export const contextDrivenVibecodingMarkdown_en = enMarkdown
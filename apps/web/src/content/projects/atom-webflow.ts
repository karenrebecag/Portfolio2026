/**
 * Caso de estudio / Case study
 *
 * Source of truth for "Context-Driven Visual Development".
 * Markdown lives in .md files (no backtick escaping issues).
 * Imported as raw strings and parsed by parseMarkdown().
 */

import esMarkdown from './atom-webflow-es.md'
import enMarkdown from './atom-webflow-en.md'

export const atomWebflowMeta = {
  id: '6',
  slug: 'context-driven-visual-development',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & Webflow Architect',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Webflow' },
    { tag: 'GSAP' },
    { tag: 'Design Systems' },
    { tag: 'AI Agents' },
    { tag: 'Hybrid Architecture' },
  ],
  liveUrl: 'https://new.atomchat.io',
  repoUrl: 'https://github.com/karenrebecag/AtomWebflow_2026Site',
  services: 'Webflow Architecture, Product Engineering, Design Systems',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e49a704afe5e3f4a55d_Fluid%20Abstract%20Design.avif',
    alt: 'Atom Webflow',
  },
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
}

export const atomWebflowI18n = {
  en: {
    title: 'The Problem with Webflow in Production \u2014 and How We Solve It',
    summary: 'A replicable workflow for teams that need no-code speed with engineering discipline.',
  },
  es: {
    title: 'El problema con Webflow en produccion \u2014 y como lo resolvemos',
    summary: 'Un workflow replicable para equipos que necesitan velocidad de no-code con disciplina de ingenieria.',
  },
}

export const atomWebflowMarkdown_es = esMarkdown
export const atomWebflowMarkdown_en = enMarkdown

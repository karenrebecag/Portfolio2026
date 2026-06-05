/**
 * Case study: The Design System That Ships Itself
 * Duplicated from atom-webflow — edit markdown independently.
 */

import esMarkdown from './design-system-ships-itself-es.md'
import enMarkdown from './design-system-ships-itself-en.md'

export const designSystemShipsItselfMeta = {
  id: '7',
  slug: 'design-system-that-ships-itself',
  articleSlug: 'design-system-that-ships-itself',
  status: 'published' as const,
  category: 'design_system' as const,
  role: 'Product Engineer & Design Systems Lead',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Design Systems' },
    { tag: 'Design Tokens' },
    { tag: 'MCP' },
    { tag: 'AI Agents' },
    { tag: 'Monorepo' },
  ],
  liveUrl: 'https://uikit.atomchat.io',
  repoUrl: 'https://github.com/karenrebecag/atom-uikit-ds',
  services: 'Design Systems, Product Engineering, AI Integrations',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2e3a3b6987bbb92dfd_Serene%20Floral%20Arrangement.avif',
    alt: 'The Design System That Ships Itself',
  },
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
}

export const designSystemShipsItselfI18n = {
  en: {
    title: "The Design System an AI Can't Hallucinate",
    summary:
      'When everyone on a team uses AI to generate interfaces, small visual mistakes slip through review and pile up in production. I extended a design system so people and tools pull from the same rules—colors, spacing, components—instead of guessing. The story walks through what broke first, what we fixed next, and why separating "what you can look up" from "what you can change" reduced rework for engineering and kept marketing pages on brand.',
  },
  es: {
    title: 'El design system que una IA no puede alucinar',
    summary:
      'Cuando todo el equipo usa IA para generar interfaces, errores visuales chicos pasan el review y se acumulan en producción. Extendí un design system para que personas y herramientas tiren de las mismas reglas—colores, espaciado, componentes—en lugar de adivinar. La historia recorre qué se rompió primero, qué arreglamos después, y por qué separar "lo que puedes consultar" de "lo que puedes cambiar" redujo retrabajo en ingeniería y mantuvo las páginas de marketing alineadas a marca.',
  },
}

export const designSystemShipsItselfMarkdown_es = esMarkdown
export const designSystemShipsItselfMarkdown_en = enMarkdown
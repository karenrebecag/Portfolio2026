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
      'Layered tokens, a single source of truth, and an MCP that separates what an agent can know from what it can do.',
  },
  es: {
    title: 'El design system que una IA no puede alucinar',
    summary:
      'Tokens en capas, una sola fuente de verdad y un MCP que separa lo que un agente puede saber de lo que puede hacer.',
  },
}

export const designSystemShipsItselfMarkdown_es = esMarkdown
export const designSystemShipsItselfMarkdown_en = enMarkdown
/**
 * Case study: The Design System That Ships Itself
 * Duplicated from client-webflow — edit markdown independently.
 */

import esMarkdown from './design-system-ships-itself-es.md'
import enMarkdown from './design-system-ships-itself-en.md'

export const designSystemShipsItselfMeta = {
  id: '7',
  slug: 'design-system-that-ships-itself',
  articleSlug: 'design-system-that-ships-itself',
  canonicalRoute: 'article' as const,
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
    { tag: 'Webflow' },
    { tag: 'Release Engineering' },
  ],
  services: 'Design Systems, Platform Engineering, AI Integrations',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2e3a3b6987bbb92dfd_Serene%20Floral%20Arrangement.avif',
    alt: 'The Design System That Ships Itself',
  },
  createdAt: '2026-06-01',
  updatedAt: '2026-08-03',
}

export const designSystemShipsItselfI18n = {
  en: {
    title: "The Design System an AI Can't Hallucinate",
    summary:
      'When everyone on a team uses AI to generate interfaces, small visual mistakes slip through review and pile up in production. I extended a design system so people and tools pull from the same rules (colors, spacing, components) instead of guessing. The story walks through five problems in sequence: making a system machine-readable, watching agents hallucinate anyway, consolidating a fractured source of truth, shipping to a no-code channel through a reverse-engineered clipboard format, and filling the system with agent-written, human-gated knowledge — with CI that fails any merge that makes it less true.',
  },
  es: {
    title: 'El design system que una IA no puede alucinar',
    summary:
      'Cuando todo el equipo usa IA para generar interfaces, errores visuales chicos pasan el review y se acumulan en producción. Extendí un design system para que personas y herramientas tiren de las mismas reglas (colores, espaciado, componentes) en lugar de adivinar. La historia recorre cinco problemas en secuencia: hacer un sistema legible por máquinas, ver a los agentes alucinar de todos modos, consolidar una fuente de verdad fracturada, entregar a un canal no-code vía un formato de clipboard reverse-engineered, y llenar el sistema de conocimiento redactado por agentes y gateado por humanos — con un CI que pone en rojo cualquier merge que lo haga menos verdadero.',
  },
}

export const designSystemShipsItselfMarkdown_es = esMarkdown
export const designSystemShipsItselfMarkdown_en = enMarkdown
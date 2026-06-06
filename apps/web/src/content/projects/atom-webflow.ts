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
  articleSlug: 'webflow-in-production',
  canonicalRoute: 'article' as const,
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
    title: 'Webflow in Production | with Engineering Discipline',
    summary:
      'Marketing teams love Webflow because they can ship pages without waiting on engineering. The pain starts when complex behavior gets pasted into the site as one-off code—no history, no rollback, and every publish goes straight to production. I designed a split workflow: marketers keep owning pages and copy; engineering keeps animations and logic in a normal codebase with review. The payoff is fewer mystery breakages after launch and less friction whenever the brand needs a real interaction, not just a layout change.',
  },
  es: {
    title: 'Webflow en producci\u00f3n | con disciplina de ingenier\u00eda',
    summary:
      'Los equipos de marketing aman Webflow porque publican sin esperar a ingeniería. El dolor empieza cuando el comportamiento complejo se pega como código suelto—sin historial, sin rollback, y cada publish va directo a producción. Diseñé un flujo partido: marketing sigue dueño de páginas y copy; ingeniería conserva animaciones y lógica en un codebase con revisión. El resultado son menos roturas misteriosas después del lanzamiento y menos fricción cuando la marca necesita una interacción real, no solo un cambio de layout.',
  },
}

export const atomWebflowMarkdown_es = esMarkdown
export const atomWebflowMarkdown_en = enMarkdown

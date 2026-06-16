/**
 * Case study: atfx-forms — versioned form logic decoupled from Elementor (progressive decoupling)
 */

import esMarkdown from './atfx-forms-elementor-es.md'
import enMarkdown from './atfx-forms-elementor-en.md'

export const atfxFormsElementorMeta = {
  id: '13',
  slug: 'forms-that-feed-the-pipeline',
  articleSlug: 'forms-that-feed-the-pipeline',
  canonicalRoute: 'article' as const,
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Elementor' },
    { tag: 'jsDelivr' },
    { tag: 'Zod' },
    { tag: 'Salesforce' },
    { tag: 'GSAP' },
  ],
  liveUrl: '',
  repoUrl: '',
  services: 'Product Engineering, Marketing Engineering, Data Integrity',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2ea2b1de5d693cf173_Elegant%20Ice%20Bottle%20Display.avif',
    alt: 'Versioned form logic decoupled from Elementor',
  },
  createdAt: '2026-06-16',
  updatedAt: '2026-06-16',
}

export const atfxFormsElementorI18n = {
  en: {
    title: 'Don’t Trust WordPress With the Pipeline | Versioned Lead Capture Marketing Can’t Break',
    summary:
      'On the ATFX LATAM site the forms are the revenue surface, but a page builder is the worst place for validation, attribution, and CRM logic. Elementor keeps only the HTML; a versioned TypeScript library on a CDN owns Zod validation, marketing attribution, and the Salesforce handoff, shipped as immutable releases with one-pointer rollback. In a recent 90-day window the surface carried 5,827 real leads across ~10 LATAM markets, webinar registration was the single largest source (2,237), and ~91% of leads carried UTM attribution because the library sets the one field the pipeline actually reads.',
  },
  es: {
    title: 'No le confíes el pipeline a WordPress | Captura de leads versionada que marketing no puede romper',
    summary:
      'En el sitio de ATFX LATAM los formularios son la superficie de revenue, pero un page builder es el peor lugar para la validación, la atribución y la lógica de CRM. Elementor conserva solo el HTML; una librería de TypeScript versionada en CDN posee validación Zod, atribución de marketing y el handoff a Salesforce, enviada como releases inmutables con rollback de un solo puntero. En una ventana reciente de 90 días la superficie cargó 5,827 leads reales en ~10 mercados de LATAM, el registro de webinar fue la fuente más grande (2,237), y ~91% de los leads cargaron atribución UTM porque la librería pone el único campo que el pipeline de verdad lee.',
  },
}

export const atfxFormsElementorMarkdown_es = esMarkdown
export const atfxFormsElementorMarkdown_en = enMarkdown

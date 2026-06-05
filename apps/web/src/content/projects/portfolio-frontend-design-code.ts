/**
 * Essay: Design and code — how this portfolio is built (frontend-first)
 */

import esMarkdown from './portfolio-frontend-design-code-es.md'
import enMarkdown from './portfolio-frontend-design-code-en.md'

export const portfolioFrontendDesignCodeMeta = {
  id: '11',
  slug: 'portfolio-frontend-design-and-code',
  articleSlug: 'frontend-portfolio-design-and-code',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & Frontend Architect',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Next.js' },
    { tag: 'React' },
    { tag: 'GSAP' },
    { tag: 'Frontend' },
    { tag: 'next-intl' },
    { tag: 'SEO' },
  ],
  liveUrl: 'https://karenrebecaortiz.com',
  repoUrl: 'https://github.com/karenrebecag/Portfolio2026',
  services: 'Frontend architecture, Motion design, Content pipeline, SEO',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e49a704afe5e3f4a55d_Fluid%20Abstract%20Design.avif',
    alt: 'Portfolio frontend architecture',
  },
  createdAt: '2026-06-05',
  updatedAt: '2026-06-05',
}

export const portfolioFrontendDesignCodeI18n = {
  en: {
    title: 'Design Meets Code | How This Portfolio Is Built',
    summary:
      'A product engineer portfolio is still a product—not a theme with your photo swapped in.',
    description:
      'Most portfolios look polished and say almost nothing about how you think—or they document the stack without showing judgment. I built this site to do both: long essays on the same pipeline you are reading now, motion that still works after you hit back, and hard rules about what ships before the button hover gets a third week of polish.',
  },
  es: {
    title: 'Diseño y código | Cómo está construido este portfolio',
    summary:
      'Un portfolio de product engineer sigue siendo un producto—no un theme con tu foto cambiada.',
    description:
      'La mayoría de portfolios se ven pulidos y no dicen casi nada sobre cómo piensas — o documentan el stack sin demostrar criterio. Construí este sitio para hacer las dos cosas: ensayos largos en el mismo pipeline que estás leyendo, motion que sigue funcionando después de dar atrás, y reglas claras sobre qué publicar antes de pulir el hover del botón por tercera semana.',
  },
}

export const portfolioFrontendDesignCodeMarkdown_es = esMarkdown
export const portfolioFrontendDesignCodeMarkdown_en = enMarkdown
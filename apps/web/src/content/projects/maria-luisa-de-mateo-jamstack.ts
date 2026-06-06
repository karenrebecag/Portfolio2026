/**
 * Long-form article: Silent frontend that gives creative studios and artists real ownership
 */

import esMarkdown from './maria-luisa-de-mateo-jamstack-es.md'
import enMarkdown from './maria-luisa-de-mateo-jamstack-en.md'

export const mariaLuisaDeMateoJamstackMeta = {
  id: '3',
  slug: 'maria-luisa-de-mateo-jamstack',
  articleSlug: 'the-frontend-that-disappears',
  canonicalRoute: 'article' as const,
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer & Frontend for Creative Teams',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Astro' },
    { tag: 'Next.js' },
    { tag: 'Design Systems' },
    { tag: 'Creative Ownership' },
    { tag: 'Artsy' },
    { tag: 'GSAP' },
  ],
  liveUrl: 'https://marialuisademateo.com',
  repoUrl: 'https://github.com/karenrebecag/MariaLuisadeMateo',
  services: 'Product Engineering, Frontend Architecture, Creative Systems',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2e3a3b6987bbb92dfd_Serene%20Floral%20Arrangement.avif',
    alt: 'María Luisa de Mateo artist portfolio',
  },
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
}

export const mariaLuisaDeMateoJamstackI18n = {
  en: {
    title: 'The Frontend That Disappears | Real Ownership for Artists and Studios',
    summary:
      'Most artist sites make the tech visible or force creatives into generic templates. This one gives Aurin and María Luisa de Mateo a strong, modern frontend—clear templates, tokens and guardrails—so the studio and the artist fully control the story, rhythm and selection while the architecture stays invisible.',
    role: 'Product Engineer & Frontend for Creative Teams',
    services: 'Product Engineering, Frontend Architecture, Creative Systems',
  },
  es: {
    title: 'El frontend que desaparece | Ownership real para artistas y estudios',
    summary:
      'La mayoría de sitios para artistas hacen visible la tecnología o los obligan a usar plantillas genéricas. Este entrega a Aurin y a María Luisa de Mateo un frontend moderno y sólido—plantillas claras, tokens y guardrails—para que el estudio y la artista controlen por completo la historia, el ritmo y la selección mientras la arquitectura permanece invisible.',
    role: 'Product Engineer & Frontend para equipos creativos',
    services: 'Ingeniería de producto, Arquitectura frontend, Sistemas creativos',
  },
}

export const mariaLuisaDeMateoJamstackMarkdown_es = esMarkdown
export const mariaLuisaDeMateoJamstackMarkdown_en = enMarkdown
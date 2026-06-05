export type AdditionalWorkItem = {
  title: string
  type: string
  url?: string
  image: string
  /** What Karen delivered — not just a Figma link. */
  contributions?: string
  stack?: string
  outcome?: string
  deliverable?: string
}

const SHARED_IMAGES = {
  ingles: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/InglesIndividualFrontend.webp',
  jarvio: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/ChatGPT%20Image%20Sep%2029%2C%202025%2C%2011_13_13%20AM.webp',
  totou: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/ToYou.webp',
  cadence: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/cadenceotp.webp',
  metaverse: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/metaverse.webp',
  healthAde: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/HealtAde.webp',
  ancient: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/AncientTech.webp',
  zachariel: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/Zachariel.webp',
  awe: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/AWEMX.webp',
} as const

const LINKS = {
  figmaPortfolio: 'https://www.figma.com/design/wOLxrlsIUMvcRJyOzgjIoD',
  jarvio: 'https://github.com/karenrebecag/JarvioPrototype',
  totou: 'https://www.figma.com/proto/XrmpPR40YlSaTVcTuNR4Hr',
  cadence: 'https://www.figma.com/proto/DL7gTFQHcZpLk9qdMLnPjF',
  metaverse: 'https://www.figma.com/design/2EkRHWv6kzGtflVeymrd52',
  healthAde: 'https://health-ade.com/',
  zachariel: 'https://www.figma.com/design/B5hLcZbHpNdXNf0KZDcNEL',
  awe: 'https://awexr.mx/',
} as const

export const additionalWorkItemsEn: AdditionalWorkItem[] = [
  {
    title: 'Ingles Individual',
    type: 'Fullstack Platform',
    url: LINKS.figmaPortfolio,
    image: SHARED_IMAGES.ingles,
    contributions: 'UX · UI · Frontend · Architecture · Product engineering',
    stack: 'Next.js, Supabase, TypeScript',
    deliverable: 'Live product + design system handoff',
    outcome: 'Student dashboard and scheduling in one owned surface',
  },
  {
    title: 'JarvioAI Canvas',
    type: 'UI Prototype',
    url: LINKS.jarvio,
    image: SHARED_IMAGES.jarvio,
    contributions: 'UX · UI · Frontend prototype · AI interaction design',
    stack: 'React, Figma, AI canvas',
    deliverable: 'Clickable prototype + component spec',
    outcome: 'Investor-ready demo without production backend',
  },
  {
    title: 'ToTou Energy Bars',
    type: 'Complete Site',
    url: LINKS.totou,
    image: SHARED_IMAGES.totou,
    contributions: 'UX · UI · Webflow build · Motion (GSAP) · Brand tokens',
    stack: 'Webflow, GSAP, custom CSS',
    deliverable: 'Published marketing site',
    outcome: 'D2C launch with motion-led storytelling, not a static mockup',
  },
  {
    title: 'Cadence OTC',
    type: 'E-Commerce',
    url: LINKS.cadence,
    image: SHARED_IMAGES.cadence,
    contributions: 'UX · UI · E-commerce flows · Stakeholder prototyping',
    stack: 'Figma, checkout patterns',
    deliverable: 'High-fidelity prototype',
    outcome: 'Checkout flow validated before engineering sprint',
  },
  {
    title: 'Metaverse Dashboard',
    type: 'Landing Page',
    url: LINKS.metaverse,
    image: SHARED_IMAGES.metaverse,
    contributions: 'UX · UI · Visual design · Responsive layout',
    stack: 'Figma, responsive specs',
    deliverable: 'Landing UI kit',
    outcome: 'Web3 analytics concept pitched with production-grade visuals',
  },
  {
    title: 'Health-Ade Kombucha',
    type: 'E-Commerce',
    url: LINKS.healthAde,
    image: SHARED_IMAGES.healthAde,
    contributions: 'UX · UI · PDP exploration · Subscription UX',
    stack: 'Shopify patterns, brand UI',
    deliverable: 'Redesign exploration deck',
    outcome: 'Clearer PDP and subscription paths for stakeholder review',
  },
  {
    title: 'Ancient Tech',
    type: 'Complete Site',
    url: LINKS.figmaPortfolio,
    image: SHARED_IMAGES.ancient,
    contributions: 'UX · UI · Webflow · Frontend (custom CSS) · Content structure',
    stack: 'Webflow, custom CSS',
    deliverable: 'Shipped editorial site',
    outcome: 'Marketing site live in under 3 weeks from brief',
  },
  {
    title: 'Zachariel Banking',
    type: 'Fintech',
    url: LINKS.zachariel,
    image: SHARED_IMAGES.zachariel,
    contributions: 'UX · UI · Design system · Mobile patterns',
    stack: 'Figma, component library',
    deliverable: 'Mobile UI system + pitch screens',
    outcome: 'LATAM fintech deck with consistent banking patterns',
  },
  {
    title: 'AWE MX',
    type: 'Community',
    url: LINKS.awe,
    image: SHARED_IMAGES.awe,
    contributions: 'UX · UI · Webflow · CMS structure · Events templates',
    stack: 'Webflow, CMS collections',
    deliverable: 'Community hub + recurring event templates',
    outcome: 'Non-technical team can publish events without engineering',
  },
]

export const additionalWorkItemsEs: AdditionalWorkItem[] = [
  {
    title: 'Ingles Individual',
    type: 'Plataforma fullstack',
    url: LINKS.figmaPortfolio,
    image: SHARED_IMAGES.ingles,
    contributions: 'UX · UI · Frontend · Arquitectura · Product engineering',
    stack: 'Next.js, Supabase, TypeScript',
    deliverable: 'Producto en vivo + handoff de design system',
    outcome: 'Dashboard de alumnos y agendamiento en una superficie propia',
  },
  {
    title: 'JarvioAI Canvas',
    type: 'Prototipo UI',
    url: LINKS.jarvio,
    image: SHARED_IMAGES.jarvio,
    contributions: 'UX · UI · Prototipo frontend · Diseño de interacción con IA',
    stack: 'React, Figma, canvas con IA',
    deliverable: 'Prototipo clicable + spec de componentes',
    outcome: 'Demo lista para inversionistas sin backend de producción',
  },
  {
    title: 'ToTou Energy Bars',
    type: 'Sitio completo',
    url: LINKS.totou,
    image: SHARED_IMAGES.totou,
    contributions: 'UX · UI · Build Webflow · Motion (GSAP) · Tokens de marca',
    stack: 'Webflow, GSAP, CSS custom',
    deliverable: 'Sitio de marketing publicado',
    outcome: 'Lanzamiento D2C con narrativa en motion, no mockup estático',
  },
  {
    title: 'Cadence OTC',
    type: 'E-commerce',
    url: LINKS.cadence,
    image: SHARED_IMAGES.cadence,
    contributions: 'UX · UI · Flujos e-commerce · Prototipado con stakeholders',
    stack: 'Figma, patrones de checkout',
    deliverable: 'Prototipo alta fidelidad',
    outcome: 'Flujo de checkout validado antes del sprint de ingeniería',
  },
  {
    title: 'Metaverse Dashboard',
    type: 'Landing page',
    url: LINKS.metaverse,
    image: SHARED_IMAGES.metaverse,
    contributions: 'UX · UI · Diseño visual · Layout responsive',
    stack: 'Figma, specs responsive',
    deliverable: 'UI kit de landing',
    outcome: 'Concepto analytics Web3 presentado con visuals listos para producción',
  },
  {
    title: 'Health-Ade Kombucha',
    type: 'E-commerce',
    url: LINKS.healthAde,
    image: SHARED_IMAGES.healthAde,
    contributions: 'UX · UI · Exploración PDP · UX de suscripción',
    stack: 'Patrones Shopify, UI de marca',
    deliverable: 'Deck de exploración de rediseño',
    outcome: 'PDP y suscripción más claros para review con stakeholders',
  },
  {
    title: 'Ancient Tech',
    type: 'Sitio completo',
    url: LINKS.figmaPortfolio,
    image: SHARED_IMAGES.ancient,
    contributions: 'UX · UI · Webflow · Frontend (CSS) · Estructura de contenido',
    stack: 'Webflow, CSS custom',
    deliverable: 'Sitio editorial en producción',
    outcome: 'Sitio de marketing en vivo en menos de 3 semanas desde el brief',
  },
  {
    title: 'Zachariel Banking',
    type: 'Fintech',
    url: LINKS.zachariel,
    image: SHARED_IMAGES.zachariel,
    contributions: 'UX · UI · Design system · Patrones mobile',
    stack: 'Figma, librería de componentes',
    deliverable: 'Sistema UI mobile + pantallas de pitch',
    outcome: 'Deck fintech LATAM con patrones bancarios consistentes',
  },
  {
    title: 'AWE MX',
    type: 'Comunidad',
    url: LINKS.awe,
    image: SHARED_IMAGES.awe,
    contributions: 'UX · UI · Webflow · Estructura CMS · Plantillas de eventos',
    stack: 'Webflow, colecciones CMS',
    deliverable: 'Hub comunitario + plantillas de eventos',
    outcome: 'Equipo no técnico publica eventos sin ingeniería',
  },
]

export function getAdditionalWorkItems(locale: string): AdditionalWorkItem[] {
  return locale === 'es' ? additionalWorkItemsEs : additionalWorkItemsEn
}
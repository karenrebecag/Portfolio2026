export type AdditionalWorkItem = {
  title: string
  type: string
  url?: string
  image: string
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
  { title: 'Ingles Individual', type: 'Fullstack Platform', url: LINKS.figmaPortfolio, image: SHARED_IMAGES.ingles },
  { title: 'JarvioAI Canvas', type: 'UI Prototype', url: LINKS.jarvio, image: SHARED_IMAGES.jarvio },
  { title: 'ToTou Energy Bars', type: 'Complete Site', url: LINKS.totou, image: SHARED_IMAGES.totou },
  { title: 'Cadence OTC', type: 'E-Commerce', url: LINKS.cadence, image: SHARED_IMAGES.cadence },
  { title: 'Metaverse Dashboard', type: 'Landing Page', url: LINKS.metaverse, image: SHARED_IMAGES.metaverse },
  { title: 'Health-Ade Kombucha', type: 'E-Commerce', url: LINKS.healthAde, image: SHARED_IMAGES.healthAde },
  { title: 'Ancient Tech', type: 'Complete Site', url: LINKS.figmaPortfolio, image: SHARED_IMAGES.ancient },
  { title: 'Zachariel Banking', type: 'Fintech', url: LINKS.zachariel, image: SHARED_IMAGES.zachariel },
  { title: 'AWE MX', type: 'Community', url: LINKS.awe, image: SHARED_IMAGES.awe },
]

export const additionalWorkItemsEs: AdditionalWorkItem[] = [
  { title: 'Ingles Individual', type: 'Plataforma fullstack', url: LINKS.figmaPortfolio, image: SHARED_IMAGES.ingles },
  { title: 'JarvioAI Canvas', type: 'Prototipo UI', url: LINKS.jarvio, image: SHARED_IMAGES.jarvio },
  { title: 'ToTou Energy Bars', type: 'Sitio completo', url: LINKS.totou, image: SHARED_IMAGES.totou },
  { title: 'Cadence OTC', type: 'E-commerce', url: LINKS.cadence, image: SHARED_IMAGES.cadence },
  { title: 'Metaverse Dashboard', type: 'Landing page', url: LINKS.metaverse, image: SHARED_IMAGES.metaverse },
  { title: 'Health-Ade Kombucha', type: 'E-commerce', url: LINKS.healthAde, image: SHARED_IMAGES.healthAde },
  { title: 'Ancient Tech', type: 'Sitio completo', url: LINKS.figmaPortfolio, image: SHARED_IMAGES.ancient },
  { title: 'Zachariel Banking', type: 'Fintech', url: LINKS.zachariel, image: SHARED_IMAGES.zachariel },
  { title: 'AWE MX', type: 'Comunidad', url: LINKS.awe, image: SHARED_IMAGES.awe },
]

export function getAdditionalWorkItems(locale: string): AdditionalWorkItem[] {
  return locale === 'es' ? additionalWorkItemsEs : additionalWorkItemsEn
}
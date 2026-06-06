export const HERO_IMAGE_CDN = 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev'

/** Full-bleed parallax hero backgrounds (R2). */
export const HERO_IMAGES = {
  home: `${HERO_IMAGE_CDN}/jj.webp`,
  homeAboutSection: `${HERO_IMAGE_CDN}/Artboard%201.webp`,
  about: `${HERO_IMAGE_CDN}/melight.webp`,
} as const

/** Hero image to warm-cache when the user hovers an internal link. */
export const ROUTE_HERO_PREFETCH: Record<string, string> = {
  '/': HERO_IMAGES.home,
  '/about': HERO_IMAGES.about,
}

const prefetched = new Set<string>()

/** Client-side image warm-up (hover / transition). Idempotent. */
export function prefetchHeroImage(url: string) {
  if (typeof window === 'undefined' || prefetched.has(url)) return
  prefetched.add(url)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

export function prefetchHeroForRoute(pathname: string) {
  const path = pathname.split('#')[0] || '/'
  const url = ROUTE_HERO_PREFETCH[path]
  if (url) prefetchHeroImage(url)
}
/** Canonical production origin. Used for metadataBase, sitemap, robots and JSON-LD. */
export const SITE_URL = 'https://karenrebecaortiz.com'

const OG_LOCALE: Record<string, string> = { es: 'es_ES', en: 'en_US' }

/**
 * Resolve a logical page path to its localized URL under the `as-needed`
 * prefix strategy (es = no prefix, en = `/en`). Pass '/' for the home page.
 */
export function localizedPath(locale: string, path: string): string {
  const clean = path === '/' ? '' : path
  return locale === 'es' ? clean || '/' : `/en${clean}`
}

export function ogLocale(locale: string): string {
  return OG_LOCALE[locale] ?? 'es_ES'
}

/** Canonical + reciprocal hreflang alternates for a logical page path. */
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      es: localizedPath('es', path),
      en: localizedPath('en', path),
      'x-default': localizedPath('es', path),
    },
  }
}

import { routing } from '@/i18n/routing'

/**
 * Strips locale prefix from a pathname for next-intl's router (expects locale-less paths).
 * e.g. `/en/about` → `/about`, `/es` → `/`, `/#projects` unchanged for default locale.
 */
export function stripLocalePrefix(href: string): string {
  if (!href.startsWith('/')) return href

  const hashIndex = href.indexOf('#')
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : ''
  let pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href

  let changed = true
  while (changed) {
    changed = false
    for (const locale of routing.locales) {
      const prefix = `/${locale}`
      if (pathPart === prefix) {
        pathPart = '/'
        changed = true
        break
      }
      if (pathPart.startsWith(`${prefix}/`)) {
        pathPart = pathPart.slice(prefix.length) || '/'
        changed = true
        break
      }
    }
  }

  return (pathPart || '/') + hash
}
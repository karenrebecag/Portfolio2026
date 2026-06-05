import type { MetadataRoute } from 'next'
import { SITE_URL, localizedPath } from '@/lib/seo'

// Main portfolio surfaces only. Article/project-detail routes are intentionally
// excluded here per scope.
const PATHS = ['/', '/about']

const LAST_MODIFIED = new Date('2026-06-04')

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}${localizedPath('es', path)}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
    alternates: {
      languages: {
        es: `${SITE_URL}${localizedPath('es', path)}`,
        en: `${SITE_URL}${localizedPath('en', path)}`,
        'x-default': `${SITE_URL}${localizedPath('es', path)}`,
      },
    },
  }))
}

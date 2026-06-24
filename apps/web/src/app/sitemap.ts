import type { MetadataRoute } from 'next'
import {
  getAllArticleSlugs,
  getArticleProjectByArticleSlug,
  getClientWorkProjectBySlug,
  getClientWorkSlugs,
} from '@/lib/article-projects'
import { buildSitemapEntry, SITE_URL, localizedPath } from '@/lib/seo'

type SitemapEntry = MetadataRoute.Sitemap[number]

function buildEnEntry(
  path: string,
  lastModified: Date,
  changeFrequency: SitemapEntry['changeFrequency'],
  priority: number,
): SitemapEntry {
  const esUrl = `${SITE_URL}${localizedPath('es', path)}`
  const enUrl = `${SITE_URL}${localizedPath('en', path)}`
  return {
    url: enUrl,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        es: esUrl,
        en: enUrl,
        'x-default': esUrl,
      },
    },
  }
}

const STATIC_PAGES: {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}[] = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.7, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PAGES.map(({ path, priority, changeFrequency }) =>
    buildSitemapEntry({ path, priority, changeFrequency }),
  )

  const articleEntries = getAllArticleSlugs().flatMap((slug) => {
    const project = getArticleProjectByArticleSlug(slug)
    const lastModified = project?.updatedAt ? new Date(project.updatedAt) : new Date('2026-06-04')
    const path = `/articulos/${slug}`

    return [
      buildSitemapEntry({ path, lastModified, changeFrequency: 'weekly', priority: 0.85 }),
      buildEnEntry(path, lastModified, 'weekly', 0.85),
    ]
  })

  const clientWorkEntries = getClientWorkSlugs().flatMap((slug) => {
    const project = getClientWorkProjectBySlug(slug)
    const lastModified = project?.updatedAt ? new Date(project.updatedAt) : new Date('2026-06-04')
    const path = `/projects/${slug}`

    return [
      buildSitemapEntry({ path, lastModified, changeFrequency: 'monthly', priority: 0.75 }),
      buildEnEntry(path, lastModified, 'monthly', 0.75),
    ]
  })

  return [...staticEntries, ...articleEntries, ...clientWorkEntries]
}
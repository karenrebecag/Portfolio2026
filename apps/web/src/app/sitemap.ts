import type { MetadataRoute } from 'next'
import { getAllArticleSlugs, getArticleProjectByArticleSlug } from '@/lib/article-projects'
import { buildSitemapEntry } from '@/lib/seo'

const STATIC_PAGES: {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}[] = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PAGES.map(({ path, priority, changeFrequency }) =>
    buildSitemapEntry({ path, priority, changeFrequency }),
  )

  const articleEntries = getAllArticleSlugs().map((slug) => {
    const project = getArticleProjectByArticleSlug(slug)
    const lastModified = project?.updatedAt ? new Date(project.updatedAt) : new Date('2026-06-04')

    return buildSitemapEntry({
      path: `/articulos/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  })

  return [...staticEntries, ...articleEntries]
}
import { atomWebflowMeta } from '@/content/projects/atom-webflow'
import { designSystemShipsItselfMeta } from '@/content/projects/design-system-ships-itself'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import type { Project } from '@karen-portfolio/shared'

type ArticleProjectMeta = {
  slug: string
  articleSlug: string
  year: string
}

/** Project slugs that have a dedicated /articulos/[slug] page. */
export const ARTICLE_PROJECT_REGISTRY: ArticleProjectMeta[] = [
  {
    slug: atomWebflowMeta.slug,
    articleSlug: atomWebflowMeta.articleSlug,
    year: atomWebflowMeta.year,
  },
  {
    slug: designSystemShipsItselfMeta.slug,
    articleSlug: designSystemShipsItselfMeta.articleSlug,
    year: designSystemShipsItselfMeta.year,
  },
]

export function getArticleProjectBySlug(projectSlug: string) {
  return PLACEHOLDER_PROJECTS.find((p) => p.slug === projectSlug) ?? null
}

export function getArticleProjectByArticleSlug(articleSlug: string) {
  const entry = ARTICLE_PROJECT_REGISTRY.find((a) => a.articleSlug === articleSlug)
  if (!entry) return null
  return getArticleProjectBySlug(entry.slug)
}

export function getArticleMetaForProject(project: Project & { year?: string }) {
  const entry = ARTICLE_PROJECT_REGISTRY.find((a) => a.slug === project.slug)
  return entry ?? null
}

export function getAllArticleSlugs() {
  return ARTICLE_PROJECT_REGISTRY.map((a) => a.articleSlug)
}

export function getArticleSlugForProject(projectSlug: string) {
  return ARTICLE_PROJECT_REGISTRY.find((a) => a.slug === projectSlug)?.articleSlug ?? null
}

/** Home / list links: article URL when a long-form piece exists, otherwise case study. */
export function getProjectHref(projectSlug: string) {
  const articleSlug = getArticleSlugForProject(projectSlug)
  return articleSlug ? `/articulos/${articleSlug}` : `/projects/${projectSlug}`
}

export function isArticleProject(projectSlug: string) {
  return ARTICLE_PROJECT_REGISTRY.some((a) => a.slug === projectSlug)
}
import {
  getCanonicalRoute,
  isArticleRoute,
  type RoutableProjectMeta,
} from '@/content/projects/project-routing'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import type { Project } from '@karen-portfolio/shared'

export type { CanonicalRoute } from '@/content/projects/project-routing'

type RoutableProject = Project &
  RoutableProjectMeta & {
    year?: string
  }

function asRoutable(project: (typeof PLACEHOLDER_PROJECTS)[number]): RoutableProject {
  return project as RoutableProject
}

export function getArticleProjectBySlug(projectSlug: string) {
  return PLACEHOLDER_PROJECTS.find((p) => p.slug === projectSlug) ?? null
}

export function getArticleProjectByArticleSlug(articleSlug: string) {
  return (
    PLACEHOLDER_PROJECTS.find((p) => {
      const routable = asRoutable(p)
      return routable.articleSlug === articleSlug && isArticleRoute(routable)
    }) ?? null
  )
}

export function getArticleMetaForProject(project: Project & RoutableProjectMeta & { year?: string }) {
  if (!project.articleSlug) return null

  return {
    slug: project.slug,
    articleSlug: project.articleSlug,
    year: project.year ?? '2026',
    canonicalRoute: getCanonicalRoute(project),
  }
}

export function getAllArticleSlugs() {
  return PLACEHOLDER_PROJECTS.flatMap((p) => {
    const routable = asRoutable(p)
    return isArticleRoute(routable) && routable.articleSlug ? [routable.articleSlug] : []
  })
}

export function getArticleSlugForProject(projectSlug: string) {
  const project = getArticleProjectBySlug(projectSlug)
  if (!project) return null

  const routable = asRoutable(project)
  return isArticleRoute(routable) ? routable.articleSlug ?? null : null
}

/** Legacy /articulos/* URLs that now canonicalize under /projects/*. */
export function getClientWorkRedirectForArticleSlug(articleSlug: string) {
  const project = PLACEHOLDER_PROJECTS.find((p) => {
    const routable = asRoutable(p)
    return routable.articleSlug === articleSlug && getCanonicalRoute(routable) === 'project'
  })

  return project ? `/projects/${project.slug}` : null
}

/** Home / list links: article URL when a long-form piece lives at /articulos, otherwise case study. */
export function getProjectHref(projectSlug: string) {
  const articleSlug = getArticleSlugForProject(projectSlug)
  return articleSlug ? `/articulos/${articleSlug}` : `/projects/${projectSlug}`
}

export function isArticleProject(projectSlug: string) {
  const project = getArticleProjectBySlug(projectSlug)
  if (!project) return false
  return isArticleRoute(asRoutable(project))
}

/** Published case studies shown under “Client work” (not long-form /articulos). */
export function getClientWorkSlugs() {
  return PLACEHOLDER_PROJECTS.filter(
    (p) => p.status === 'published' && !isArticleProject(p.slug),
  ).map((p) => p.slug)
}

export function getClientWorkProjectBySlug(slug: string) {
  const project = PLACEHOLDER_PROJECTS.find((p) => p.slug === slug)
  if (!project || project.status !== 'published' || isArticleProject(slug)) return null
  return project
}
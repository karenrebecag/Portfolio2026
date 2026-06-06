/** Where the canonical long-form URL lives for a piece of content. */
export type CanonicalRoute = 'article' | 'project'

export type RoutableProjectMeta = {
  slug: string
  articleSlug?: string
  canonicalRoute?: CanonicalRoute
  year?: string
}

export function getCanonicalRoute(meta: RoutableProjectMeta): CanonicalRoute {
  return meta.canonicalRoute ?? 'project'
}

export function isArticleRoute(meta: RoutableProjectMeta): boolean {
  return Boolean(meta.articleSlug) && getCanonicalRoute(meta) === 'article'
}
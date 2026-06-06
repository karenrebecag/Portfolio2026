type ProjectI18nEntry = {
  title: string
  summary: string
  description?: string
  role?: string
  services?: string
  lexical?: unknown
  blocks?: unknown[]
}

type LocalizableProject = {
  title: string
  summary: string
  description?: unknown
  role?: string
  services?: string
  i18n?: Record<string, ProjectI18nEntry>
}

/** Hero copy only — never the Lexical `{ root }` body object. */
export function getProjectHeroDescription(project: LocalizableProject, locale: string): string {
  const localized = project.i18n?.[locale]
  if (typeof localized?.description === 'string' && localized.description.trim()) {
    return localized.description
  }
  if (typeof project.description === 'string' && project.description.trim()) {
    return project.description
  }
  return localized?.summary ?? project.summary
}

/** Long-form article body for RichTextRenderer. */
export function getProjectBodyContent(
  project: LocalizableProject,
  locale: string,
): { root?: unknown } | null {
  const localized = project.i18n?.[locale]
  if (
    localized?.lexical &&
    typeof localized.lexical === 'object' &&
    'root' in (localized.lexical as object)
  ) {
    return localized.lexical as { root?: unknown }
  }
  if (
    project.description &&
    typeof project.description === 'object' &&
    'root' in (project.description as object)
  ) {
    return project.description as { root?: unknown }
  }
  return null
}

export function getLocalizedProject<T extends LocalizableProject>(project: T, locale: string): T {
  const localized = project.i18n?.[locale]
  if (!localized) return project

  return {
    ...project,
    title: localized.title || project.title,
    summary: localized.summary || project.summary,
    ...(typeof localized.description === 'string' ? { description: localized.description } : {}),
    ...(localized.role ? { role: localized.role } : {}),
    ...(localized.services ? { services: localized.services } : {}),
  }
}
type ProjectI18nEntry = {
  title: string
  summary: string
  role?: string
  services?: string
  lexical?: unknown
  blocks?: unknown[]
}

type LocalizableProject = {
  title: string
  summary: string
  role?: string
  services?: string
  i18n?: Record<string, ProjectI18nEntry>
}

export function getLocalizedProject<T extends LocalizableProject>(project: T, locale: string): T {
  const localized = project.i18n?.[locale]
  if (!localized) return project

  return {
    ...project,
    title: localized.title || project.title,
    summary: localized.summary || project.summary,
    ...(localized.role ? { role: localized.role } : {}),
    ...(localized.services ? { services: localized.services } : {}),
  }
}
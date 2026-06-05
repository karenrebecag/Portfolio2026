/** Status bar / browser chrome — matches `--surface` and `--background` in globals.css */

export type SiteThemeId = 'light' | 'dark' | 'mono'
export type SectionTheme = 'light' | 'dark'

export const THEME_META_COLORS: Record<
  SiteThemeId,
  Record<SectionTheme, `#${string}`>
> = {
  light: { dark: '#11221f', light: '#fdf9ed' },
  dark: { dark: '#070806', light: '#0c0e0a' },
  mono: { dark: '#14171d', light: '#e8e6e1' },
}

export function resolveStatusBarColor(
  siteTheme: SiteThemeId,
  sectionTheme: SectionTheme,
): string {
  return THEME_META_COLORS[siteTheme][sectionTheme]
}

export function getSiteThemeFromDocument(): SiteThemeId {
  if (typeof document === 'undefined') return 'light'
  const html = document.documentElement
  if (html.classList.contains('mono')) return 'mono'
  if (html.classList.contains('dark')) return 'dark'
  return 'light'
}

export function getSectionThemeFromDocument(): SectionTheme {
  if (typeof document === 'undefined') return 'dark'
  return document.body.getAttribute('data-section-theme') === 'light' ? 'light' : 'dark'
}
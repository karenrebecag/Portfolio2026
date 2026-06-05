import {
  getSectionThemeFromDocument,
  getSiteThemeFromDocument,
  resolveStatusBarColor,
  type SectionTheme,
  type SiteThemeId,
} from '@/lib/theme-meta-colors'

const THEME_COLOR = 'theme-color'
const APPLE_STATUS = 'apple-mobile-web-app-status-bar-style'

function ensureMeta(name: string): HTMLMetaElement {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  return el
}

/** Solid status bar tint on iOS Safari / mobile WebKit (and Android Chrome). */
export function syncThemeColorMeta(
  siteTheme: SiteThemeId = getSiteThemeFromDocument(),
  sectionTheme: SectionTheme = getSectionThemeFromDocument(),
) {
  const color = resolveStatusBarColor(siteTheme, sectionTheme)
  ensureMeta(THEME_COLOR).setAttribute('content', color)
  ensureMeta(APPLE_STATUS).setAttribute(
    'content',
    sectionTheme === 'dark' ? 'black' : 'default',
  )
}
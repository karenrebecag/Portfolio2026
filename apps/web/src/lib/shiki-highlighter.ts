import type { Highlighter } from 'shiki'

const BUNDLED_LANGS = [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'json',
  'html',
  'css',
  'bash',
  'shell',
  'markdown',
  'python',
  'sql',
  'yaml',
] as const

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighter }, { portfolioLight, portfolioDark }] = await Promise.all([
        import('shiki'),
        import('@/lib/shiki-themes'),
      ])
      return createHighlighter({
        themes: [portfolioLight, portfolioDark],
        langs: [...BUNDLED_LANGS],
      })
    })()
  }
  return highlighterPromise
}

function normalizeLanguage(language: string): string {
  if (!language || language === 'text') return 'javascript'
  return language.toLowerCase()
}

export async function highlightPortfolioCode(code: string, language: string): Promise<string> {
  const highlighter = await getHighlighter()
  const lang = normalizeLanguage(language)
  const themes = { light: 'portfolio-light', dark: 'portfolio-dark' } as const

  if (highlighter.getLoadedLanguages().includes(lang)) {
    return highlighter.codeToHtml(code, { lang, themes, defaultColor: false })
  }

  try {
    await highlighter.loadLanguage(lang as Parameters<Highlighter['loadLanguage']>[0])
    return highlighter.codeToHtml(code, { lang, themes, defaultColor: false })
  } catch {
    return highlighter.codeToHtml(code, { lang: 'javascript', themes, defaultColor: false })
  }
}
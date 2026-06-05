export type MermaidThemeColors = {
  dark: boolean
  bg: string
  fg: string
  muted: string
  border: string
  plantation: string
  surface: string
}

type MermaidModule = typeof import('mermaid').default

let mermaidModule: MermaidModule | null = null
let mermaidLoadPromise: Promise<MermaidModule> | null = null
let lastThemeKey: string | null = null

export async function loadMermaid(): Promise<MermaidModule> {
  if (mermaidModule) return mermaidModule
  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import('mermaid').then((mod) => {
      mermaidModule = mod.default
      return mermaidModule
    })
  }
  return mermaidLoadPromise
}

function themeKey(colors: MermaidThemeColors): string {
  return [colors.dark, colors.bg, colors.fg, colors.plantation, colors.border].join('|')
}

/** Match `.code-block__body` (0.875rem ≈ 14px). */
const MERMAID_FONT_SIZE = '14px'

export function buildMermaidThemeVariables(colors: MermaidThemeColors) {
  return {
    fontSize: MERMAID_FONT_SIZE,
    labelFontSize: MERMAID_FONT_SIZE,
    actorFontSize: MERMAID_FONT_SIZE,
    noteFontSize: MERMAID_FONT_SIZE,
    messageFontSize: MERMAID_FONT_SIZE,
    taskFontSize: MERMAID_FONT_SIZE,
    sectionFontSize: MERMAID_FONT_SIZE,
    primaryColor: colors.dark ? colors.surface : colors.bg,
    primaryTextColor: colors.fg,
    primaryBorderColor: colors.border,
    lineColor: colors.muted,
    secondaryColor: colors.dark ? '#161814' : '#f3eedf',
    tertiaryColor: colors.dark ? colors.surface : colors.bg,
    background: colors.bg,
    mainBkg: colors.dark ? colors.surface : '#f3eedf',
    nodeBorder: colors.plantation,
    clusterBkg: colors.bg,
    clusterBorder: colors.border,
    titleColor: colors.fg,
    edgeLabelBackground: colors.bg,
    textColor: colors.fg,
    labelTextColor: colors.fg,
    actorTextColor: colors.fg,
    actorBkg: colors.dark ? colors.surface : '#f3eedf',
    actorBorder: colors.plantation,
    actorLineColor: colors.muted,
    signalColor: colors.fg,
    signalTextColor: colors.fg,
    noteBkgColor: colors.dark ? colors.surface : '#f3eedf',
    noteTextColor: colors.fg,
    noteBorderColor: colors.border,
    activationBkgColor: colors.dark ? colors.surface : '#f3eedf',
    activationBorderColor: colors.plantation,
    sequenceNumberColor: colors.fg,
  }
}

export async function renderMermaidDiagram(
  code: string,
  id: string,
  colors: MermaidThemeColors,
): Promise<string> {
  const mermaid = await loadMermaid()
  const key = themeKey(colors)

  if (key !== lastThemeKey) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: buildMermaidThemeVariables(colors),
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      flowchart: { curve: 'basis', htmlLabels: true },
      suppressErrorRendering: true,
    })
    lastThemeKey = key
  }

  const cleaned = code.replace(/\\n/g, '\n').trim()
  const { svg } = await mermaid.render(id, cleaned)
  return svg
}

/** Article page diagram — fixed brand palette, no theme observer. */
export async function renderArticleMermaidDiagram(code: string, id: string): Promise<string> {
  const mermaid = await loadMermaid()

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontSize: MERMAID_FONT_SIZE,
      labelFontSize: MERMAID_FONT_SIZE,
      actorFontSize: MERMAID_FONT_SIZE,
      noteFontSize: MERMAID_FONT_SIZE,
      messageFontSize: MERMAID_FONT_SIZE,
      taskFontSize: MERMAID_FONT_SIZE,
      sectionFontSize: MERMAID_FONT_SIZE,
      primaryColor: '#11221f',
      primaryTextColor: '#fdf9ed',
      primaryBorderColor: '#458776',
      lineColor: '#458776',
      secondaryColor: '#88C0AF',
      tertiaryColor: '#253c37',
    },
    flowchart: { curve: 'basis', htmlLabels: true },
    suppressErrorRendering: true,
  })

  const cleaned = dedentMermaidSource(code)
  const { svg } = await mermaid.render(id, cleaned)
  return svg
}

function dedentMermaidSource(input: string): string {
  const lines = input.split('\n')
  const nonBlank = lines.filter((l) => l.trim().length > 0)
  if (nonBlank.length === 0) return input.trim()
  const min = Math.min(...nonBlank.map((l) => (l.match(/^(\s*)/)?.[1]?.length ?? 0)))
  return lines.map((l) => (l.length >= min ? l.slice(min) : l)).join('\n').trim()
}
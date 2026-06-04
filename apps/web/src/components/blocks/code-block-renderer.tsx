import { createHighlighter } from 'shiki'

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['tsx', 'typescript', 'javascript', 'css', 'json', 'html', 'bash', 'python', 'markdown', 'yaml'],
    })
  }
  return highlighterPromise
}

export async function CodeBlockRenderer({
  code,
  language,
  title,
}: {
  code: string
  language: string
  title?: string
}) {
  let html = ''
  try {
    const h = await getHighlighter()
    const lang = h.getLoadedLanguages().includes(language as any) ? language : 'text'
    html = h.codeToHtml(code, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
  } catch {
    html = `<pre><code>${code.replace(/</g, '&lt;')}</code></pre>`
  }

  return (
    <div className="relative my-4 rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
      {title && (
        <div className="px-3 py-2 border-b border-zinc-300 dark:border-zinc-700 text-sm font-mono text-zinc-500 bg-zinc-50 dark:bg-zinc-900">
          {title}
        </div>
      )}
      <pre
        className="overflow-x-auto p-4 text-sm [&_code]:bg-transparent [&_pre]:bg-transparent bg-white dark:bg-zinc-900"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

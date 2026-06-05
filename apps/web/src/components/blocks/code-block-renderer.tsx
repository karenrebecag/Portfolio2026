'use client'

import { useEffect, useState } from 'react'
import { highlightPortfolioCode } from '@/lib/shiki-highlighter'

export function CodeBlockRenderer({
  code,
  language,
  title,
}: {
  code: string
  language: string
  title?: string
}) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    let cancelled = false

    highlightPortfolioCode(code, language)
      .then((result) => {
        if (!cancelled) setHtml(result)
      })
      .catch(() => {
        if (!cancelled) {
          setHtml(`<pre class="shiki"><code>${code.replace(/</g, '&lt;')}</code></pre>`)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, language])

  return (
    <figure
      className="code-block not-prose w-full max-w-none border border-border overflow-hidden"
      style={{ borderRadius: '2px' }}
    >
      {title && (
        <figcaption className="code-block__title px-4 py-2 border-b border-border text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground bg-muted">
          {title}
        </figcaption>
      )}
      {html ? (
        <div className="code-block__body" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="code-block__body code-block__body--plain">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  )
}
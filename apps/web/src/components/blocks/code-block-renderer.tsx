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
          setHtml(`<pre><code>${code.replace(/</g, '&lt;')}</code></pre>`)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, language])

  return (
    <div className="relative my-4 border border-border overflow-hidden" style={{ borderRadius: '2px' }}>
      {title && (
        <div className="px-4 py-2 border-b border-border text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground bg-muted">
          {title}
        </div>
      )}
      {html ? (
        <pre
          className="overflow-x-auto p-4 text-sm font-accent bg-background [&_code]:bg-transparent [&_pre]:bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-sm font-accent bg-background text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
'use client'

import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

function useIsDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const html = document.documentElement
    setDark(html.classList.contains('dark'))
    const observer = new MutationObserver(() => setDark(html.classList.contains('dark')))
    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return dark
}

export function MermaidRenderer({ code, title }: { code: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState(false)
  const uniqueId = useId().replace(/:/g, '')
  const dark = useIsDark()

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: dark
        ? {
            primaryColor: '#27272a',
            primaryTextColor: '#fafafa',
            primaryBorderColor: '#3f3f46',
            lineColor: '#71717b',
            secondaryColor: '#18181b',
            tertiaryColor: '#27272a',
            background: '#151313',
            mainBkg: '#27272a',
            nodeBorder: '#3f3f46',
            clusterBkg: '#1a1a1e',
            clusterBorder: '#3f3f46',
            titleColor: '#fafafa',
            edgeLabelBackground: '#27272a',
            textColor: '#fafafa',
          }
        : {
            primaryColor: '#f4f4f5',
            primaryTextColor: '#09090b',
            primaryBorderColor: '#e4e4e7',
            lineColor: '#71717b',
            secondaryColor: '#fafafa',
            tertiaryColor: '#f4f4f5',
            background: '#ffffff',
            mainBkg: '#f4f4f5',
            nodeBorder: '#e4e4e7',
            clusterBkg: '#fafafa',
            clusterBorder: '#e4e4e7',
            titleColor: '#09090b',
            edgeLabelBackground: '#ffffff',
            textColor: '#09090b',
          },
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      suppressErrorRendering: true,
    })

    const cleaned = code.replace(/\\n/g, '\n').trim()
    const id = `mermaid-${uniqueId}-${Date.now()}`

    mermaid.render(id, cleaned)
      .then(({ svg: rendered }) => {
        setSvg(rendered)
        setError(false)
      })
      .catch(() => {
        setError(true)
      })
  }, [code, dark, uniqueId])

  if (error) {
    return (
      <figure className="not-prose my-4">
        {title && <figcaption className="text-xs text-zinc-500 mb-2 font-medium">{title}</figcaption>}
        <pre className="overflow-x-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-4 text-xs font-mono text-zinc-500">
          {code}
        </pre>
      </figure>
    )
  }

  return (
    <figure className="not-prose my-4">
      {title && <figcaption className="text-xs text-zinc-500 mb-2 font-medium">{title}</figcaption>}
      <div
        ref={containerRef}
        className="overflow-x-auto rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
        style={{ background: dark ? '#151313' : '#ffffff' }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  )
}

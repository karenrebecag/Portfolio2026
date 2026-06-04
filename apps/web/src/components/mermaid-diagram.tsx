'use client'

import { useEffect, useRef } from 'react'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

/**
 * Mermaid diagram renderer.
 * Loads Mermaid from CDN (no extra npm dependency).
 * Renders on client only.
 *
 * Usage:
 * <MermaidDiagram chart={`graph TD\n  A[Webflow] --> B[Custom Code]`} />
 */
export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    let cancelled = false

    function dedent(input: string): string {
      const lines = input.split('\n')
      const nonBlank = lines.filter((l) => l.trim().length > 0)
      if (nonBlank.length === 0) return input.trim()
      const indents = nonBlank.map((l) => {
        const m = l.match(/^(\s*)/)
        return m ? m[1].length : 0
      })
      const min = Math.min(...indents)
      return lines.map((l) => (l.length >= min ? l.slice(min) : l)).join('\n').trim()
    }

    async function loadAndRender() {
      if (typeof window === 'undefined' || !containerRef.current) return

      // @ts-ignore - dynamic global
      if (!window.mermaid) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
          script.async = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Mermaid'))
          document.head.appendChild(script)
        })
      }

      if (cancelled || !containerRef.current) return

      // @ts-ignore
      const mermaid = window.mermaid

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#11221f',
          primaryTextColor: '#fdf9ed',
          primaryBorderColor: '#458776',
          lineColor: '#458776',
          secondaryColor: '#88C0AF',
          tertiaryColor: '#253c37',
        },
        flowchart: {
          curve: 'basis',
          htmlLabels: true,
        },
      })

      try {
        const clean = dedent(chart)
        const { svg } = await mermaid.render(idRef.current, clean)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        if (!cancelled && containerRef.current) {
          const msg = (err as Error).message || String(err)
          containerRef.current.innerHTML = `<pre class="text-red-500 text-xs p-4 bg-red-950/10 rounded overflow-auto">Mermaid render error: ${msg}\n\nDiagram source (first 200 chars):\n${chart.slice(0, 200)}...</pre>`
        }
      }
    }

    loadAndRender()

    return () => {
      cancelled = true
    }
  }, [chart])

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram my-8 flex justify-center overflow-x-auto rounded-lg border border-border bg-surface p-4 ${className}`}
      aria-label="Mermaid diagram"
    />
  )
}

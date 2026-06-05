'use client'

import { useEffect, useId, useRef } from 'react'
import { renderArticleMermaidDiagram } from '@/lib/mermaid-runtime'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!containerRef.current) return
      try {
        const svg = await renderArticleMermaidDiagram(chart, `article-mermaid-${id}`)
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

    render()

    return () => {
      cancelled = true
    }
  }, [chart, id])

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram my-8 flex justify-center overflow-x-auto rounded-lg border border-border bg-surface p-4 ${className}`}
      aria-label="Mermaid diagram"
    />
  )
}
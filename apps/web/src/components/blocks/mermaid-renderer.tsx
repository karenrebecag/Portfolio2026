'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { loadMermaid, renderMermaidDiagram, type MermaidThemeColors } from '@/lib/mermaid-runtime'

function useThemeColors(): MermaidThemeColors {
  const [colors, setColors] = useState<MermaidThemeColors>({
    dark: false,
    bg: '#fdf9ed',
    fg: '#11221f',
    muted: '#71717a',
    border: '#e4dfcf',
    plantation: '#366B5E',
    surface: '#11221f',
  })

  useEffect(() => {
    function read() {
      const html = document.documentElement
      const style = getComputedStyle(html)
      const dark = html.classList.contains('dark')
      setColors({
        dark,
        bg: style.getPropertyValue('--background').trim() || (dark ? '#0c0e0a' : '#fdf9ed'),
        fg: style.getPropertyValue('--foreground').trim() || (dark ? '#ECDFCC' : '#11221f'),
        muted: style.getPropertyValue('--muted-foreground').trim() || '#71717a',
        border: style.getPropertyValue('--border').trim() || '#e4dfcf',
        plantation: style.getPropertyValue('--plantation').trim() || '#366B5E',
        surface: style.getPropertyValue('--surface').trim() || '#11221f',
      })
    }

    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return colors
}

export function MermaidRenderer({ code, title }: { code: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  const uniqueId = useId().replace(/:/g, '')
  const colors = useThemeColors()

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${uniqueId}-${Date.now()}`

    async function render() {
      try {
        await loadMermaid()
        const rendered = await renderMermaidDiagram(code, id, colors)
        if (!cancelled) {
          setSvg(rendered)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [code, colors, uniqueId])

  if (error) {
    return (
      <figure className="not-prose my-4">
        {title && <figcaption className="text-xs text-muted-foreground mb-2 font-medium">{title}</figcaption>}
        <pre className="overflow-x-auto rounded-none border border-border bg-muted p-4 text-xs font-mono text-muted-foreground">
          {code}
        </pre>
      </figure>
    )
  }

  return (
    <figure className="not-prose my-4">
      {title && <figcaption className="text-xs text-muted-foreground mb-2 font-medium">{title}</figcaption>}
      <div
        ref={containerRef}
        className="overflow-x-auto rounded-none border border-border p-4 [&_svg]:mx-auto [&_svg]:max-w-full bg-background"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  )
}
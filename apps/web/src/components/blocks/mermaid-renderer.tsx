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
      <figure className="mermaid-block not-prose w-full max-w-none border border-border overflow-hidden" style={{ borderRadius: '2px' }}>
        {title && (
          <figcaption className="mermaid-block__title px-4 py-2 border-b border-border text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground bg-muted">
            {title}
          </figcaption>
        )}
        <pre className="mermaid-block__body mermaid-block__body--plain">
          <code>{code}</code>
        </pre>
      </figure>
    )
  }

  return (
    <figure
      className="mermaid-block not-prose w-full max-w-none border border-border overflow-hidden"
      style={{ borderRadius: '2px' }}
    >
      {title && (
        <figcaption className="mermaid-block__title px-4 py-2 border-b border-border text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground bg-muted">
          {title}
        </figcaption>
      )}
      <div
        ref={containerRef}
        className="mermaid-block__body"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  )
}
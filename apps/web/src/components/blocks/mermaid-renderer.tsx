'use client'

import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

function useThemeColors() {
  const [colors, setColors] = useState<{ dark: boolean; bg: string; fg: string; muted: string; border: string; plantation: string; surface: string }>({
    dark: false, bg: '#fdf9ed', fg: '#11221f', muted: '#71717a', border: '#e4dfcf', plantation: '#366B5E', surface: '#11221f',
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
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState(false)
  const uniqueId = useId().replace(/:/g, '')
  const colors = useThemeColors()

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
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

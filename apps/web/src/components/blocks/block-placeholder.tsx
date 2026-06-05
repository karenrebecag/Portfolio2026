export function CodeBlockPlaceholder({ title }: { title?: string }) {
  return (
    <div className="relative my-4 border border-border overflow-hidden animate-pulse" style={{ borderRadius: '2px' }}>
      {title && <div className="h-9 border-b border-border bg-muted" />}
      <div className="h-32 bg-muted/40" />
    </div>
  )
}

export function MermaidBlockPlaceholder({ title }: { title?: string }) {
  return (
    <figure className="not-prose my-4 animate-pulse">
      {title && <div className="mb-2 h-4 w-32 rounded bg-muted" />}
      <div className="h-48 border border-border bg-muted/30" />
    </figure>
  )
}
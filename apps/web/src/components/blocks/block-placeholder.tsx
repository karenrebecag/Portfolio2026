export function CodeBlockPlaceholder({ title }: { title?: string }) {
  return (
    <figure
      className="code-block w-full border border-border overflow-hidden animate-pulse"
      style={{ borderRadius: '2px' }}
    >
      {title && <div className="h-9 border-b border-border bg-muted" />}
      <div className="code-block__body h-32 bg-muted/40" />
    </figure>
  )
}

export function MermaidBlockPlaceholder({ title }: { title?: string }) {
  return (
    <figure
      className="mermaid-block w-full border border-border overflow-hidden animate-pulse"
      style={{ borderRadius: '2px' }}
    >
      {title && <div className="h-9 border-b border-border bg-muted" />}
      <div className="mermaid-block__body h-48 bg-muted/30" />
    </figure>
  )
}
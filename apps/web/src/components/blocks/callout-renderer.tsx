const typeConfig: Record<string, { accent: string; label: string }> = {
  info: { accent: 'var(--plantation)', label: 'Info' },
  warning: { accent: 'var(--plantation)', label: 'Warning' },
  tip: { accent: 'var(--plantation)', label: 'Tip' },
  caution: { accent: 'var(--plantation)', label: 'Caution' },
}

export function CalloutRenderer({
  type = 'info',
  text,
}: {
  type: string
  text: string
}) {
  const config = typeConfig[type] ?? typeConfig.info

  return (
    <div
      className="my-6 border-l-2 bg-muted/50 px-5 py-4"
      style={{ borderColor: config.accent }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">{config.label}</span>
      <p className="mt-1 text-sm leading-relaxed">{text}</p>
    </div>
  )
}

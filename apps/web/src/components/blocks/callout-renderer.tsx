import { ArticleInlineContent } from '@/components/article-inline-content'

const typeConfig: Record<string, { accent: string; label: string }> = {
  info: { accent: 'var(--plantation)', label: 'Info' },
  warning: { accent: 'var(--plantation)', label: 'Warning' },
  tip: { accent: 'var(--plantation)', label: 'Tip' },
  caution: { accent: 'var(--plantation)', label: 'Caution' },
}

export function CalloutRenderer({
  type = 'info',
  title,
  text,
}: {
  type: string
  title?: string
  text: string
}) {
  const trimmedTitle = title?.trim() ?? ''
  const trimmedText = text?.trim() ?? ''
  if (!trimmedText) return null

  const config = typeConfig[type] ?? typeConfig.info
  const heading = trimmedTitle || config.label

  return (
    <div
      className="my-6 border-l-2 bg-muted/50 px-5 py-4"
      style={{ borderColor: config.accent }}
    >
      <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
        {heading}
      </span>
      <div className="mt-1 space-y-2 text-sm leading-relaxed">
        {trimmedText.split('\n\n').map((paragraph, index) => (
          <p key={index}>
            <ArticleInlineContent value={paragraph} />
          </p>
        ))}
      </div>
    </div>
  )
}
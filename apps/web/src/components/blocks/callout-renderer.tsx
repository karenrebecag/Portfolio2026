const typeStyles: Record<string, { border: string; bg: string; label: string }> = {
  info: { border: 'border-blue-400 dark:border-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', label: 'Info' },
  warning: { border: 'border-amber-400 dark:border-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', label: 'Warning' },
  tip: { border: 'border-green-400 dark:border-green-600', bg: 'bg-green-50 dark:bg-green-950/30', label: 'Tip' },
  caution: { border: 'border-red-400 dark:border-red-600', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Caution' },
}

export function CalloutRenderer({
  type = 'info',
  text,
}: {
  type: string
  text: string
}) {
  const style = typeStyles[type] ?? typeStyles.info

  return (
    <div className={`my-4 rounded-lg border-l-4 ${style.border} ${style.bg} p-4`}>
      <p className="font-semibold text-sm mb-1">{style.label}</p>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  )
}

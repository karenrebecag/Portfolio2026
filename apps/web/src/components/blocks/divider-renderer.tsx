const styleClasses: Record<string, string> = {
  line: 'border-t border-zinc-300 dark:border-zinc-700',
  space: 'h-8',
  dots: 'border-t border-dotted border-zinc-300 dark:border-zinc-700',
}

export function DividerRenderer({ style = 'line' }: { style?: string }) {
  return <div className={`my-6 ${styleClasses[style] ?? styleClasses.line}`} />
}

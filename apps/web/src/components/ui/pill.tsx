import type { ReactNode } from 'react'

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-2 py-1 text-2xs font-bold uppercase tracking-widest leading-none bg-primary text-primary-foreground font-accent">
      {children}
    </span>
  )
}

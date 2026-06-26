import type { ReactNode } from 'react'

/**
 * Esta ruta vive solo en la paleta Night. `data-palette="night"` scopea los
 * tokens dark a este subtree (ver globals.css), sin tocar el theme global ni
 * requerir JS — el toggle global se respeta fuera de aquí.
 */
export default function ProposalsLayout({ children }: { children: ReactNode }) {
  return (
    <div data-palette="night" className="bg-background text-foreground">
      {children}
    </div>
  )
}

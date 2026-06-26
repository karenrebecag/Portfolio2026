'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { usePathname } from '@/i18n/navigation'

/**
 * Bloqueo de theme por ruta. Algunas rutas (propuestas) viven solo en dark:
 * forzamos `.dark` en `<html>` — el theme GLOBAL, así cascada a todo (navbar,
 * footer, página), no a un subtree. El contexto expone `locked` para que el
 * navbar oculte el selector de tema. Al salir de la ruta se restaura la
 * preferencia guardada del usuario (no la tocamos mientras está bloqueada).
 *
 * El anti-flash en `<head>` (layout) aplica el mismo criterio por pathname para
 * evitar parpadeo en carga directa.
 */

const ThemeLockContext = createContext(false)

export const useThemeLock = () => useContext(ThemeLockContext)

/** Rutas que viven solo en dark. Mantener en sync con el script anti-flash. */
function isThemeLockedPath(pathname: string): boolean {
  return pathname === '/proposals' || pathname.startsWith('/proposals/')
}

export function ThemeLockProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const locked = isThemeLockedPath(pathname)

  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    html.classList.remove('mono')
    html.classList.add('dark')

    return () => {
      // Restaurar la preferencia global al dejar la ruta bloqueada.
      const stored = localStorage.getItem('theme')
      html.classList.remove('dark', 'mono')
      if (stored === 'dark') html.classList.add('dark')
      else if (stored === 'mono') html.classList.add('mono')
      else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark')
      }
    }
  }, [locked])

  return <ThemeLockContext.Provider value={locked}>{children}</ThemeLockContext.Provider>
}

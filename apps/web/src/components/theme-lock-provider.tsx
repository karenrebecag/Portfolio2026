'use client'

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { usePathname } from '@/i18n/navigation'

/**
 * Bloqueo de theme por ruta. Algunas rutas (propuestas, páginas de error) viven
 * solo en dark: forzamos `.dark` en `<html>` — el theme GLOBAL, así cascada a
 * todo (navbar, footer, página), no a un subtree. El contexto expone `locked`
 * para que el navbar oculte el selector de tema. Al salir se restaura la
 * preferencia guardada del usuario.
 *
 * Quien aplica/revierte la clase es SIEMPRE el provider (montado en el layout,
 * estable). Las propuestas se detectan por pathname; las páginas de error, que
 * no tienen pathname fijo, piden el lock vía `ForceDarkTheme` (store externo),
 * evitando las carreras de montaje de un efecto dentro del error boundary.
 *
 * El anti-flash en `<head>` (layout) aplica el mismo criterio por pathname para
 * evitar parpadeo en carga directa de las propuestas.
 */

const ThemeLockContext = createContext(false)

export const useThemeLock = () => useContext(ThemeLockContext)

/** Rutas que viven solo en dark. Mantener en sync con el script anti-flash. */
function isThemeLockedPath(pathname: string): boolean {
  return pathname === '/proposals' || pathname.startsWith('/proposals/')
}

/* Store externo: páginas sin pathname fijo (404, error) piden el lock dark. */
let forceDarkCount = 0
const forceDarkListeners = new Set<() => void>()
const isForceDark = () => forceDarkCount > 0
function subscribeForceDark(cb: () => void) {
  forceDarkListeners.add(cb)
  return () => forceDarkListeners.delete(cb)
}
function setForceDark(delta: number) {
  forceDarkCount += delta
  forceDarkListeners.forEach((l) => l())
}

/**
 * Pide el lock dark mientras el componente esté montado. Para páginas de error
 * (404, error) que no tienen pathname que `isThemeLockedPath` pueda detectar.
 * No toca la clase: el provider reacciona al store y la aplica de forma estable.
 */
export function ForceDarkTheme() {
  useEffect(() => {
    setForceDark(1)
    return () => setForceDark(-1)
  }, [])

  return null
}

/** Restaura la preferencia global de theme guardada por el usuario. */
function restoreStoredTheme() {
  const html = document.documentElement
  const stored = localStorage.getItem('theme')
  html.classList.remove('dark', 'mono')
  if (stored === 'dark') html.classList.add('dark')
  else if (stored === 'mono') html.classList.add('mono')
  else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark')
  }
}

export function ThemeLockProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const forced = useSyncExternalStore(subscribeForceDark, isForceDark, () => false)
  const locked = isThemeLockedPath(pathname) || forced

  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    html.classList.remove('mono')
    html.classList.add('dark')

    return () => restoreStoredTheme()
  }, [locked])

  return <ThemeLockContext.Provider value={locked}>{children}</ThemeLockContext.Provider>
}

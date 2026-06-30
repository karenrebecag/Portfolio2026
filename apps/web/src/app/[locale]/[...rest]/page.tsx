import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

/**
 * Catch-all para URLs desconocidas bajo un locale. next-intl solo renderiza
 * `[locale]/not-found.tsx` cuando se llama `notFound()` desde una ruta; las
 * rutas que no matchean nada caen al `/_not-found` raíz (404 default de Next).
 * Este catch-all las captura y dispara la página 404 con marca.
 */
export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  notFound()
}

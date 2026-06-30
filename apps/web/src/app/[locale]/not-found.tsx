import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/navbar'
import { GridGuides } from '@/components/ui/grid-guides'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import { Button061 } from '@/components/ui/button-061'
import { ForceDarkTheme } from '@/components/theme-lock-provider'
import { TRAIL_SHAPES } from '@/lib/trail-shapes'

/** Rendered for notFound() inside localized routes (e.g. an unknown article).
 *  Dark-locked like proposals, with the navbar so users can recover. Single
 *  full-screen hero (no marketing footer, which needs a scrolling page). */
export default async function NotFound() {
  const t = await getTranslations('errors')

  return (
    <>
      <ForceDarkTheme />
      <Navbar />

      <main
        data-main
        data-theme-section="dark"
        className="relative z-[2] flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-surface px-4 pt-20 text-center text-surface-foreground lg:px-6"
      >
        <GridGuides className="z-0" />
        <CursorImageTrail images={TRAIL_SHAPES} autoIntervalMs={550} className="absolute inset-0 z-0" />

        <div className="relative z-[1] flex flex-col items-center py-16">
          <p className="font-accent text-xs uppercase tracking-[0.25em] text-surface-foreground/50">
            {t('notFound.eyebrow')}
          </p>
          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight">
            {t('notFound.title')}
          </h1>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-surface-foreground/70 md:text-lg">
            {t('notFound.body')}
          </p>
          <div className="mt-10">
            <Button061 href="/">{t('notFound.cta')}</Button061>
          </div>
        </div>
      </main>
    </>
  )
}

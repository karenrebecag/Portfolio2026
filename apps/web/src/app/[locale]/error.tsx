'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/layout/navbar'
import { GridGuides } from '@/components/ui/grid-guides'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import { Button061 } from '@/components/ui/button-061'
import { Pill } from '@/components/ui/pill'
import { ForceDarkTheme } from '@/components/theme-lock-provider'
import { TRAIL_SHAPES } from '@/lib/trail-shapes'

/** Catches runtime errors in localized pages. The wipe/providers stay mounted
 *  (this replaces the page, not the layout). Dark-locked with the navbar,
 *  single full-screen hero like the not-found page. */
export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')

  useEffect(() => {
    console.error(error)
  }, [error])

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

        <div
          data-reveal-group
          data-stagger="120"
          data-start="top 90%"
          data-distance="2em"
          className="relative z-[1] flex flex-col items-center py-16"
        >
          <Pill>{t('error.eyebrow')}</Pill>
          <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight">
            {t('error.title')}
          </h1>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-surface-foreground/70 md:text-lg">
            {t('error.body')}
          </p>
          <div className="mt-10">
            <Button061 href="/">{t('error.cta')}</Button061>
          </div>
        </div>
      </main>
    </>
  )
}

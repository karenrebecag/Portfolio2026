'use client'

import { useCallback } from 'react'
import { whenFontsReady } from '@/lib/fonts-ready'
import { destroyAllRotatingText, initRotatingText } from '@/lib/rotating-text-controller'
import { usePageInit } from '@/lib/use-page-init'

export function RotatingTextProvider({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => {
    let cancelled = false

    whenFontsReady().then(() => {
      if (cancelled) return
      initRotatingText()
      requestAnimationFrame(() => {
        if (!cancelled) initRotatingText()
      })
    })

    return () => {
      cancelled = true
      destroyAllRotatingText()
    }
  }, []))

  return <>{children}</>
}
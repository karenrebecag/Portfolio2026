'use client'

import { useCallback } from 'react'
import { whenFontsReady } from '@/lib/fonts-ready'
import { destroyAllHeadingSplits, initHeadingSplits } from '@/lib/split-text-controller'
import { usePageInit } from '@/lib/use-page-init'

export function TextRevealProvider({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => {
    let cancelled = false

    whenFontsReady().then(() => {
      if (!cancelled) initHeadingSplits()
    })

    return () => {
      cancelled = true
      destroyAllHeadingSplits()
    }
  }, []))

  return <>{children}</>
}
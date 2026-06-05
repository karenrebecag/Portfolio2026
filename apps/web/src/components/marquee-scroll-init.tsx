'use client'

import { useCallback } from 'react'
import { usePageInit } from '@/lib/use-page-init'
import { initMarqueeScrollDirection, destroyAllMarqueeScrollDirections } from '@/lib/marquee-scroll-direction'

/** Initializes all `[data-marquee-scroll-direction-target]` marquees after page ready. */
export function MarqueeScrollInit() {
  usePageInit(
    useCallback(() => {
      initMarqueeScrollDirection()
      return () => destroyAllMarqueeScrollDirections()
    }, []),
  )

  return null
}
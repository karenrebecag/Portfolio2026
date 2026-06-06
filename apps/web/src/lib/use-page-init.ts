'use client'

import { useLayoutEffect } from 'react'
import { PAGE_MOUNT_EVENT, PAGE_READY_EVENT } from '@/lib/page-mount'

/**
 * Mount flow for GSAP / ScrollTrigger controllers.
 *
 * - First load: waits for `page-ready` (overlay), then inits synchronously.
 * - Route change: inits synchronously on `page-navigation-complete` inside
 *   useLayoutEffect — before the browser paints the new page.
 *
 * Pair with PageTransition, which dispatches mount before the enter tween
 * sets content visible. CSS pre-hide (globals.css) only covers SSR/hydration
 * before `data-page-ready` is set.
 */
export function usePageInit(init: () => (() => void) | void) {
  useLayoutEffect(() => {
    let cleanup: (() => void) | void
    let cancelled = false

    function mount() {
      if (cancelled) return
      if (typeof cleanup === 'function') cleanup()
      cleanup = init()
    }

    if (document.body.hasAttribute('data-page-ready')) {
      mount()
    } else {
      document.addEventListener(PAGE_READY_EVENT, mount, { once: true })
    }

    document.addEventListener(PAGE_MOUNT_EVENT, mount)

    return () => {
      cancelled = true
      if (typeof cleanup === 'function') cleanup()
      document.removeEventListener(PAGE_READY_EVENT, mount)
      document.removeEventListener(PAGE_MOUNT_EVENT, mount)
    }
  }, [init])
}
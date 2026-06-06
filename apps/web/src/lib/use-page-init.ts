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
 * Pair with PageTransition: `beginPageMount` hides targets via CSS on every route
 * change (`data-page-mounting`); `dispatchPageMount` runs controllers; then
 * `completePageMount` clears the flag. First load uses `data-page-ready` the same way.
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
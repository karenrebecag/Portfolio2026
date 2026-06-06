'use client'

import { useLayoutEffect } from 'react'
import { PAGE_MOUNT_EVENT, PAGE_READY_EVENT } from '@/lib/page-mount'
import { useNavigationOrchestrator } from '@/lib/navigation/navigation-context'

/**
 * Mount flow for GSAP / ScrollTrigger controllers, coordinated with the
 * navigation orchestrator.
 *
 * - First load: waits for `page-ready` (boot reveal), then inits.
 * - Route change: inits on `page-navigation-complete`, dispatched by the runtime
 *   once the wipe has revealed the new page.
 *
 * A controller that mounts mid-navigation (e.g. an article's TOC) does NOT init
 * immediately even though `data-page-ready` is set — it waits for the transition
 * to finish. Initializing early would run twice (once behind the wipe, once on
 * `page-navigation-complete`), re-triggering entrance animations after the page
 * is already revealed. The orchestrator phase tells us whether we're idle.
 */
export function usePageInit(init: () => (() => void) | void) {
  const orchestrator = useNavigationOrchestrator()

  useLayoutEffect(() => {
    let cleanup: (() => void) | void
    let cancelled = false

    function mount() {
      if (cancelled) return
      if (typeof cleanup === 'function') cleanup()
      cleanup = init()
    }

    const ready = document.body.hasAttribute('data-page-ready')
    const settled = (orchestrator?.getSnapshot().phase ?? 'stable') === 'stable'

    if (ready && settled) {
      // Page is idle and this controller just mounted — init now.
      mount()
    } else if (!ready) {
      // First load — wait for the boot reveal.
      document.addEventListener(PAGE_READY_EVENT, mount, { once: true })
    }
    // ready && !settled => mounted mid-navigation; PAGE_MOUNT_EVENT fires when
    // the transition completes.

    document.addEventListener(PAGE_MOUNT_EVENT, mount)

    return () => {
      cancelled = true
      if (typeof cleanup === 'function') cleanup()
      document.removeEventListener(PAGE_READY_EVENT, mount)
      document.removeEventListener(PAGE_MOUNT_EVENT, mount)
    }
  }, [init, orchestrator])
}

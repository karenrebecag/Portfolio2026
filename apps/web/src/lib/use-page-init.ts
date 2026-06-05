'use client'

import { useEffect } from 'react'

function scheduleInit(run: () => void) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 120 })
  } else {
    requestAnimationFrame(() => requestAnimationFrame(run))
  }
}

/** Wait for React commit + paint before querying the DOM (route transitions). */
function scheduleInitAfterPaint(run: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scheduleInit(run)
    })
  })
}

export function usePageInit(init: () => (() => void) | void) {
  useEffect(() => {
    let cleanup: (() => void) | void
    let cancelled = false

    function start() {
      if (cancelled) return
      cleanup = init()
    }

    function startDeferred() {
      scheduleInit(start)
    }

    if (document.body.hasAttribute('data-page-ready')) {
      startDeferred()
    } else {
      document.addEventListener('page-ready', startDeferred, { once: true })
    }

    function onNavigate() {
      if (typeof cleanup === 'function') cleanup()
      cleanup = undefined
      scheduleInitAfterPaint(start)
    }

    document.addEventListener('page-navigation-complete', onNavigate)

    return () => {
      cancelled = true
      if (typeof cleanup === 'function') cleanup()
      document.removeEventListener('page-ready', startDeferred)
      document.removeEventListener('page-navigation-complete', onNavigate)
    }
  }, [init])
}
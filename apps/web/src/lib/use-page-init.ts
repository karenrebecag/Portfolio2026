'use client'

import { useEffect } from 'react'

export function usePageInit(init: () => (() => void) | void) {
  useEffect(() => {
    let cleanup: (() => void) | void

    function start() {
      cleanup = init()
    }

    if (document.body.hasAttribute('data-page-ready')) {
      start()
    } else {
      document.addEventListener('page-ready', start, { once: true })
    }

    function onNavigate() {
      if (typeof cleanup === 'function') cleanup()
      cleanup = init()
    }

    document.addEventListener('page-navigation-complete', onNavigate)

    return () => {
      if (typeof cleanup === 'function') cleanup()
      document.removeEventListener('page-ready', start)
      document.removeEventListener('page-navigation-complete', onNavigate)
    }
  }, [init])
}

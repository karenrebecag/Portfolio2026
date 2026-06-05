'use client'

import { useCallback } from 'react'
import { usePageInit } from '@/lib/use-page-init'
import { syncThemeColorMeta } from '@/lib/update-theme-color-meta'

function initThemeColorSync() {
  syncThemeColorMeta()

  const htmlObserver = new MutationObserver(() => syncThemeColorMeta())
  htmlObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  const bodyObserver = new MutationObserver(() => syncThemeColorMeta())
  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-section-theme'],
  })

  return () => {
    htmlObserver.disconnect()
    bodyObserver.disconnect()
  }
}

export function ThemeColorSync() {
  usePageInit(useCallback(() => initThemeColorSync(), []))
  return null
}
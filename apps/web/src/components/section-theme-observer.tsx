'use client'

import { useCallback } from 'react'
import { usePageInit } from '@/lib/use-page-init'

function initCheckSectionThemeScroll() {
  let ticking = false
  let currentTheme: string | null = null

  const navBarHeight = document.querySelector<HTMLElement>('[data-nav-bar-height]')
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 24

  const themeSections = document.querySelectorAll<HTMLElement>('[data-theme-section]')

  function updateTheme(theme: string) {
    document.body.setAttribute('data-section-theme', theme)
  }

  function checkThemeSection() {
    for (const section of themeSections) {
      const rect = section.getBoundingClientRect()

      if (rect.top <= themeObserverOffset && rect.bottom >= themeObserverOffset) {
        const active = section.getAttribute('data-theme-section')
        if (active && active !== currentTheme) {
          updateTheme(active)
          currentTheme = active
        }
        break
      }
    }
    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(checkThemeSection)
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  checkThemeSection()

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}

export function SectionThemeObserver({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => initCheckSectionThemeScroll(), []))

  return <>{children}</>
}

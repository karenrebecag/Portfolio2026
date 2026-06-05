'use client'

import { useCallback } from 'react'
import { usePageInit } from '@/lib/use-page-init'

type LenisInstance = {
  on: (event: 'scroll', callback: () => void) => void
  off?: (event: 'scroll', callback: () => void) => void
}

function getLenis(): LenisInstance | undefined {
  const lenis = (window as unknown as { lenis?: LenisInstance }).lenis
  if (lenis && typeof lenis.on === 'function') return lenis
  return undefined
}

/**
 * OSMO "Check Section Theme on Scroll" — probe line at half the nav bar height.
 * @see https://www.osmo.supply/ (Check Section Theme on Scroll)
 */
function initCheckSectionThemeScroll() {
  let ticking = false
  let currentTheme: string | null = null
  let currentBg: string | null = null
  let lenisBound = false
  let lenisRetryId: number | null = null

  function getThemeObserverOffset() {
    const navBarHeight = document.querySelector<HTMLElement>('[data-nav-bar-height]')
    return navBarHeight ? navBarHeight.offsetHeight / 2 : 0
  }

  function updateThemeAttributes(theme: string) {
    document.body.setAttribute('data-section-theme', theme)
    document.body.setAttribute('data-theme-nav', theme)
    document.querySelectorAll('[data-theme-nav]').forEach((el) => {
      el.setAttribute('data-theme-nav', theme)
    })
  }

  function findActiveSection(sections: NodeListOf<HTMLElement>, offset: number): HTMLElement | null {
    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= offset && rect.bottom >= offset) {
        return section
      }
    }

    // Past the last section or in a gap: use the last section whose top passed the probe
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]!
      if (section.getBoundingClientRect().top <= offset) {
        return section
      }
    }

    return sections[0] ?? null
  }

  function checkThemeSection() {
    const offset = getThemeObserverOffset()
    const themeSections = document.querySelectorAll<HTMLElement>('[data-theme-section]')
    const active = findActiveSection(themeSections, offset)

    if (!active) {
      ticking = false
      return
    }

    const themeSectionActive = active.getAttribute('data-theme-section')
    const bgSectionActive = active.getAttribute('data-bg-section')

    if (themeSectionActive && themeSectionActive !== currentTheme) {
      updateThemeAttributes(themeSectionActive)
      currentTheme = themeSectionActive
    }

    if (bgSectionActive && bgSectionActive !== currentBg) {
      document.body.setAttribute('data-bg-nav', bgSectionActive)
      currentBg = bgSectionActive
    }

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(checkThemeSection)
    }
  }

  function bindLenis() {
    const lenis = getLenis()
    if (!lenis || lenisBound) return
    lenis.on('scroll', onScroll)
    lenisBound = true
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  bindLenis()
  if (!lenisBound) {
    lenisRetryId = window.setInterval(() => {
      bindLenis()
      if (lenisBound && lenisRetryId) {
        window.clearInterval(lenisRetryId)
        lenisRetryId = null
      }
    }, 50)
    window.setTimeout(() => {
      if (lenisRetryId) {
        window.clearInterval(lenisRetryId)
        lenisRetryId = null
      }
    }, 2000)
  }

  checkThemeSection()

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (lenisRetryId) window.clearInterval(lenisRetryId)
    const lenis = getLenis()
    if (lenis?.off && lenisBound) lenis.off('scroll', onScroll)
    lenisBound = false
  }
}

export function SectionThemeObserver({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => initCheckSectionThemeScroll(), []))

  return <>{children}</>
}
'use client'

import { useCallback } from 'react'
import { subscribeLenisScroll } from '@/lib/lenis-scroll'
import { usePageInit } from '@/lib/use-page-init'
import { syncThemeColorMeta } from '@/lib/update-theme-color-meta'

/**
 * OSMO "Check Section Theme on Scroll" — probe at half the nav bar height.
 * @see https://www.osmo.supply/ (Check Section Theme on Scroll)
 */
function initCheckSectionThemeScroll() {
  let ticking = false
  let currentTheme: string | null = null
  let currentBg: string | null = null

  function getThemeObserverOffset() {
    const navBarHeight = document.querySelector<HTMLElement>('[data-nav-bar-height]')
    return navBarHeight ? navBarHeight.offsetHeight / 2 : 48
  }

  function updateThemeAttributes(theme: string) {
    document.body.setAttribute('data-section-theme', theme)
    document.body.setAttribute('data-theme-nav', theme)
    document.querySelectorAll('[data-theme-nav]').forEach((el) => {
      el.setAttribute('data-theme-nav', theme)
    })
  }

  function findActiveSection(sections: HTMLElement[], offset: number): HTMLElement | null {
    const probeY = Math.max(0, offset)
    const hit = document.elementFromPoint(window.innerWidth * 0.5, probeY)
    const fromPoint = hit?.closest<HTMLElement>('[data-theme-section]')
    if (fromPoint) return fromPoint

    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= probeY && rect.bottom >= probeY) return section
    }

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]!
      if (section.getBoundingClientRect().top <= probeY) return section
    }

    return sections[0] ?? null
  }

  function checkThemeSection(force = false) {
    const offset = getThemeObserverOffset()
    const themeSections = document.querySelectorAll<HTMLElement>('[data-theme-section]')
    const active = findActiveSection(Array.from(themeSections), offset)

    if (!active) {
      ticking = false
      return
    }

    const themeSectionActive = active.getAttribute('data-theme-section')
    const bgSectionActive = active.getAttribute('data-bg-section') ?? themeSectionActive

    if (themeSectionActive && (force || themeSectionActive !== currentTheme)) {
      updateThemeAttributes(themeSectionActive)
      currentTheme = themeSectionActive
    }

    if (bgSectionActive && (force || bgSectionActive !== currentBg)) {
      document.body.setAttribute('data-bg-nav', bgSectionActive)
      currentBg = bgSectionActive
    }

    if (themeSectionActive) {
      syncThemeColorMeta()
    }

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => checkThemeSection(false))
    }
  }

  function scheduleThemeChecks() {
    currentTheme = null
    currentBg = null
    requestAnimationFrame(() => {
      checkThemeSection(true)
      requestAnimationFrame(() => checkThemeSection(true))
    })
    window.setTimeout(() => checkThemeSection(true), 120)
    window.setTimeout(() => checkThemeSection(true), 400)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  const unsubscribeLenis = subscribeLenisScroll(() => onScroll())

  const onNavigate = () => scheduleThemeChecks()
  document.addEventListener('page-navigation-complete', onNavigate)

  scheduleThemeChecks()

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    document.removeEventListener('page-navigation-complete', onNavigate)
    unsubscribeLenis()
  }
}

export function SectionThemeObserver({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => initCheckSectionThemeScroll(), []))

  return <>{children}</>
}
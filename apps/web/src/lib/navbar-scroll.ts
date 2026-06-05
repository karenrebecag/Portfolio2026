import type Lenis from 'lenis'
import { getLenis, getScrollY, isScrollingUp } from '@/lib/lenis-scroll'

export type NavbarScrollState = {
  headerVisible: boolean
  lastScrollY: number
}

export function updateNavbarHeaderVisibility(
  header: HTMLElement,
  state: NavbarScrollState,
  menuOpen: boolean,
  lenis?: Lenis,
): NavbarScrollState {
  const scrollY = getScrollY(lenis)
  const atTop = scrollY <= 10
  const scrollingUp = isScrollingUp(lenis, scrollY, state.lastScrollY)

  header.classList.toggle('is--scrolled', !atTop)

  let shouldShow = state.headerVisible
  if (atTop) shouldShow = true
  else if (lenis?.direction === 1) shouldShow = false
  else if (lenis?.direction === -1) shouldShow = true
  else if (scrollingUp) shouldShow = true
  else if (!scrollingUp && scrollY > state.lastScrollY + 2) shouldShow = false

  shouldShow = shouldShow && !menuOpen

  if (shouldShow !== state.headerVisible) {
    state.headerVisible = shouldShow
    header.classList.toggle('is--hidden', !shouldShow)
  }

  return { headerVisible: state.headerVisible, lastScrollY: scrollY }
}

export function getNavbarHeader(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.underlay-nav__header')
}

export function resetNavbarScrollState(): NavbarScrollState {
  const header = getNavbarHeader()
  const lenis = getLenis()
  const state: NavbarScrollState = { headerVisible: true, lastScrollY: 0 }
  if (header) {
    header.classList.remove('is--hidden', 'is--scrolled')
    return updateNavbarHeaderVisibility(header, state, false, lenis)
  }
  return state
}
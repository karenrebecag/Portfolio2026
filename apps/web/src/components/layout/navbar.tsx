'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleToggle } from '@/components/locale-toggle'
import type Lenis from 'lenis'
import { subscribeLenisScroll } from '@/lib/lenis-scroll'
import {
  getNavbarHeader,
  resetNavbarScrollState,
  updateNavbarHeaderVisibility,
  type NavbarScrollState,
} from '@/lib/navbar-scroll'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/karenrebecag', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.247C9.62482 2.24599 7.32683 3.09045 5.51745 4.62917C3.70808 6.16789 2.50547 8.30041 2.12495 10.6449C1.74442 12.9894 2.21083 15.3928 3.44066 17.4248C4.67049 19.4568 6.58343 20.9847 8.83701 21.735C9.33701 21.829 9.52101 21.52 9.52101 21.254C9.52101 21.017 9.51201 20.387 9.50801 19.554C6.72701 20.154 6.14001 18.212 6.14001 18.212C5.9554 17.6074 5.56062 17.0889 5.02701 16.75C4.12201 16.13 5.09801 16.142 5.09801 16.142C5.41478 16.1858 5.71737 16.3013 5.9827 16.4798C6.24803 16.6583 6.46908 16.8951 6.62901 17.172C6.7649 17.4186 6.94832 17.6359 7.16868 17.8112C7.38904 17.9866 7.64197 18.1165 7.91284 18.1935C8.18371 18.2705 8.46715 18.293 8.74679 18.2598C9.02642 18.2266 9.2967 18.1383 9.54201 18C9.58642 17.493 9.81098 17.0187 10.175 16.663C7.95401 16.413 5.62001 15.553 5.62001 11.721C5.60586 10.7289 5.97437 9.76951 6.64901 9.042C6.33796 8.18271 6.36947 7.23668 6.73701 6.4C6.73701 6.4 7.57401 6.132 9.48701 7.425C11.1232 6.97435 12.8508 6.97435 14.487 7.425C16.387 6.132 17.224 6.4 17.224 6.4C17.5874 7.23872 17.6231 8.18324 17.324 9.047C17.9972 9.77674 18.3641 10.7373 18.349 11.73C18.349 15.572 16.012 16.417 13.787 16.663C14.024 16.9061 14.2066 17.1967 14.323 17.5156C14.4394 17.8345 14.4867 18.1744 14.462 18.513C14.462 19.852 14.449 20.927 14.449 21.252C14.449 21.514 14.624 21.827 15.137 21.727C17.3976 20.9868 19.3197 19.464 20.5576 17.4329C21.7955 15.4017 22.2679 12.9954 21.8897 10.647C21.5115 8.29856 20.3076 6.16221 18.4947 4.62233C16.6817 3.08245 14.3787 2.24015 12 2.247Z"/></svg> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.9 20.9H17.166V15.053C17.166 13.659 17.138 11.865 15.222 11.865C13.277 11.865 12.98 13.382 12.98 14.95V20.9H9.249V8.87699H12.833V10.516H12.881C13.2402 9.90278 13.7588 9.39838 14.3818 9.05643C15.0048 8.71447 15.7088 8.54775 16.419 8.57399C20.199 8.57399 20.898 11.062 20.898 14.3V20.9H20.9ZM5.036 7.23199C4.60732 7.23259 4.1881 7.10603 3.83137 6.86832C3.47463 6.63061 3.19641 6.29244 3.03191 5.89658C2.8674 5.50072 2.824 5.06497 2.9072 4.64444C2.99039 4.22392 3.19644 3.83751 3.49928 3.53411C3.80212 3.23071 4.18815 3.02395 4.60852 2.93998C5.02889 2.85601 5.46473 2.8986 5.86089 3.06237C6.25705 3.22615 6.59573 3.50374 6.8341 3.86003C7.07246 4.21633 7.1998 4.63532 7.2 5.06399C7.20039 5.34847 7.14472 5.63024 7.03615 5.89319C6.92759 6.15615 6.76827 6.39512 6.5673 6.59647C6.36633 6.79781 6.12764 6.95757 5.86489 7.06662C5.60214 7.17567 5.32048 7.23186 5.036 7.23199ZM6.906 20.9H3.165V8.87699H6.906V20.9Z"/></svg> },
  { label: 'Instagram', href: 'https://www.instagram.com/karenrebeca.og/', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 7.88C21.9206 7.0503 21.7652 6.2294 21.48 5.45C21.2283 4.78181 20.8322 4.17742 20.32 3.68C19.8226 3.16776 19.2182 2.77166 18.55 2.52C17.7706 2.23484 16.9497 2.07945 16.12 2.06C15.06 2 14.72 2 12 2C9.28 2 8.94 2 7.88 2.06C7.0503 2.07945 6.2294 2.23484 5.45 2.52C4.78181 2.77166 4.17742 3.16776 3.68 3.68C3.16743 4.17518 2.77418 4.78044 2.53 5.45C2.23616 6.22734 2.07721 7.04915 2.06 7.88C2 8.94 2 9.28 2 12C2 14.72 2 15.06 2.06 16.12C2.07721 16.9508 2.23616 17.7727 2.53 18.55C2.77418 19.2196 3.16743 19.8248 3.68 20.32C4.17742 20.8322 4.78181 21.2283 5.45 21.48C6.2294 21.7652 7.0503 21.9206 7.88 21.94C8.94 22 9.28 22 12 22C14.72 22 15.06 22 16.12 21.94C16.9497 21.9206 17.7706 21.7652 18.55 21.48C19.2134 21.219 19.816 20.8242 20.3201 20.3201C20.8242 19.816 21.219 19.2134 21.48 18.55C21.7652 17.7706 21.9206 16.9497 21.94 16.12C21.94 15.06 22 14.72 22 12C22 9.28 22 8.94 21.94 7.88ZM20.14 16C20.1327 16.6348 20.0178 17.2637 19.8 17.86C19.6327 18.2913 19.3773 18.683 19.0501 19.0101C18.723 19.3373 18.3313 19.5927 17.9 19.76C17.3037 19.9778 16.6748 20.0927 16.04 20.1C15.04 20.15 14.67 20.16 12.04 20.16C9.41 20.16 9.04 20.16 8.04 20.1C7.38073 20.1148 6.72401 20.0132 6.1 19.8C5.66869 19.6327 5.27698 19.3773 4.94985 19.0501C4.62272 18.723 4.36734 18.3313 4.2 17.9C3.97775 17.2911 3.86271 16.6482 3.86 16C3.86 15 3.8 14.63 3.8 12C3.8 9.37 3.8 9 3.86 8C3.86271 7.35178 3.97775 6.70893 4.2 6.1C4.36734 5.66869 4.62272 5.27698 4.94985 4.94985C5.27698 4.62272 5.66869 4.36734 6.1 4.2C6.70893 3.97775 7.35178 3.86271 8 3.86C9 3.86 9.37 3.8 12 3.8C14.63 3.8 15 3.8 16 3.86C16.6348 3.86728 17.2637 3.98225 17.86 4.2C18.2913 4.36734 18.683 4.62272 19.0101 4.94985C19.3373 5.27698 19.5927 5.66869 19.76 6.1C19.9959 6.7065 20.1245 7.34942 20.14 8C20.19 9 20.2 9.37 20.2 12C20.2 14.63 20.19 15 20.14 16Z"/><path d="M12 6.86C10.9834 6.86 9.98964 7.16146 9.14437 7.72625C8.2991 8.29104 7.64029 9.0938 7.25126 10.033C6.86222 10.9722 6.76044 12.0057 6.95876 13.0028C7.15709 13.9998 7.64663 14.9157 8.36547 15.6345C9.08431 16.3534 10.0002 16.8429 10.9972 17.0412C11.9943 17.2396 13.0278 17.1378 13.967 16.7487C14.9062 16.3597 15.709 15.7009 16.2738 14.8556C16.8385 14.0104 17.14 13.0166 17.14 12C17.14 10.6368 16.5985 9.32941 15.6345 8.36547C14.6706 7.40153 13.3632 6.86 12 6.86ZM12 15.33C11.3414 15.33 10.6976 15.1347 10.15 14.7688C9.60234 14.4029 9.17552 13.8828 8.92348 13.2743C8.67144 12.6659 8.6055 11.9963 8.73399 11.3503C8.86247 10.7044 9.17963 10.111 9.64533 9.64533C10.111 9.17963 10.7044 8.86247 11.3503 8.73399C11.9963 8.6055 12.6659 8.67144 13.2743 8.92348C13.8828 9.17552 14.4029 9.60234 14.7688 10.15C15.1347 10.6976 15.33 11.3414 15.33 12C15.33 12.4373 15.2439 12.8703 15.0765 13.2743C14.9092 13.6784 14.6639 14.0454 14.3547 14.3547C14.0454 14.6639 13.6784 14.9092 13.2743 15.0765C12.8703 15.2439 12.4373 15.33 12 15.33Z"/><path d="M17.34 5.46001C17.1027 5.46001 16.8707 5.53039 16.6733 5.66224C16.476 5.7941 16.3222 5.98152 16.2313 6.20079C16.1405 6.42006 16.1168 6.66134 16.1631 6.89411C16.2094 7.12689 16.3236 7.34071 16.4915 7.50853C16.6593 7.67636 16.8731 7.79065 17.1059 7.83695C17.3387 7.88325 17.5799 7.85949 17.7992 7.76866C18.0185 7.67784 18.2059 7.52403 18.3378 7.32669C18.4696 7.12935 18.54 6.89734 18.54 6.66001C18.54 6.34175 18.4136 6.03652 18.1885 5.81148C17.9635 5.58643 17.6583 5.46001 17.34 5.46001Z"/></svg> },
  { label: 'Email', href: 'mailto:hello@karenortiz.dev', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg> },
]

export function Navbar() {
  const t = useTranslations('nav')
  const common = useTranslations('common')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const isOpenRef = useRef(false)
  const enterEndTimeRef = useRef(0)
  const scrollStateRef = useRef<NavbarScrollState>({ headerVisible: true, lastScrollY: 0 })

  const NAV_LINKS = [
    { href: '/', label: t('home'), active: true },
    { href: '/#projects', label: t('projects') },
    { href: '/about', label: t('about') },
    { href: '#contact', label: t('contact') },
  ]

  const toggle = useCallback(() => {
    const tl = tlRef.current
    const btn = toggleRef.current
    if (!tl || !btn) return

    isOpenRef.current = !isOpenRef.current
    const isOpen = isOpenRef.current

    btn.setAttribute('aria-expanded', String(isOpen))
    btn.setAttribute('aria-label', isOpen ? t('close') : t('menu'))
    document.body.setAttribute('data-menu-status', isOpen ? 'open' : '')

    const header = getNavbarHeader()
    if (header) {
      if (isOpen) {
        header.classList.add('is--hidden')
        scrollStateRef.current.headerVisible = false
      } else {
        scrollStateRef.current = updateNavbarHeaderVisibility(
          header,
          scrollStateRef.current,
          false,
        )
      }
    }

    if (isOpen) {
      tl.invalidate()
      if (tl.time() >= enterEndTimeRef.current) tl.timeScale(1).restart()
      else tl.timeScale(1).play()
    } else {
      if (tl.time() < enterEndTimeRef.current) tl.timeScale(1).reverse()
      else tl.timeScale(1).play()
    }
  }, [t])

  useEffect(() => {
    const btn = toggleRef.current
    const menuEl = document.querySelector<HTMLElement>('[data-underlay-nav-menu]')
    const mainEl = document.querySelector<HTMLElement>('[data-main]')
    const overlayEl = document.querySelector<HTMLElement>('[data-underlay-nav-overlay]')
    const darkEl = document.querySelector<HTMLElement>('.underlay-nav__dark')
    const largeItems = document.querySelectorAll('[data-reveal-l]')
    const smallItems = document.querySelectorAll('[data-reveal-s]')
    const menuBorder = document.querySelector<HTMLElement>('.underlay-nav__bottom-border')
    const corners = document.querySelectorAll('.underlay-nav__corner')
    const overlayBorders = document.querySelectorAll('.underlay-nav__border-row')
    const toggleLabels = document.querySelectorAll('.underlay-nav__toggle-label')
    const toggleBars = document.querySelectorAll('.underlay-nav__toggle-bar')

    const marqueeWrap = document.querySelector<HTMLElement>('[data-css-marquee]')?.parentElement

    if (!btn || !menuEl || !mainEl || !overlayEl || !darkEl || !menuBorder) return

    const openColor = '#fdf9ed'

    const getMenuOffset = () => -menuEl.offsetWidth

    gsap.set(overlayEl, { visibility: 'hidden', pointerEvents: 'none' })
    gsap.set(darkEl, { autoAlpha: 0 })
    gsap.set(mainEl, { x: 0 })
    gsap.set(toggleLabels, { yPercent: 0 })
    gsap.set(toggleBars, { y: 0, rotation: 0 })
    gsap.set(menuBorder, { scaleX: 0 })
    gsap.set(overlayBorders[0], { yPercent: -100 })
    gsap.set(overlayBorders[1], { yPercent: 100 })
    gsap.set(corners, { scale: 0 })

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
    })

    // -- Open --
    tl.set(overlayEl, { visibility: 'visible', pointerEvents: 'auto' }, 0)

    if (marqueeWrap) {
      tl.to(marqueeWrap, { yPercent: -100, duration: 0.3, ease: 'power2.in' }, 0)
    }

    tl.to([mainEl, overlayEl], { x: getMenuOffset, duration: 0.7 }, 0)
      .to(darkEl, { autoAlpha: 1, duration: 0.5 }, 0)
      .to(corners, { scale: 1, duration: 0.5 }, 0)
      .to(overlayBorders, { yPercent: 0, duration: 0.5 }, 0)
      .to(toggleLabels, { yPercent: -100, duration: 0.4 }, 0)
      .to(btn, { color: openColor, duration: 0.4 }, 0)
      .to(toggleBars[0], {
        y: '0.25em', rotation: 45, duration: 0.35,
        ease: 'back.out(1.4)',
      }, 0.05)
      .to(toggleBars[1], {
        y: '-0.25em', rotation: -45, duration: 0.35,
        ease: 'back.out(1.4)',
      }, 0.05)
      .fromTo(largeItems,
        { autoAlpha: 0, xPercent: 25 },
        { autoAlpha: 1, xPercent: 0, duration: 0.7, stagger: 0.05 },
        0,
      )
      .fromTo(smallItems,
        { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' },
        0.3,
      )
      .to(menuBorder, { scaleX: 1, duration: 0.5 }, '<')

    enterEndTimeRef.current = tl.duration()
    tl.addPause()

    // -- Close --
    tl.to([largeItems, smallItems], { autoAlpha: 0, duration: 0.3 }, '<')
      .to([mainEl, overlayEl], { x: 0, duration: 0.6 }, '<')
      .to(darkEl, { autoAlpha: 0, duration: 0.35, ease: 'power2.inOut' }, '<')
      .to(corners, { scale: 0, duration: 0.5 }, '<')
      .to(overlayBorders[0], { yPercent: -100, duration: 0.5 }, '<')
      .to(overlayBorders[1], { yPercent: 100, duration: 0.5 }, '<')
      .to(btn, { color: () => getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#fff', duration: 0.25 }, '<+=0.1')
      .to(toggleLabels, { yPercent: 0, duration: 0.25, ease: 'power3.in' }, '<')
      .to(toggleBars, { y: 0, rotation: 0, duration: 0.25, ease: 'power3.in' }, '<')

    if (marqueeWrap) {
      tl.to(marqueeWrap, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, '<')
    }

    tl.set(overlayEl, { visibility: 'hidden', pointerEvents: 'none' })

    tlRef.current = tl

    const handleOverlayClick = () => {
      if (isOpenRef.current) toggle()
    }
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) {
        toggle()
        btn.focus()
      }
    }
    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (isOpenRef.current) {
          gsap.set([mainEl, overlayEl], { x: getMenuOffset() })
        } else {
          tl.invalidate()
        }
      }, 150)
    }

    const header = getNavbarHeader()

    const handleLenisScroll = (lenis: Lenis) => {
      if (!header) return
      scrollStateRef.current = updateNavbarHeaderVisibility(
        header,
        scrollStateRef.current,
        isOpenRef.current,
        lenis,
      )
    }

    const onNavigateComplete = () => {
      scrollStateRef.current = resetNavbarScrollState()
    }

    overlayEl.addEventListener('click', handleOverlayClick)
    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('resize', handleResize)
    document.addEventListener('page-navigation-complete', onNavigateComplete)
    const unsubscribeLenis = subscribeLenisScroll(handleLenisScroll)
    if (header) {
      scrollStateRef.current = updateNavbarHeaderVisibility(
        header,
        scrollStateRef.current,
        isOpenRef.current,
      )
    }

    return () => {
      tl.kill()
      overlayEl.removeEventListener('click', handleOverlayClick)
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('page-navigation-complete', onNavigateComplete)
      unsubscribeLenis()
    }
  }, [toggle])

  const handleLinkClick = () => {
    if (isOpenRef.current) toggle()
  }

  return (
    <div className="underlay-nav">
      <header className="underlay-nav__header" data-theme-nav>
        <div data-nav-bar-height className="underlay-nav__bar">
            <div className="underlay-nav__container">
            <Link href="/" className="underlay-nav__logo font-display font-bold uppercase tracking-tight">
              Karen Ortiz
            </Link>
            <div className="flex items-center gap-5">
              <LocaleToggle />
              <ThemeToggle />
              <button
                ref={toggleRef}
                aria-expanded="false"
                aria-label={t('menu')}
                className="underlay-nav__toggle"
                onClick={toggle}
              >
                <span className="underlay-nav__toggle-text">
                  <span className="underlay-nav__toggle-label">{t('menu')}</span>
                  <span className="underlay-nav__toggle-label">{t('close')}</span>
                </span>
                <span className="underlay-nav__toggle-icon">
                  <span className="underlay-nav__toggle-bar" />
                  <span className="underlay-nav__toggle-bar" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav data-underlay-nav-menu className="underlay-nav__menu">
        <div className="underlay-nav__inner">
          <ul className="underlay-nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.label} data-reveal-l>
                <Link
                  href={link.href}
                  className={`underlay-nav__link-large${link.active ? ' is--active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <span className="underlay-nav__link-label">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="underlay-nav__bottom">
            <div className="underlay-nav__bottom-col">
              <div data-reveal-s>
                <span className="underlay-nav__link-small is--faded">{common('socials')}</span>
              </div>
              <ul className="underlay-nav__list is--small">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label} data-reveal-s>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underlay-nav__link-small font-accent flex items-center gap-2"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="underlay-nav__bottom-border" />
          </div>
        </div>
      </nav>

      <div data-underlay-nav-overlay className="underlay-nav__overlay">
        <div className="underlay-nav__dark" />
        <div className="underlay-nav__borders">
          <div className="underlay-nav__border-row">
            <div className="underlay-nav__border" />
            <div className="underlay-nav__corner" />
          </div>
          <div className="underlay-nav__border-row">
            <div className="underlay-nav__corner is--bottom" />
            <div className="underlay-nav__border" />
          </div>
        </div>
      </div>
    </div>
  )
}

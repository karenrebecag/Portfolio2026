'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/theme-toggle'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/karenrebecaortiz' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/karenrebecaortiz' },
  { label: 'Email', href: 'mailto:hello@karenortiz.dev' },
]

export function Navbar() {
  const t = useTranslations('nav')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const isOpenRef = useRef(false)
  const enterEndTimeRef = useRef(0)

  const NAV_LINKS = [
    { href: '#', label: t('home'), active: true },
    { href: '#projects', label: t('projects') },
    { href: '#about', label: t('about') },
    { href: '#contact', label: t('contact') },
  ]

  const toggle = useCallback(() => {
    const tl = tlRef.current
    const btn = toggleRef.current
    if (!tl || !btn) return

    isOpenRef.current = !isOpenRef.current
    const isOpen = isOpenRef.current

    btn.setAttribute('aria-expanded', String(isOpen))
    btn.setAttribute('aria-label', isOpen ? 'close menu' : 'open menu')
    document.body.setAttribute('data-menu-status', isOpen ? 'open' : '')

    if (isOpen) {
      tl.invalidate()
      if (tl.time() >= enterEndTimeRef.current) tl.timeScale(1).restart()
      else tl.timeScale(1).play()
    } else {
      if (tl.time() < enterEndTimeRef.current) tl.timeScale(1).reverse()
      else tl.timeScale(1).play()
    }
  }, [])

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

    const closedColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#fff'
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
      .to(btn, { color: closedColor, duration: 0.25 }, '<+=0.1')
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

    const header = document.querySelector<HTMLElement>('.underlay-nav__header')
    const handleScroll = () => {
      if (!header) return
      header.classList.toggle('is--scrolled', window.scrollY > 10)
    }

    overlayEl.addEventListener('click', handleOverlayClick)
    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      tl.kill()
      overlayEl.removeEventListener('click', handleOverlayClick)
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toggle])

  const handleLinkClick = () => {
    if (isOpenRef.current) toggle()
  }

  return (
    <div className="underlay-nav">
      <header className="underlay-nav__header">
        <div className="underlay-nav__bar">
          <div className="underlay-nav__container">
            <Link href="/" className="underlay-nav__logo font-display font-bold uppercase tracking-tight">
              Karen Ortiz
            </Link>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <button
                ref={toggleRef}
                aria-expanded="false"
                aria-label="open menu"
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
                <a
                  href={link.href}
                  className={`underlay-nav__link-large${link.active ? ' is--active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <span className="underlay-nav__link-label">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="underlay-nav__bottom">
            <div className="underlay-nav__bottom-col">
              <div data-reveal-s>
                <span className="underlay-nav__link-small is--faded">Socials</span>
              </div>
              <ul className="underlay-nav__list is--small">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label} data-reveal-s>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underlay-nav__link-small"
                    >
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

'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'

function getPageName(href: string): string {
  const path = href.replace(/^\/(en|es)/, '') || '/'
  if (path === '/' || path === '') return 'Home'
  const segments = path.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ')
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const labelTextRef = useRef<HTMLSpanElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const isFirstRender = useRef(true)
  const prevPathname = useRef(pathname)

  // Enter animation -- runs when pathname changes (new content mounted)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevPathname.current = pathname
      return
    }

    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    const content = contentRef.current
    const panel = panelRef.current
    const label = labelRef.current
    if (!content || !panel || !label) {
      isAnimating.current = false
      return
    }

    window.scrollTo(0, 0)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loader = loaderRef.current

    if (reducedMotion) {
      gsap.set(content, { clearProps: 'all', autoAlpha: 1 })
      gsap.set(panel, { autoAlpha: 0, yPercent: 0 })
      if (loader) gsap.set(loader, { scaleX: 0 })
      isAnimating.current = false
      document.dispatchEvent(new CustomEvent('page-navigation-complete'))
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(content, { clearProps: 'all' })
        gsap.set(panel, { autoAlpha: 0, yPercent: 0 })
        if (loader) gsap.set(loader, { scaleX: 0 })
        isAnimating.current = false
        document.dispatchEvent(new CustomEvent('page-navigation-complete'))
      },
    })

    tl.add('startEnter', 0.75)

    tl.set(content, { autoAlpha: 1 }, 'startEnter')

    tl.fromTo(panel,
      { yPercent: -100 },
      { yPercent: -200, duration: 1, ease: 'power3.inOut', overwrite: 'auto', immediateRender: false },
      'startEnter',
    )

    tl.fromTo(label,
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: 0.4, overwrite: 'auto', immediateRender: false },
      'startEnter+=0.1',
    )

    tl.from(content,
      { y: '15vh', duration: 1, ease: 'power3.inOut' },
      'startEnter',
    )
  }, [pathname])

  // Intercept internal link clicks -- run leave, then navigate
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (href === pathname) return
      if (isAnimating.current) return

      e.preventDefault()
      isAnimating.current = true

      const content = contentRef.current
      const panel = panelRef.current
      const label = labelRef.current
      const labelText = labelTextRef.current
      if (!content || !panel || !label || !labelText) {
        router.push(href)
        return
      }

      labelText.innerText = getPageName(href)

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        router.push(href)
        return
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(content, { autoAlpha: 0, clearProps: 'y' })
          router.push(href)
        },
      })

      const loader = loaderRef.current

      tl.set(panel, { autoAlpha: 1, yPercent: 0 }, 0)
      if (loader) tl.set(loader, { scaleX: 0, transformOrigin: 'left center' }, 0)

      tl.fromTo(panel,
        { yPercent: 0 },
        { yPercent: -100, duration: 0.8, ease: 'power3.inOut' },
        0,
      )

      tl.fromTo(label,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4 },
        '<+=0.2',
      )

      if (loader) {
        tl.to(loader, { scaleX: 1, duration: 1.2, ease: 'power1.inOut' }, 0.4)
      }

      tl.fromTo(content,
        { y: '0vh' },
        { y: '-15vh', duration: 0.8, ease: 'power3.inOut' },
        0,
      )
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname, router])

  return (
    <>
      <div className="page-transition">
        <div ref={panelRef} className="page-transition__panel">
          <div className="page-transition__content">
            <span ref={labelRef} className="page-transition__label">
              <span>[ </span>
              <span ref={labelTextRef}>Welcome</span>
              <span> ]</span>
            </span>
            <div className="page-transition__loader">
              <div ref={loaderRef} className="page-transition__loader-bar" />
            </div>
          </div>
        </div>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  )
}

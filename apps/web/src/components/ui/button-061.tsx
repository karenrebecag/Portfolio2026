'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { Link } from '@/i18n/navigation'

function isLocaleAwareHref(href?: string) {
  if (!href) return false
  if (href.startsWith('#')) return false
  if (/^(https?:|mailto:|tel:)/i.test(href)) return false
  return href.startsWith('/')
}

interface Button061Props {
  href?: string
  children: ReactNode
  colors?: string
  variant?: 'default' | 'secondary'
  className?: string
  target?: string
  rel?: string
  onClick?: (e: React.MouseEvent) => void
  arrow?: 'right' | 'left' | 'none'
  /** Render a native <button> (form submit) instead of an anchor. */
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const DEFAULT_COLORS = ''

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  if (direction === 'left') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
        <path d="M19 12H5M11 19l-7-7 7-7" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

function ButtonLabel({ children, arrow }: { children: ReactNode; arrow: 'right' | 'left' | 'none' }) {
  return (
    <span className="inline-flex items-center gap-2">
      {arrow === 'left' && <ArrowIcon direction="left" />}
      {children}
      {arrow === 'right' && <ArrowIcon direction="right" />}
    </span>
  )
}

export function Button061({
  href,
  children,
  colors = DEFAULT_COLORS,
  variant = 'default',
  className = '',
  target,
  rel,
  onClick,
  arrow = 'right',
  type,
  disabled,
}: Button061Props) {
  const variantClass = variant === 'secondary' ? 'button-061--secondary' : ''
  const buttonRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const circle = button.querySelector<HTMLElement>('[data-button-061-circle]')
    if (!circle) return

    function getThemeColors() {
      if (colors) return colors.split(',').map((c) => c.trim()).filter(Boolean)
      const plantation = getComputedStyle(document.documentElement).getPropertyValue('--plantation').trim()
      return plantation ? [plantation] : ['#366B5E']
    }
    let colorList = getThemeColors()
    let colorIndex = 0

    const mm = gsap.matchMedia()

    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const xSet = gsap.quickSetter(circle, 'xPercent')
      const ySet = gsap.quickSetter(circle, 'yPercent')

      function getXY(e: PointerEvent) {
        const { left, top, width, height } = button!.getBoundingClientRect()
        const xTransform = gsap.utils.pipe(
          gsap.utils.mapRange(0, width, 0, 100),
          gsap.utils.clamp(0, 100),
        )
        const yTransform = gsap.utils.pipe(
          gsap.utils.mapRange(0, height, 0, 100),
          gsap.utils.clamp(0, 100),
        )
        return {
          x: xTransform(e.clientX - left),
          y: yTransform(e.clientY - top),
        }
      }

      function setNextHoverColor() {
        colorList = getThemeColors()
        if (colorList.length === 0) return
        button!.style.setProperty('--button-061-hover-color-background', colorList[colorIndex % colorList.length])
        colorIndex = (colorIndex + 1) % colorList.length
      }

      function onEnter(e: PointerEvent) {
        setNextHoverColor()
        const { x, y } = getXY(e)
        xSet(x)
        ySet(y)
        gsap.to(circle, {
          scale: 1,
          duration: 1.25,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      function onLeave(e: PointerEvent) {
        const { x, y } = getXY(e)
        gsap.killTweensOf(circle)
        gsap.to(circle, {
          xPercent: x > 90 ? x + 25 : x < 12.5 ? x - 25 : x,
          yPercent: y > 90 ? y + 25 : y < 12.5 ? y - 25 : y,
          scale: 0,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      function onMove(e: PointerEvent) {
        const { x, y } = getXY(e)
        gsap.to(circle, {
          xPercent: x,
          yPercent: y,
          duration: 0.5,
          ease: 'power1',
          overwrite: 'auto',
        })
      }

      function onFocusIn() {
        if (button!.matches(':focus-visible')) setNextHoverColor()
      }

      button!.addEventListener('pointerenter', onEnter)
      button!.addEventListener('pointerleave', onLeave)
      button!.addEventListener('pointermove', onMove)
      button!.addEventListener('focusin', onFocusIn)

      return () => {
        button!.removeEventListener('pointerenter', onEnter)
        button!.removeEventListener('pointerleave', onLeave)
        button!.removeEventListener('pointermove', onMove)
        button!.removeEventListener('focusin', onFocusIn)
      }
    })

    return () => mm.revert()
  }, [colors])

  const sharedProps = {
    onClick,
    className: `button-061 ${variantClass} ${className}`,
    'data-button-061': true,
  } as const

  const inner = (
    <>
      <span className="button-061__bg" />
      <span className="button-061__bg-circle">
        <span className="button-061__circle-wrap" data-button-061-circle>
          <span className="button-061__circle" />
        </span>
      </span>
      <span className="button-061__inner font-accent">
        <span className="button-061__text" data-button-061-text>
          <span className="button-061__text-stack">
            <span className="button-061__text-line">
              <ButtonLabel arrow={arrow}>{children}</ButtonLabel>
            </span>
            <span className="button-061__text-line button-061__text-line--hover" aria-hidden="true">
              <ButtonLabel arrow={arrow}>{children}</ButtonLabel>
            </span>
          </span>
        </span>
      </span>
    </>
  )

  if (type) {
    return (
      <button
        {...sharedProps}
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        type={type}
        disabled={disabled}
      >
        {inner}
      </button>
    )
  }

  if (href && isLocaleAwareHref(href)) {
    return (
      <Link {...sharedProps} ref={buttonRef as React.RefObject<HTMLAnchorElement>} href={href} target={target} rel={rel}>
        {inner}
      </Link>
    )
  }

  return (
    <a {...sharedProps} ref={buttonRef as React.RefObject<HTMLAnchorElement>} href={href} target={target} rel={rel}>
      {inner}
    </a>
  )
}

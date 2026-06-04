'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface IconButtonProps {
  icon: ReactNode
  colors?: string
  variant?: 'default' | 'secondary'
  className?: string
  onClick?: (e: React.MouseEvent) => void
  href?: string
  target?: string
  rel?: string
  'aria-label': string
}

const DEFAULT_COLORS = ''

export function IconButton({
  icon,
  colors = DEFAULT_COLORS,
  variant = 'default',
  className = '',
  onClick,
  href,
  target,
  rel,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  const variantClass = variant === 'secondary' ? 'icon-button--secondary' : ''
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const circle = button.querySelector<HTMLElement>('[data-icon-button-circle]')
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

      button!.addEventListener('pointerenter', onEnter as EventListener)
      button!.addEventListener('pointerleave', onLeave as EventListener)
      button!.addEventListener('pointermove', onMove as EventListener)
      button!.addEventListener('focusin', onFocusIn)

      return () => {
        button!.removeEventListener('pointerenter', onEnter as EventListener)
        button!.removeEventListener('pointerleave', onLeave as EventListener)
        button!.removeEventListener('pointermove', onMove as EventListener)
        button!.removeEventListener('focusin', onFocusIn)
      }
    })

    return () => mm.revert()
  }, [colors])

  const inner = (
    <>
      <span className="button-061__bg" />
      <span className="button-061__bg-circle">
        <span className="button-061__circle-wrap" data-icon-button-circle>
          <span className="button-061__circle" />
        </span>
      </span>
      <span className="icon-button__inner">{icon}</span>
    </>
  )

  if (href) {
    return (
      <a
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={`icon-button ${variantClass} ${className}`}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`icon-button ${variantClass} ${className}`}
    >
      {inner}
    </button>
  )
}

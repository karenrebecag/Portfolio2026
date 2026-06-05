'use client'

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'

export type CursorLabels = {
  scroll: string
  email: string
  call: string
  open: string
  view: string
  click: string
  focus: string
}

function getAutoLabel(el: HTMLElement, labels: CursorLabels): string {
  const tag = el.tagName.toLowerCase()
  if (tag === 'a') {
    const href = el.getAttribute('href') || ''
    if (href.startsWith('#')) return labels.scroll
    if (href.startsWith('mailto:')) return labels.email
    if (href.startsWith('tel:')) return labels.call
    if (el.getAttribute('target') === '_blank') return labels.open
    return labels.view
  }
  if (tag === 'button' || el.getAttribute('role') === 'button') return labels.click
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return labels.focus
  return labels.click
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  )
}

function calcRotation(dx: number, dy: number): number {
  return Math.atan2(dy, dx) * (180 / Math.PI) + 90
}

function initCustomCursor(labels: CursorLabels) {
  if (isTouchDevice()) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const pointerEl = document.querySelector<HTMLElement>('.cursor-pointer')
  const textEl = document.querySelector<HTMLElement>('.cursor-text')
  const textLabel = document.querySelector<HTMLElement>('.cursor-text__label')
  if (!pointerEl || !textEl || !textLabel) return
  const labelEl = textLabel

  const INTERACTIVE = 'a, button, [role="button"], [data-cursor]'
  let currentTarget: HTMLElement | null = null
  let lastText = labels.view
  let activated = false
  let lastX = 0
  let lastY = 0
  let currentRotation = 0
  let targetRotation = 0

  let windowWidth = window.innerWidth
  let windowHeight = window.innerHeight
  let textThreshold = textEl.offsetWidth + 16

  let sectionRafId = 0
  let pendingCx = 0
  let pendingCy = 0

  function detectSection() {
    const el = document.elementFromPoint(pendingCx, pendingCy)
    const section = el?.closest<HTMLElement>('[data-theme-section]')
    document.body.setAttribute('data-cursor-theme', section?.getAttribute('data-theme-section') || 'light')
    sectionRafId = 0
  }

  let pillTween: gsap.core.Tween | null = null

  const pointerXTo = gsap.quickTo(pointerEl, 'left', { duration: 0.35, ease: 'power3' })
  const pointerYTo = gsap.quickTo(pointerEl, 'top', { duration: 0.35, ease: 'power3' })
  const textXTo = gsap.quickTo(textEl, 'x', { duration: 0.4, ease: 'power3' })
  const textYTo = gsap.quickTo(textEl, 'y', { duration: 0.4, ease: 'power3' })

  const tickerCb = () => {
    currentRotation += (targetRotation - currentRotation) * 0.1
    gsap.set(pointerEl, { rotation: currentRotation })
  }
  gsap.ticker.add(tickerCb)

  function handleMouseMove(e: MouseEvent) {
    const cx = e.clientX
    const cy = e.clientY

    if (!activated) {
      activated = true
      document.body.classList.add('cursor-active')
      gsap.set(pointerEl, { left: cx, top: cy, opacity: 1 })
      lastX = cx
      lastY = cy
      return
    }

    pointerXTo(cx)
    pointerYTo(cy)

    pendingCx = cx
    pendingCy = cy
    if (!sectionRafId) sectionRafId = requestAnimationFrame(detectSection)

    const dx = cx - lastX
    const dy = cy - lastY
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      targetRotation = calcRotation(dx, dy)
    }
    lastX = cx
    lastY = cy

    let xPercent = 6
    let yPercent = 140

    if (cx > windowWidth - textThreshold) xPercent = -106
    if (cy > windowHeight * 0.9) yPercent = -140

    if (pillTween) {
      pillTween.vars.xPercent = xPercent
      pillTween.vars.yPercent = yPercent
      pillTween.invalidate().restart()
    } else {
      pillTween = gsap.to(textEl, { xPercent, yPercent, duration: 0.9, ease: 'power3' })
    }
    textXTo(cx)
    textYTo(cy)

    if (currentTarget) {
      const customText = currentTarget.getAttribute('data-cursor')
      const newText = customText || getAutoLabel(currentTarget, labels)
      if (newText !== lastText) {
        labelEl.textContent = newText
        lastText = newText
      }
    }
  }

  function handleResize() {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
    textThreshold = textEl!.offsetWidth + 16
  }
  window.addEventListener('resize', handleResize)

  function handlePointerOver(e: PointerEvent) {
    const target = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE)
    if (!target) return

    currentTarget = target
    const customText = target.getAttribute('data-cursor')
    const newText = customText || getAutoLabel(target, labels)

    if (newText !== lastText) {
      labelEl.textContent = newText
      lastText = newText
    }

    gsap.to(pointerEl, { scale: 1.4, duration: 0.25, ease: 'power2.out' })
  }

  function handlePointerOut(e: PointerEvent) {
    const target = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE)
    if (!target) return
    if (currentTarget === target) {
      currentTarget = null
      lastText = ''
    }

    gsap.to(pointerEl, { scale: 1, duration: 0.25, ease: 'power2.out' })
  }

  function handleMouseLeave() {
    activated = false
    document.body.classList.remove('cursor-active')
    gsap.to(pointerEl, { opacity: 0, duration: 0.2 })
  }

  window.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('pointerover', handlePointerOver)
  document.addEventListener('pointerout', handlePointerOut)
  document.documentElement.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('pointerover', handlePointerOver)
    document.removeEventListener('pointerout', handlePointerOut)
    document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
    document.body.classList.remove('cursor-active')
    gsap.ticker.remove(tickerCb)
    if (sectionRafId) cancelAnimationFrame(sectionRafId)
    pillTween?.kill()
    gsap.killTweensOf(pointerEl)
    gsap.killTweensOf(textEl)
  }
}

export function CustomCursor() {
  const t = useTranslations('common')
  const labels = useMemo(
    () => ({
      scroll: t('cursor_scroll'),
      email: t('cursor_email'),
      call: t('cursor_call'),
      open: t('cursor_open'),
      view: t('cursor_view'),
      click: t('cursor_click'),
      focus: t('cursor_focus'),
    }),
    [t],
  )

  useEffect(() => {
    let cleanup: (() => void) | undefined

    function start() {
      cleanup = initCustomCursor(labels)
    }

    if (document.body.hasAttribute('data-page-ready')) {
      start()
    } else {
      document.addEventListener('page-ready', start, { once: true })
    }

    function onNavigate() {
      if (cleanup) cleanup()
      cleanup = initCustomCursor(labels)
    }
    document.addEventListener('page-navigation-complete', onNavigate)

    return () => {
      cleanup?.()
      document.removeEventListener('page-ready', start)
      document.removeEventListener('page-navigation-complete', onNavigate)
    }
  }, [labels])

  return (
    <>
      <div className="cursor-pointer" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
            fill="currentColor"
            stroke="var(--cursor-stroke)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="cursor-text" aria-hidden="true">
        <span className="cursor-text__label">{labels.view}</span>
      </div>
    </>
  )
}
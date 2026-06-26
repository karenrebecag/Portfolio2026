'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Efecto de hero "letter ripple" (port de MWG 041).
 * Lista vertical grande tipo menú: al pasar el cursor sobre las letras, estas
 * hacen un desplazamiento escalonado con rebote partiendo de la letra bajo el
 * mouse. Reutilizable para cualquier hero — recibe los items como texto.
 * Estilos en globals.css bajo `.hero-hover-list`.
 */

type HeroHoverListProps = {
  items: string[]
  className?: string
}

function wrapLettersInSpan(element: HTMLElement) {
  const text = element.textContent ?? ''
  element.innerHTML = text
    .split('')
    .map((char) =>
      char === ' ' ? '<span>&nbsp;</span>' : `<span class="letter">${char}</span>`,
    )
    .join('')
}

function getChildIndex(child: Element) {
  return Array.from(child.parentNode?.children ?? []).indexOf(child)
}

export function HeroHoverList({ items, className = '' }: HeroHoverListProps) {
  const rootRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const cleanups: Array<() => void> = []

    root.querySelectorAll<HTMLElement>('.hero-hover-list__item').forEach((item) => {
      const hidden = item.querySelector<HTMLElement>('[data-layer="hidden"]')
      const visible = item.querySelector<HTMLElement>('[data-layer="visible"]')
      if (!hidden || !visible) return

      wrapLettersInSpan(hidden)
      wrapLettersInSpan(visible)

      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const visibleSpans = item.querySelectorAll('[data-layer="visible"] span')
        const hiddenSpans = item.querySelectorAll('[data-layer="hidden"] span')

        if (!gsap.isTweening(visibleSpans) && item.classList.contains('is-hovered')) {
          item.classList.remove('is-hovered')
        }

        if (!target.classList.contains('letter')) return

        item.classList.add('is-hovered')
        const indexHover = getChildIndex(target)

        gsap.to(visibleSpans, {
          yPercent: 100,
          ease: 'back.out(2)',
          duration: 0.6,
          stagger: { each: 0.023, from: indexHover },
        })
        gsap.to(hiddenSpans, {
          yPercent: 100,
          ease: 'back.out(2)',
          duration: 0.6,
          stagger: { each: 0.023, from: indexHover },
          onComplete: () => {
            gsap.set(visibleSpans, { clearProps: 'all' })
            gsap.set(hiddenSpans, { clearProps: 'all' })
          },
        })
      }

      item.addEventListener('mouseover', onMouseOver)
      cleanups.push(() => item.removeEventListener('mouseover', onMouseOver))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [items])

  return (
    <ul ref={rootRef} className={`hero-hover-list ${className}`}>
      {items.map((label) => (
        <li key={label} className="hero-hover-list__item">
          <span data-layer="hidden" className="hero-hover-list__layer--hidden">
            {label}
          </span>
          <span data-layer="visible">{label}</span>
        </li>
      ))}
    </ul>
  )
}

'use client'

import { useEffect } from 'react'

/**
 * Inicializa los accordions CSS de la página (patrón OSMO). El click solo
 * alterna `data-accordion-status`; la apertura la anima `grid-template-rows`
 * desde globals.css, sin medir alturas.
 *
 * Va por delegación sobre `[data-accordion-css-init]` para que el markup y su
 * copy se queden en el server component que lo monta.
 */
export function AccordionCssInit() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-accordion-css-init]'))

    const detach = roots.map((accordion) => {
      const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true'

      const setStatus = (item: HTMLElement, active: boolean) => {
        item.setAttribute('data-accordion-status', active ? 'active' : 'not-active')
        item.querySelector('[data-accordion-toggle]')?.setAttribute('aria-expanded', String(active))
      }

      const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null
        const toggle = target?.closest('[data-accordion-toggle]')
        if (!toggle) return

        const item = toggle.closest<HTMLElement>('[data-accordion-status]')
        if (!item) return

        const isActive = item.getAttribute('data-accordion-status') === 'active'
        setStatus(item, !isActive)

        if (closeSiblings && !isActive) {
          accordion.querySelectorAll<HTMLElement>('[data-accordion-status="active"]').forEach((sibling) => {
            if (sibling !== item) setStatus(sibling, false)
          })
        }
      }

      accordion.addEventListener('click', onClick)
      return () => accordion.removeEventListener('click', onClick)
    })

    return () => detach.forEach((off) => off())
  }, [])

  return null
}

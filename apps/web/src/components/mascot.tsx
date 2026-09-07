'use client'

import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { MascotBody, MascotFace } from '@/components/mascot-art'
import styles from './mascot.module.css'

gsap.registerPlugin(ScrollTrigger)

type MascotProps = {
  /**
   * Cuánto se desplaza la cara hacia el cursor, en % de su propio tamaño.
   * El original usa 30 por defecto; 35 es el valor del ejemplo.
   */
  intensity?: number
  /** Ancho de la mascota (cualquier longitud CSS). Por defecto, la del port. */
  size?: string
  className?: string
}

/**
 * Mascota cuya cara sigue al cursor (port de "Face Follow Cursor").
 *
 * El listener de mousemove solo existe mientras la mascota está en viewport
 * (ScrollTrigger lo engancha y lo suelta), y el movimiento se aplica con
 * quickTo dentro de un rAF: una sola escritura por frame, sin timeline.
 */
export function Mascot({ intensity = 35, size, className = '' }: MascotProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  usePageInit(
    useCallback(() => {
      const root = rootRef.current
      // El SVG de la cara es el elemento animado; se busca por clase como en
      // los demás ports (el arte vive en otro archivo y no reenvía refs).
      const face = root?.querySelector<SVGSVGElement>(`.${styles.faceSvg}`)
      if (!root || !face) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const setX = gsap.quickTo(face, 'xPercent', { duration: 0.3, ease: 'power2' })
      const setY = gsap.quickTo(face, 'yPercent', { duration: 0.3, ease: 'power2' })

      let tracking = false
      let frameQueued = false
      const mouse = { x: 0, y: 0 }

      const update = () => {
        frameQueued = false

        const rect = face.getBoundingClientRect()
        const radiusX = rect.width / 2
        const radiusY = rect.height / 2
        if (!radiusX || !radiusY) return

        let x = (mouse.x - (rect.left + radiusX)) / radiusX
        let y = (mouse.y - (rect.top + radiusY)) / radiusY

        // Fuera del radio la cara ya está al tope: se normaliza para que el
        // desplazamiento sea circular y no se estire en las esquinas.
        const magnitude = Math.hypot(x, y)
        if (magnitude > 1) {
          x /= magnitude
          y /= magnitude
        }

        setX(x * intensity)
        setY(y * intensity)
      }

      const onMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX
        mouse.y = event.clientY
        if (!frameQueued) {
          frameQueued = true
          requestAnimationFrame(update)
        }
      }

      const startTracking = () => {
        if (tracking) return
        window.addEventListener('mousemove', onMouseMove)
        tracking = true
      }

      const stopTracking = () => {
        if (!tracking) return
        window.removeEventListener('mousemove', onMouseMove)
        tracking = false
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: startTracking,
        onEnterBack: startTracking,
        onLeave: stopTracking,
        onLeaveBack: stopTracking,
      })

      return () => {
        stopTracking()
        trigger.kill()
        gsap.set(face, { clearProps: 'all' })
      }
    }, [intensity]),
  )

  return (
    <div
      ref={rootRef}
      className={`${styles.mascot} ${className}`}
      style={size ? ({ '--mascot-size': size } as React.CSSProperties) : undefined}
      aria-hidden="true"
    >
      <MascotBody className={styles.body} />
      <div className={styles.face}>
        <MascotFace className={styles.faceSvg} />
      </div>
    </div>
  )
}

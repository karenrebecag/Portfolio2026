'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Image trail al mover el cursor (port de MWG 020).
 * Cada cierto desplazamiento acumulado spawnea un shape en la posición del
 * cursor: aparece con rebote elástico, se desplaza en la dirección del
 * movimiento y se encoge hasta desaparecer, ciclando la lista `images`.
 * La capa es pointer-events:none; el listener se monta en su contenedor padre
 * para capturar el movimiento sobre todo el hero (incluido el texto).
 * Estilos en globals.css bajo `.cursor-image-trail`.
 */

type CursorImageTrailProps = {
  images: string[]
  className?: string
  /** Divisor de window.innerWidth que define la distancia entre spawns. */
  resetDivisor?: number
  /** Si se define, spawnea shapes solo automáticamente cada ~N ms (con jitter). */
  autoIntervalMs?: number
  /** Trail siguiendo el cursor. Desactívalo para dejar solo el auto-popup. */
  cursorTrail?: boolean
}

export function CursorImageTrail({
  images,
  className = '',
  resetDivisor = 8,
  autoIntervalMs,
  cursorTrail = true,
}: CursorImageTrailProps) {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const target = layer?.parentElement
    if (!layer || !target) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })

    let incr = 0
    let oldX = 0
    let oldY = 0
    let started = false
    let indexImg = 0
    const tweens = new Set<gsap.core.Timeline>()

    const spawn = (x: number, y: number, deltaX: number, deltaY: number) => {
      const image = document.createElement('img')
      image.src = images[indexImg]
      image.alt = ''
      layer.appendChild(image)

      const tl = gsap.timeline({
        onComplete: () => {
          if (image.parentNode === layer) layer.removeChild(image)
          tweens.delete(tl)
          tl.kill()
        },
      })
      tweens.add(tl)

      tl.fromTo(
        image,
        {
          xPercent: -50 + (Math.random() - 0.5) * 80,
          yPercent: -50 + (Math.random() - 0.5) * 10,
          scaleX: 1.3,
          scaleY: 1.3,
        },
        { scaleX: 1, scaleY: 1, ease: 'elastic.out(2, 0.6)', duration: 0.6 },
      )
      tl.fromTo(
        image,
        { x, y, rotation: (Math.random() - 0.5) * 20 },
        {
          x: `+=${deltaX * 4}`,
          y: `+=${deltaY * 4}`,
          rotation: (Math.random() - 0.5) * 20,
          ease: 'power4.out',
          duration: 1.5,
        },
        '<',
      )
      tl.to(image, { duration: 0.3, scale: 0.5, delay: 0.1, ease: 'back.in(1.5)' })

      indexImg = (indexImg + 1) % images.length
    }

    const onMove = (e: MouseEvent) => {
      const valX = e.clientX
      const valY = e.clientY

      if (!started) {
        oldX = valX
        oldY = valY
        started = true
        return
      }

      incr += Math.abs(valX - oldX) + Math.abs(valY - oldY)

      if (incr > window.innerWidth / resetDivisor) {
        incr = 0
        const rect = layer.getBoundingClientRect()
        spawn(valX - rect.left, valY - rect.top, valX - oldX, valY - oldY)
      }

      oldX = valX
      oldY = valY
    }

    if (cursorTrail) target.addEventListener('mousemove', onMove)

    // Auto-spawn: shapes que aparecen solos, en posiciones aleatorias y con
    // jitter en el ritmo para que no se sienta metronómico. Menor volumen.
    let autoTimer: ReturnType<typeof setTimeout> | undefined
    if (autoIntervalMs) {
      const tick = () => {
        const rect = layer.getBoundingClientRect()
        if (rect.width && rect.height) {
          spawn(
            Math.random() * rect.width,
            Math.random() * rect.height,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
          )
        }
        autoTimer = setTimeout(tick, autoIntervalMs * (0.6 + Math.random() * 0.8))
      }
      autoTimer = setTimeout(tick, autoIntervalMs)
    }

    return () => {
      target.removeEventListener('mousemove', onMove)
      if (autoTimer) clearTimeout(autoTimer)
      tweens.forEach((tl) => tl.kill())
      layer.replaceChildren()
    }
  }, [images, resetDivisor, autoIntervalMs, cursorTrail])

  return <div ref={layerRef} aria-hidden className={`cursor-image-trail ${className}`} />
}

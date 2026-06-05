'use client'

import { useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageInit } from '@/lib/use-page-init'
import { clampScrollPosition } from '@/lib/scroll-trigger-position'
import { scheduleScrollTriggerRefresh } from '@/lib/scroll-trigger-refresh'

gsap.registerPlugin(ScrollTrigger)

type PendingReveal = { scrollTrigger: ScrollTrigger; reveal: () => void }

function initContentRevealScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const pending: PendingReveal[] = []

  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((groupEl) => {
      const groupStaggerSec = (parseFloat(groupEl.getAttribute('data-stagger') || '100')) / 1000
      const groupDistance = groupEl.getAttribute('data-distance') || '2em'
      const triggerStart = clampScrollPosition(groupEl.getAttribute('data-start') ?? '')
      const animDuration = 0.8
      const animEase = 'power4.inOut'

      if (prefersReduced) {
        gsap.set(groupEl, { clearProps: 'all', y: 0, autoAlpha: 1 })
        return
      }

      let revealed = false
      const registerReveal = (reveal: () => void) => {
        const scrollTrigger = ScrollTrigger.create({
          trigger: groupEl,
          start: triggerStart,
          once: true,
          onEnter: reveal,
        })
        pending.push({ scrollTrigger, reveal })
      }

      const directChildren = Array.from(groupEl.children).filter((el) => el.nodeType === 1) as HTMLElement[]
      if (!directChildren.length) {
        gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 })
        registerReveal(() => {
          if (revealed) return
          revealed = true
          gsap.to(groupEl, {
            y: 0,
            autoAlpha: 1,
            duration: animDuration,
            ease: animEase,
            onComplete: () => gsap.set(groupEl, { clearProps: 'all' }),
          })
        })
        return
      }

      type Slot =
        | { type: 'item'; el: HTMLElement }
        | { type: 'nested'; parentEl: HTMLElement; nestedEl: HTMLElement; includeParent: boolean; nestedChildren: HTMLElement[] }

      const slots: Slot[] = []
      directChildren.forEach((child) => {
        const nestedGroup = child.matches('[data-reveal-group-nested]') ? child : child.querySelector<HTMLElement>(':scope [data-reveal-group-nested]')
        if (nestedGroup) {
          const includeParent = child.getAttribute('data-ignore') !== 'true' && (child.getAttribute('data-ignore') === 'false' || nestedGroup.getAttribute('data-ignore') === 'false')
          const nestedChildren = Array.from(nestedGroup.children).filter((el) => el.nodeType === 1 && (el as HTMLElement).getAttribute('data-ignore') !== 'true') as HTMLElement[]
          slots.push({ type: 'nested', parentEl: child, nestedEl: nestedGroup, includeParent, nestedChildren })
        } else {
          if (child.getAttribute('data-ignore') === 'true') return
          slots.push({ type: 'item', el: child })
        }
      })

      slots.forEach((slot) => {
        if (slot.type === 'item') {
          const isNestedSelf = slot.el.matches('[data-reveal-group-nested]')
          const d = isNestedSelf ? groupDistance : (slot.el.getAttribute('data-distance') || groupDistance)
          gsap.set(slot.el, { y: d, autoAlpha: 0 })
        } else {
          if (slot.includeParent) gsap.set(slot.parentEl, { y: groupDistance, autoAlpha: 0 })
          const nestedD = slot.nestedEl.getAttribute('data-distance') || groupDistance
          slot.nestedChildren.forEach((target) => gsap.set(target, { y: nestedD, autoAlpha: 0 }))
        }
      })

      slots.forEach((slot) => {
        if (slot.type === 'nested' && slot.includeParent) gsap.set(slot.parentEl, { y: groupDistance })
      })

      registerReveal(() => {
        if (revealed) return
        revealed = true
        const tl = gsap.timeline()
        slots.forEach((slot, slotIndex) => {
          const slotTime = slotIndex * groupStaggerSec
          if (slot.type === 'item') {
            tl.to(slot.el, { y: 0, autoAlpha: 1, duration: animDuration, ease: animEase, onComplete: () => gsap.set(slot.el, { clearProps: 'all' }) }, slotTime)
          } else {
            if (slot.includeParent) {
              tl.to(slot.parentEl, { y: 0, autoAlpha: 1, duration: animDuration, ease: animEase, onComplete: () => gsap.set(slot.parentEl, { clearProps: 'all' }) }, slotTime)
            }
            const nestedMs = parseFloat(slot.nestedEl.getAttribute('data-stagger') || '')
            const nestedStaggerSec = isNaN(nestedMs) ? groupStaggerSec : nestedMs / 1000
            slot.nestedChildren.forEach((nestedChild, nestedIndex) => {
              tl.to(nestedChild, { y: 0, autoAlpha: 1, duration: animDuration, ease: animEase, onComplete: () => gsap.set(nestedChild, { clearProps: 'all' }) }, slotTime + nestedIndex * nestedStaggerSec)
            })
          }
        })
      })
    })
  })

  const revealIfInView = () => {
    pending.forEach(({ scrollTrigger, reveal }) => {
      const trigger = scrollTrigger.trigger as HTMLElement
      if (scrollTrigger.isActive || ScrollTrigger.isInViewport(trigger, 0.12)) reveal()
    })
  }

  revealIfInView()
  scheduleScrollTriggerRefresh(true)
  requestAnimationFrame(revealIfInView)

  return () => ctx.revert()
}

export function ContentRevealProvider({ children }: { children: React.ReactNode }) {
  usePageInit(useCallback(() => initContentRevealScroll(), []))
  return <>{children}</>
}
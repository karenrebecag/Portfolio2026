import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ManagedSection = {
  id: number
  revert: () => void
}

// WeakMap: keys are garbage-collected when the element is removed from the DOM.
// No orphaned entries after navigation or unmount.
const managedSections = new WeakMap<HTMLElement, ManagedSection>()
let sectionCounter = 0

export function destroyScrollHighlights(root: ParentNode = document) {
  resolveHighlightSections(root).forEach((section) => {
    const managed = managedSections.get(section)
    if (managed) {
      managed.revert()
      managedSections.delete(section)
    }
  })
}

function resolveHighlightSections(root: ParentNode): HTMLElement[] {
  if (root instanceof HTMLElement && root.matches('[data-scroll-highlight]')) {
    return [root]
  }
  return Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-highlight]'))
}

export function initScrollHighlights(root: ParentNode = document) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  resolveHighlightSections(root).forEach((section) => {
    const marks = section.querySelectorAll<HTMLElement>('[data-highlight]')
    if (!marks.length) return

    // Skip sections already initialized; destroy stale entries before re-init.
    const existing = managedSections.get(section)
    if (existing) {
      existing.revert()
      managedSections.delete(section)
    }

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(marks, { backgroundSize: '100% 100%' })
        return
      }

      gsap.set(marks, { backgroundSize: '0% 100%' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 20%',
          scrub: 0.35,
        },
      })

      marks.forEach((mark, index) => {
        tl.to(
          mark,
          { backgroundSize: '100% 100%', ease: 'none', duration: 1 },
          index * 0.12,
        )
      })
    }, section)

    managedSections.set(section, { id: ++sectionCounter, revert: () => ctx.revert() })
  })
}

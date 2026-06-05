import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export type SplitRevealType = 'lines' | 'words' | 'chars'

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
} as const

type ManagedHeadingSplit = {
  fingerprint: string
  revert: () => void
}

const activeHeadingSplits = new Set<HTMLElement>()
const managedHeadings = new Map<HTMLElement, ManagedHeadingSplit>()

function splitTypesFor(reveal: SplitRevealType): string[] {
  if (reveal === 'lines') return ['lines']
  if (reveal === 'words') return ['lines', 'words']
  return ['lines', 'words', 'chars']
}

export function getHeadingSplitFingerprint(heading: HTMLElement): string {
  const trigger = heading.getAttribute('data-split-trigger') || 'scroll'
  const reveal = heading.getAttribute('data-split-reveal') || 'lines'
  const text = heading.textContent?.trim() ?? ''
  return `${trigger}|${reveal}|${text}`
}

function revertHeading(heading: HTMLElement) {
  const managed = managedHeadings.get(heading)
  if (!managed) return
  managed.revert()
  managedHeadings.delete(heading)
  activeHeadingSplits.delete(heading)
}

function pruneDetachedHeadingSplits() {
  for (const heading of managedHeadings.keys()) {
    if (!document.contains(heading)) {
      managedHeadings.delete(heading)
      activeHeadingSplits.delete(heading)
    }
  }
}

function headingInRevealViewport(heading: HTMLElement) {
  const rect = heading.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.8 && rect.bottom > 0
}

/** Tear down all heading splits (call on route change cleanup). */
export function destroyAllHeadingSplits() {
  for (const heading of [...activeHeadingSplits]) {
    revertHeading(heading)
  }
  activeHeadingSplits.clear()
  pruneDetachedHeadingSplits()
}

function mountHeadingSplit(heading: HTMLElement) {
  const fingerprint = getHeadingSplitFingerprint(heading)
  const existing = managedHeadings.get(heading)

  if (existing?.fingerprint === fingerprint) {
    return
  }

  if (existing) {
    revertHeading(heading)
  }

  const trigger = heading.getAttribute('data-split-trigger') || 'scroll'
  const reveal = (heading.getAttribute('data-split-reveal') || 'lines') as SplitRevealType
  const typesToSplit = splitTypesFor(reveal)
  const scrollTriggers: ScrollTrigger[] = []

  gsap.set(heading, { autoAlpha: 1 })

  const splitInstance = SplitText.create(heading, {
    type: typesToSplit.join(', '),
    mask: 'lines',
    autoSplit: true,
    linesClass: 'line',
    wordsClass: 'word',
    charsClass: 'letter',
    onSplit(instance) {
      const targets = instance[reveal]
      const config = splitConfig[reveal]

      if (trigger === 'mount') {
        gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
        })
        return
      }

      const tween = gsap.from(targets, {
        yPercent: 110,
        duration: config.duration,
        stagger: config.stagger,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: heading,
          start: 'clamp(top 80%)',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      if (tween.scrollTrigger) {
        scrollTriggers.push(tween.scrollTrigger)
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        const st = tween.scrollTrigger
        if (!st || st.progress > 0) return
        if (!headingInRevealViewport(heading)) return

        st.kill()
        const idx = scrollTriggers.indexOf(st)
        if (idx >= 0) scrollTriggers.splice(idx, 1)
        gsap.killTweensOf(targets)
        gsap.to(targets, {
          yPercent: 0,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          overwrite: 'auto',
        })
      })
    },
  })

  const revert = () => {
    scrollTriggers.forEach((st) => st.kill())
    scrollTriggers.length = 0
    splitInstance.kill()
    splitInstance.revert()
    gsap.set(heading, { clearProps: 'all' })
  }

  managedHeadings.set(heading, { fingerprint, revert })
  activeHeadingSplits.add(heading)
}

/** Split only new or changed headings; skip unchanged nodes. */
export function initHeadingSplits(root: ParentNode = document) {
  pruneDetachedHeadingSplits()
  root.querySelectorAll<HTMLElement>('[data-split="heading"]').forEach(mountHeadingSplit)
  ScrollTrigger.refresh()
}
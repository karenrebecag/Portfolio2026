import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

let osmoEaseReady = false

function ensureOsmoEase() {
  if (osmoEaseReady) return
  gsap.registerPlugin(CustomEase)
  CustomEase.create('osmo', '0.625, 0.05, 0, 1')
  osmoEaseReady = true
}

/** Osmo Column Wipe — https://www.osmo.supply/ */
export const COLUMN_WIPE = {
  panelCount: 5,
  duration: 0.6,
  stagger: 0.06,
  ease: 'osmo' as const,
  /** Columns fully cover the viewport before enter reveal starts. */
  enterDelay: 1,
  yCovered: 100,
  yRevealed: 200,
  /** Osmo CSS default — only active during wipe; hidden at 0 outside. */
  linesOpacity: 0.1,
  linesFade: 0.4,
} as const

function hideWipeLinesInstant(lines: HTMLElement | null) {
  if (!lines) return
  gsap.set(lines, { opacity: 0 })
}

function fadeWipeLinesIn(tl: gsap.core.Timeline, lines: HTMLElement | null, position: number | string = 0) {
  if (!lines) return
  gsap.set(lines, { opacity: 0 })
  tl.to(
    lines,
    { opacity: COLUMN_WIPE.linesOpacity, duration: COLUMN_WIPE.linesFade, ease: COLUMN_WIPE.ease },
    position,
  )
}

function fadeWipeLinesOut(tl: gsap.core.Timeline, lines: HTMLElement | null, position: number | string) {
  if (!lines) return
  tl.to(lines, { opacity: 0, duration: COLUMN_WIPE.linesFade, ease: COLUMN_WIPE.ease }, position)
}

export function getWipeElements(root: HTMLElement) {
  const columns = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-transition-column]'))
  const lines = root.querySelector<HTMLElement>('.transition__lines')
  return { columns, lines }
}

/** Force the wipe lines back to opacity 0. The CSS default is 0.1, so any
 *  settle that skips the enter fade (pop, interrupted nav) would leave them
 *  faintly visible — call this to guarantee they're hidden. */
export function hideWipeLines(root: HTMLElement) {
  hideWipeLinesInstant(root.querySelector<HTMLElement>('.transition__lines'))
}

/** Leave: columns 0 → 100, stagger right-to-left (from: end). */
export function playWipeLeave(root: HTMLElement, onComplete?: () => void): gsap.core.Timeline {
  ensureOsmoEase()
  const { columns, lines } = getWipeElements(root)

  gsap.set(columns, { yPercent: 0, force3D: true })

  const tl = gsap.timeline({ onComplete })
  fadeWipeLinesIn(tl, lines, 0)
  tl.fromTo(
    columns,
    { yPercent: 0 },
    {
      yPercent: COLUMN_WIPE.yCovered,
      duration: COLUMN_WIPE.duration,
      stagger: { each: COLUMN_WIPE.stagger, from: 'end' },
      ease: COLUMN_WIPE.ease,
      overwrite: 'auto',
      force3D: true,
    },
    0,
  )

  return tl
}

/** Enter: wait enterDelay, then columns → 200 to reveal page underneath. */
export function playWipeEnter(
  root: HTMLElement,
  content: HTMLElement,
  onPageReady?: () => void,
): gsap.core.Timeline {
  ensureOsmoEase()
  const { columns, lines } = getWipeElements(root)

  gsap.set(columns, { yPercent: COLUMN_WIPE.yCovered, force3D: true })
  gsap.set(content, { autoAlpha: 0 })
  if (lines) gsap.set(lines, { opacity: COLUMN_WIPE.linesOpacity })

  const tl = gsap.timeline()

  tl.add('startEnter', COLUMN_WIPE.enterDelay)
  tl.set(content, { autoAlpha: 1 }, 'startEnter')
  tl.to(
    columns,
    {
      yPercent: COLUMN_WIPE.yRevealed,
      duration: COLUMN_WIPE.duration,
      stagger: COLUMN_WIPE.stagger,
      ease: COLUMN_WIPE.ease,
      overwrite: 'auto',
      force3D: true,
    },
    'startEnter',
  )
  fadeWipeLinesOut(tl, lines, `startEnter+=${COLUMN_WIPE.duration * 0.35}`)
  tl.add('pageReady')
  if (onPageReady) {
    tl.call(onPageReady, [], 'pageReady')
  }

  return tl
}

/** First load (Barba once): columns idle above viewport, page visible. */
export function resetWipeColumns(root: HTMLElement) {
  const { columns, lines } = getWipeElements(root)
  gsap.set(columns, { yPercent: 0, force3D: true })
  hideWipeLinesInstant(lines)
}
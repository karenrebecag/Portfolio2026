/**
 * Navigation Orchestrator — shared types.
 *
 * Single source of truth for the navigation state machine. No React, no DOM:
 * these are pure types so the orchestrator and scroll policy stay testable.
 */

/** Phases of a single navigation, in order. See orchestrator.ts for transitions. */
export type NavPhase =
  | 'boot' // first load (Osmo "once"): page visible, no wipe
  | 'idle' // settled, no navigation in flight
  | 'leaving' // column wipe out (forward only)
  | 'swapping' // router committed; new DOM mounting, screen covered or popping
  | 'entering' // column wipe in (forward only)
  | 'mounting' // controllers sync init, scroll settle
  | 'stable' // user can interact

export type NavIntent = 'push' | 'pop' | 'replace'

/** Forward reveals animate; restored (pop) views appear instantly. */
export type RevealMode = 'animate' | 'instant'

/** Where to land after the swap. Resolved to a concrete Y by the scroll policy. */
export type ScrollTarget = number | 'top' | 'restore' | 'hash'

/** Immutable snapshot of the active navigation. */
export type NavigationSnapshot = {
  phase: NavPhase
  intent: NavIntent
  from: string
  to: string
  hash: string | null
  revealMode: RevealMode
  scrollY: ScrollTarget
  reducedMotion: boolean
}

/** Context passed to controllers when they mount during a navigation. */
export type ControllerContext = {
  phase: NavPhase
  intent: NavIntent
  revealMode: RevealMode
  reducedMotion: boolean
}

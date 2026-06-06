/**
 * Navigation Orchestrator — pure state machine.
 *
 * One source of truth for navigation phase. No React, no DOM, no timers: every
 * transition is a pure function of (phase, event), so the whole pipeline is unit
 * testable. The React layer (navigation-context.tsx) drives it with real events.
 *
 * Pipeline (Osmo-equivalent, adapted to Next App Router):
 *   ocultar -> swap DOM -> scroll correcto -> init controllers -> estabilizar -> revelar
 */

import { decideScroll } from './scroll-policy'
import type {
  ControllerContext,
  NavIntent,
  NavPhase,
  NavigationSnapshot,
  RevealMode,
} from './types'

export type NavEvent =
  | { type: 'BOOT_COMPLETE' }
  | {
      type: 'NAVIGATE'
      intent: NavIntent
      from: string
      to: string
      hash: string | null
      reducedMotion: boolean
    }
  | { type: 'WIPE_LEAVE_DONE' }
  | { type: 'DOM_SWAPPED' }
  | { type: 'WIPE_ENTER_DONE' }
  | { type: 'CONTROLLERS_READY' }
  | { type: 'SETTLE' }

/** Forward reveals animate; restored (pop) views appear instantly. */
export function decideRevealMode(intent: NavIntent): RevealMode {
  return intent === 'pop' ? 'instant' : 'animate'
}

/** Phases from which a fresh navigation may start. */
const INTERACTIVE: readonly NavPhase[] = ['idle', 'stable']

/** Context the DOM_SWAPPED branch needs to choose entering vs mounting. */
type SwapContext = {
  intent: NavIntent
  reducedMotion: boolean
  revealMode: RevealMode
}

/**
 * Pure phase transition. Returns the next phase, or null when the event is not
 * valid in the current phase (caller should ignore it).
 */
export function nextPhase(
  phase: NavPhase,
  event: NavEvent,
  swap?: SwapContext,
): NavPhase | null {
  switch (event.type) {
    case 'BOOT_COMPLETE':
      return phase === 'boot' ? 'stable' : null

    case 'NAVIGATE':
      if (!INTERACTIVE.includes(phase)) return null
      // pop skips the leave wipe (screen was never covered); push/replace wipe out.
      return event.intent === 'pop' ? 'swapping' : 'leaving'

    case 'WIPE_LEAVE_DONE':
      return phase === 'leaving' ? 'swapping' : null

    case 'DOM_SWAPPED': {
      if (phase !== 'swapping') return null
      const instant =
        !swap ||
        swap.reducedMotion ||
        swap.intent === 'pop' ||
        swap.revealMode === 'instant'
      return instant ? 'mounting' : 'entering'
    }

    case 'WIPE_ENTER_DONE':
      return phase === 'entering' ? 'mounting' : null

    case 'CONTROLLERS_READY':
      return phase === 'mounting' ? 'stable' : null

    case 'SETTLE':
      return phase === 'stable' ? 'idle' : null

    default:
      return null
  }
}

const BOOT_SNAPSHOT: NavigationSnapshot = {
  phase: 'boot',
  intent: 'push',
  from: '',
  to: '',
  hash: null,
  revealMode: 'animate',
  scrollY: 'top',
  reducedMotion: false,
}

export type Unsubscribe = () => void

/**
 * Stateful wrapper around `nextPhase`. Holds the active snapshot and notifies
 * subscribers on every accepted transition. Still framework-free.
 */
export class NavigationOrchestrator {
  private snapshot: NavigationSnapshot
  private listeners = new Set<(s: NavigationSnapshot) => void>()

  constructor(initial: NavPhase = 'boot') {
    this.snapshot = { ...BOOT_SNAPSHOT, phase: initial }
  }

  getSnapshot(): NavigationSnapshot {
    return this.snapshot
  }

  subscribe(fn: (s: NavigationSnapshot) => void): Unsubscribe {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  controllerContext(): ControllerContext {
    const { phase, intent, revealMode, reducedMotion } = this.snapshot
    return { phase, intent, revealMode, reducedMotion }
  }

  /** Apply an event. Returns true if it caused a transition. */
  dispatch(event: NavEvent): boolean {
    const swap: SwapContext = {
      intent: this.snapshot.intent,
      reducedMotion: this.snapshot.reducedMotion,
      revealMode: this.snapshot.revealMode,
    }
    const phase = nextPhase(this.snapshot.phase, event, swap)
    if (phase === null) return false

    if (event.type === 'NAVIGATE') {
      this.snapshot = {
        phase,
        intent: event.intent,
        from: event.from,
        to: event.to,
        hash: event.hash,
        revealMode: decideRevealMode(event.intent),
        scrollY: decideScroll(event.intent, event.hash),
        reducedMotion: event.reducedMotion,
      }
    } else {
      this.snapshot = { ...this.snapshot, phase }
    }

    for (const fn of this.listeners) fn(this.snapshot)
    return true
  }
}

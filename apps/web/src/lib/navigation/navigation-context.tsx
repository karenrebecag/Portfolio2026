'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { NAV_ORCHESTRATOR_ENABLED } from './flag'
import { NavigationOrchestrator } from './orchestrator'
import { ControllerRegistry, type ControllerSpec } from './controller-registry'
import type { NavPhase } from './types'

type NavigationApi = {
  orchestrator: NavigationOrchestrator
  registry: ControllerRegistry
}

const NavigationCtx = createContext<NavigationApi | null>(null)

/**
 * NavigationProvider — sits below Lenis, above the GSAP providers in the layout.
 *
 * PR1: when the flag is off this is a pure passthrough (zero behavior change).
 * When on, it exposes the orchestrator + registry via context but does NOT yet
 * hijack navigation, scroll, or controllers — that wiring lands in later PRs.
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const apiRef = useRef<NavigationApi | null>(null)
  if (NAV_ORCHESTRATOR_ENABLED && !apiRef.current) {
    apiRef.current = {
      orchestrator: new NavigationOrchestrator('boot'),
      registry: new ControllerRegistry(),
    }
  }

  if (!NAV_ORCHESTRATOR_ENABLED) return <>{children}</>

  return <NavigationCtx.Provider value={apiRef.current}>{children}</NavigationCtx.Provider>
}

/** Current navigation phase. Falls back to 'stable' when the flag is off. */
export function useNavigationPhase(): NavPhase {
  const api = useContext(NavigationCtx)
  return useSyncExternalStore(
    (onChange) => (api ? api.orchestrator.subscribe(onChange) : () => {}),
    () => api?.orchestrator.getSnapshot().phase ?? 'stable',
    () => 'stable',
  )
}

/** Raw orchestrator instance, or null when the flag is off. */
export function useNavigationOrchestrator(): NavigationOrchestrator | null {
  return useContext(NavigationCtx)?.orchestrator ?? null
}

/**
 * Register a controller for the duration of the component's life. No-op when the
 * flag is off, so call sites can adopt it before the registry drives mounting.
 */
export function useNavigationController(spec: ControllerSpec): void {
  const api = useContext(NavigationCtx)
  useEffect(() => {
    if (!api) return
    return api.registry.register(spec)
    // spec identity is owned by the caller (memoize it there)
  }, [api, spec])
}

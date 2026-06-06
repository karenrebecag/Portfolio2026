'use client'

/**
 * Layout entry point for the Navigation Orchestrator. Kept as a thin component
 * in /components so the layout imports a stable path; all logic lives in
 * lib/navigation. Passthrough when the flag is off.
 */
export { NavigationProvider } from '@/lib/navigation/navigation-context'

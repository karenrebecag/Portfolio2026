/**
 * Feature flag for the Navigation Orchestrator.
 *
 * Off by default. The legacy PageTransition + usePageInit + scroll-session path
 * stays live until each PR migrates a slice behind this flag. Set
 * `NEXT_PUBLIC_NAV_ORCHESTRATOR=1` (env) to opt in during development.
 */
export const NAV_ORCHESTRATOR_ENABLED =
  process.env.NEXT_PUBLIC_NAV_ORCHESTRATOR === '1'

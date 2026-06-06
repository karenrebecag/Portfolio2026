/** Navigation Orchestrator — public surface. */
export { NAV_ORCHESTRATOR_ENABLED } from './flag'
export {
  NavigationOrchestrator,
  decideRevealMode,
  nextPhase,
  type NavEvent,
  type Unsubscribe,
} from './orchestrator'
export {
  ScrollPolicy,
  decideScroll,
  type ScrollExecutor,
} from './scroll-policy'
export {
  ControllerRegistry,
  type ControllerSpec,
  type ControllerCleanup,
} from './controller-registry'
export {
  attachLinkInterceptor,
  type LinkInterceptorOptions,
} from './link-interceptor'
export {
  NavigationProvider,
  useNavigationPhase,
  useNavigationOrchestrator,
  useNavigationController,
} from './navigation-context'
export type {
  NavPhase,
  NavIntent,
  RevealMode,
  ScrollTarget,
  NavigationSnapshot,
  ControllerContext,
} from './types'

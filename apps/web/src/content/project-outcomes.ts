/** One-line impact outcome shown under each project on the home list (EN/ES). */
export const PROJECT_OUTCOMES: Record<string, { en: string; es: string }> = {
  'design-system-that-ships-itself': {
    en: 'Enabled non-technical teams to ship on-brand pages without a dev ticket per tweak—~40% less design→dev rework on marketing surfaces (team estimate).',
    es: 'Equipos no técnicos publican páginas on-brand sin un ticket de dev por cada ajuste—~40% menos retrabajo diseño→dev en marketing (estimación del equipo).',
  },
  'conversational-agent-three-layer-stack': {
    en: 'Booking and chat on infrastructure the client owns—no third-party inbox for calendar handoffs; workflow changes without redeploying the marketing site.',
    es: 'Chat y booking en infraestructura propia—sin bandeja de terceros para el calendario; cambios de workflow sin redesplegar el sitio de marketing.',
  },
  'context-driven-visual-development': {
    en: 'Webflow shines until complex JavaScript lands in a textarea—with no history, no rollback, and every publish straight to production. This essay documents the split: marketers keep pages and copy; engineering keeps animations and logic in a real codebase.',
    es: 'Webflow brilla hasta que el JavaScript complejo cae en un textarea—sin historial, sin rollback, y cada publish directo a producción. Este ensayo documenta el split: marketing conserva páginas y copy; ingeniería conserva animaciones y lógica en un codebase real.',
  },
  'context-driven-development-vibecoding': {
    en: 'Client teams ship internal tools with shared specs in git—fewer blind AI rewrites and faster path from demo to staging.',
    es: 'Equipos cliente publican herramientas internas con specs en git—menos reescrituras a ciegas con IA y camino más rápido de demo a staging.',
  },
  'monex-one-mobile-banking': {
    en: 'Product design case study for Banco Monex mobile banking: FX, payments, and flow architecture with Aurin × Ancient Global; App Store within a year.',
    es: 'Caso de diseño de producto para banca móvil Banco Monex: divisas, pagos y arquitectura de flujos con Aurin × Ancient Global; App Store al año.',
  },
  'aurin-task-manager': {
    en: 'Aurin consolidated daily ops into one real-time hub—Kanban, per-task chat, time tracking, client share links, and AI triage—so the agency could run fully remote-first.',
    es: 'Aurin unificó operaciones diarias en un hub en tiempo real—Kanban, chat por tarea, time tracking, enlaces para clientes y triage con IA—para operar 100% remote-first.',
  },
  'decoupled-ownership-non-technical-teams': {
    en: 'Architecture ADRs for regulated LATAM products—marketing publishes on its plane; payments, identity, and audit evidence stay on engineering’s.',
    es: 'ADRs de arquitectura para productos LATAM regulados—marketing publica en su plano; pagos, identidad y evidencia de auditoría quedan en ingeniería.',
  },
  'portfolio-frontend-design-and-code': {
    en: 'Most portfolios are a theme with your photo swapped in. This one documents the full product—long essays that teach, motion that survives navigation, and the open code behind the site you are browsing.',
    es: 'La mayoría de portfolios son un theme con tu foto cambiada. Este documenta el producto entero—ensayos largos que enseñan, motion que no se rompe al navegar, y el código abierto del sitio que estás viendo.',
  },
  'maria-luisa-de-mateo-jamstack': {
    en: 'The site updates when she posts on Artsy or Instagram—not when she remembers a CMS password she was never going to use.',
    es: 'El sitio se actualiza cuando publica en Artsy o Instagram—no cuando recuerda una contraseña de CMS que nunca iba a usar.',
  },
}

export function getProjectOutcome(slug: string, locale: string): string | undefined {
  const entry = PROJECT_OUTCOMES[slug]
  if (!entry) return undefined
  return locale === 'es' ? entry.es : entry.en
}
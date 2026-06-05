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
    en: 'Marketing publishes copy in minutes; engineering ships JS via git—animation fixes no longer need a full Webflow republish.',
    es: 'Marketing publica copy en minutos; ingeniería despliega JS por git—fixes de animación ya no exigen republish completo de Webflow.',
  },
  'context-driven-development-vibecoding': {
    en: 'Client teams ship internal tools with shared specs in git—fewer blind AI rewrites and faster path from demo to staging.',
    es: 'Equipos cliente publican herramientas internas con specs en git—menos reescrituras a ciegas con IA y camino más rápido de demo a staging.',
  },
  'decoupled-ownership-non-technical-teams': {
    en: 'Architecture so education/marketing can publish without touching payments or audit evidence—a headline change does not imply a checkout redeploy.',
    es: 'Arquitectura para que educación/marketing publique sin tocar pagos ni auditoría—un cambio de titular no implica redesplegar checkout.',
  },
  'token-first-design-at-scale': {
    en: 'Token-first system adopted across squads—UI inconsistencies down ~80% vs. pre-system baseline (internal audit).',
    es: 'Sistema token-first adoptado por squads—inconsistencias de UI ~80% menores vs. línea base pre-sistema (auditoría interna).',
  },
  'real-time-product-intelligence-with-ai': {
    en: 'Product and growth teams self-serve dashboards—engineering no longer the bottleneck for every chart or filter change.',
    es: 'Producto y growth consumen dashboards solos—ingeniería deja de ser cuello de botella en cada gráfica o filtro.',
  },
  'component-libraries-that-ship': {
    en: 'Shared React package across time zones—one component fix propagates to three product teams without fork drift.',
    es: 'Paquete React compartido entre zonas horarias—un fix de componente llega a tres equipos sin drift de forks.',
  },
  'ai-agents-for-non-technical-teams': {
    en: 'MCP guardrails let ops and marketing automate workflows without shipping unreviewed scripts to production.',
    es: 'Barandillas MCP permiten que ops y marketing automaticen sin subir scripts sin revisión a producción.',
  },
  'automating-operations-with-llms': {
    en: 'Ops automations cut manual triage time ~60% on repetitive tickets (pilot team estimate).',
    es: 'Automatizaciones de ops redujeron ~60% el tiempo manual en tickets repetitivos (estimación piloto).',
  },
}

export function getProjectOutcome(slug: string, locale: string): string | undefined {
  const entry = PROJECT_OUTCOMES[slug]
  if (!entry) return undefined
  return locale === 'es' ? entry.es : entry.en
}
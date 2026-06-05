export type ProjectLocaleFields = {
  title: string
  summary: string
  role: string
  services: string
}

export const PLACEHOLDER_PROJECT_I18N: Record<string, { en: ProjectLocaleFields; es: ProjectLocaleFields }> = {
  'token-first-design-at-scale': {
    en: {
      title: 'Token-First Design at Scale',
      summary: 'A token-first design system powering consistent UI across web and mobile products.',
      role: 'Lead Designer & Engineer',
      services: 'Development',
    },
    es: {
      title: 'Design system token-first a escala',
      summary: 'Sistema de diseño token-first para UI consistente en productos web y móviles.',
      role: 'Lead Designer & Engineer',
      services: 'Desarrollo',
    },
  },
  'real-time-product-intelligence-with-ai': {
    en: {
      title: 'Real-Time Product Intelligence with AI',
      summary: 'AI-powered analytics dashboard for product teams to understand user behavior in real-time.',
      role: 'Frontend Engineer',
      services: 'Design, Development',
    },
    es: {
      title: 'Inteligencia de producto en tiempo real con IA',
      summary: 'Dashboard de analytics con IA para que equipos de producto entiendan el comportamiento en tiempo real.',
      role: 'Frontend Engineer',
      services: 'Diseño, Desarrollo',
    },
  },
  'component-libraries-that-ship': {
    en: {
      title: 'Component Libraries That Ship',
      summary: 'Component library and npm package for distributed product teams building with React.',
      role: 'Engineer',
      services: 'Development',
    },
    es: {
      title: 'Librerías de componentes que llegan a producción',
      summary: 'Librería de componentes y paquete npm para equipos de producto distribuidos con React.',
      role: 'Engineer',
      services: 'Desarrollo',
    },
  },
  'ai-agents-for-non-technical-teams': {
    en: {
      title: 'AI Agents for Non-Technical Teams',
      summary: 'MCP server integrations and AI agent tools that enable non-technical teams to automate workflows.',
      role: 'Designer & Engineer',
      services: 'Strategy, Design',
    },
    es: {
      title: 'Agentes de IA para equipos no técnicos',
      summary: 'Integraciones MCP y herramientas de agentes que permiten automatizar flujos sin escribir código.',
      role: 'Designer & Engineer',
      services: 'Estrategia, Diseño',
    },
  },
  'automating-operations-with-llms': {
    en: {
      title: 'Automating Operations with LLMs',
      summary: 'Automation platform connecting LLMs with internal tools for product operations teams.',
      role: 'Engineer',
      services: 'AI, Development',
    },
    es: {
      title: 'Automatización de operaciones con LLMs',
      summary: 'Plataforma que conecta LLMs con herramientas internas para equipos de operaciones de producto.',
      role: 'Engineer',
      services: 'IA, Desarrollo',
    },
  },
}
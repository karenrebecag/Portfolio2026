import { SITE_URL } from '@/lib/seo'

/** Default OG image (absolute). Next also serves /opengraph-image dynamically. */
export const SITE_OG_IMAGE = `${SITE_URL}/opengraph-image`

export const SITE_AUTHOR = {
  name: 'Karen Rebeca Ortiz',
  alternateName: 'Karen Ortiz',
  email: 'karenrortizg@gmail.com',
  twitter: '@karenrebecag',
} as const

export const SITE_SOCIAL = {
  github: 'https://github.com/karenrebecag',
  linkedin: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282',
  instagram: 'https://www.instagram.com/karenrebeca.og/',
} as const

/** Keywords merged from Astro portfolio + 2026 positioning (Product Engineer, AI, MCP). */
export const SITE_KEYWORDS = [
  'Karen Rebeca Ortiz',
  'Karen Ortiz',
  'Product Engineer',
  'Design Engineer',
  'UX/UI Designer',
  'Frontend Developer',
  'Full-Stack Developer',
  'React',
  'Next.js',
  'Astro',
  'TypeScript',
  'GSAP',
  'Design Systems',
  'AI Integration',
  'MCP',
  'LLM Automation',
  'Web Architecture',
  'LATAM',
  'Remote Developer',
  'Freelance',
  'Portfolio',
] as const

export type FaqPair = { question: string; answer: string }

/** FAQ content for FAQPage JSON-LD and LLM citation (ported + updated for 2026). */
export const SITE_FAQ: Record<'es' | 'en', FaqPair[]> = {
  en: [
    {
      question: 'What does Karen Rebeca Ortiz do as a product engineer?',
      answer:
        'Karen designs and builds AI-powered web products end to end: frontend, backend, AI integrations (MCP, agents, automation), design systems, and infrastructure — from architecture to the last pixel.',
    },
    {
      question: 'What technologies does Karen specialize in?',
      answer:
        'Next.js, React, TypeScript, Astro, GSAP, design systems, MCP servers, LLM workflows, Supabase, and product-grade Webflow + code hybrids for marketing and product teams.',
    },
    {
      question: 'Is Karen available for freelance or full-time work?',
      answer:
        'Yes. Karen works with teams across LATAM, the United States, and Europe on freelance, consulting, and full-time product engineering engagements.',
    },
    {
      question: 'Where is Karen Rebeca Ortiz based?',
      answer:
        'Based in Mexico, working remotely with global clients. Primary site: karenrebecaortiz.com.',
    },
    {
      question: 'What kind of articles are on this portfolio?',
      answer:
        'Long-form case studies on AI-assisted development, design systems that ship themselves, embedded chatbots, decoupled ownership platforms, and Webflow + React integration — written for engineers and product leads.',
    },
  ],
  es: [
    {
      question: '¿Qué hace Karen Rebeca Ortiz como product engineer?',
      answer:
        'Diseña y construye productos web impulsados por IA de punta a punta: frontend, backend, integraciones de IA (MCP, agentes, automatización), design systems e infraestructura — de la arquitectura al último píxel.',
    },
    {
      question: '¿En qué tecnologías se especializa Karen?',
      answer:
        'Next.js, React, TypeScript, Astro, GSAP, design systems, servidores MCP, flujos con LLMs, Supabase e integraciones Webflow + código para equipos de producto y marketing.',
    },
    {
      question: '¿Karen está disponible para freelance o tiempo completo?',
      answer:
        'Sí. Trabaja con equipos en LATAM, Estados Unidos y Europa en proyectos freelance, consultoría y roles de product engineering.',
    },
    {
      question: '¿Dónde está ubicada Karen Rebeca Ortiz?',
      answer:
        'Con base en México, en remoto con clientes globales. Sitio principal: karenrebecaortiz.com.',
    },
    {
      question: '¿Qué tipo de artículos publica en este portfolio?',
      answer:
        'Casos de estudio largos sobre desarrollo asistido por IA, design systems, chatbots embebidos, plataformas con ownership desacoplado e integración Webflow + React — para engineers y product leads.',
    },
  ],
}

/** CSS selectors for SpeakableSpecification (voice / AI snippets). */
export const HOME_SPEAKABLE_SELECTORS = [
  '#hero h1',
  '#hero h2',
  '#hero .hero-cta-primary',
  '#projects h2',
  '#about h2',
  '#contact h2',
] as const

export const ABOUT_SPEAKABLE_SELECTORS = ['#about-page h1', '#about-page h2', '#about-page p'] as const
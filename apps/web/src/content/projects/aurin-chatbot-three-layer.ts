/**
 * Case study: Aurin conversational agent (three-layer stack)
 */

import esMarkdown from './aurin-chatbot-three-layer-es.md'
import enMarkdown from './aurin-chatbot-three-layer-en.md'

export const aurinChatbotThreeLayerMeta = {
  id: '8',
  slug: 'conversational-agent-three-layer-stack',
  articleSlug: 'conversational-agent-three-layer-stack',
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'Astro' },
    { tag: 'TypeScript' },
    { tag: 'n8n' },
    { tag: 'Google Calendar' },
    { tag: 'SSR' },
  ],
  liveUrl: 'https://aurin.mx',
  repoUrl: 'https://github.com/AurinExperience/AurinWebsite',
  services: 'Product Engineering, Conversational UX, Infrastructure',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2ea2b1de5d693cf173_Elegant%20Ice%20Bottle%20Display.avif',
    alt: 'Aurin conversational agent',
  },
  createdAt: '2026-06-04',
  updatedAt: '2026-06-04',
}

export const aurinChatbotThreeLayerI18n = {
  en: {
    title: 'A Conversational Agent | on a Three-Layer Stack You Own',
    summary:
      'Third-party chat widgets are fast to install, but bookings and customer data often live in someone else\'s dashboard—not on your calendar or CRM. I built an on-brand assistant for a bilingual services site where conversations and scheduling stay under the team\'s control. You will see why that split matters for trust and operations, and what improved in practice: fewer surprises when copy changes, and meetings that actually land on the company calendar instead of a vendor inbox.',
  },
  es: {
    title: 'Un agente conversacional | en un stack de tres capas propio',
    summary:
      'Los chats de terceros se instalan rápido, pero las reservas y los datos del cliente suelen quedarse en el panel de otro proveedor—no en tu calendario ni en tu CRM. Construí un asistente alineado a la marca para un sitio de servicios bilingüe donde conversación y agendamiento siguen bajo control del equipo. Verás por qué ese reparto importa para confianza y operación, y qué mejoró en la práctica: menos sorpresas cuando cambia el copy, y reuniones que caen en el calendario de la empresa y no en la bandeja de un SaaS.',
  },
}

export const aurinChatbotThreeLayerMarkdown_es = esMarkdown
export const aurinChatbotThreeLayerMarkdown_en = enMarkdown
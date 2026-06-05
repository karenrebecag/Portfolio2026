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
      'Astro SSR as proxy, TypeScript session and intent handling on the client, and self-hosted n8n on a VPS | Google Calendar booking without Intercom or Tidio.',
  },
  es: {
    title: 'Un agente conversacional | en un stack de tres capas propio',
    summary:
      'Proxy SSR en Astro, sesión e intents en TypeScript en el cliente, y n8n self-hosted en VPS | booking en Google Calendar sin Intercom ni Tidio.',
  },
}

export const aurinChatbotThreeLayerMarkdown_es = esMarkdown
export const aurinChatbotThreeLayerMarkdown_en = enMarkdown
/**
 * Case study: Salesforce ATFX read-only MCP connector (zero-admin architecture)
 */

import esMarkdown from './salesforce-atfx-mcp-es.md'
import enMarkdown from './salesforce-atfx-mcp-en.md'

export const salesforceAtfxMcpMeta = {
  id: '12',
  slug: 'salesforce-connector-without-admin-access',
  canonicalRoute: 'project' as const,
  status: 'published' as const,
  category: 'web' as const,
  role: 'Product Engineer',
  year: '2026',
  featured: true,
  tags: [
    { tag: 'MCP' },
    { tag: 'Salesforce' },
    { tag: 'TypeScript' },
    { tag: 'Node.js' },
    { tag: 'AI Agents' },
  ],
  liveUrl: '',
  repoUrl: '',
  services: 'Product Engineering, AI Integrations, Data Enablement',
  coverImage: {
    url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e349d92acc75bd79fa8_Minimalist%20Green%20Stools.avif',
    alt: 'Salesforce ATFX read-only MCP connector',
  },
  createdAt: '2026-06-16',
  updatedAt: '2026-06-16',
}

export const salesforceAtfxMcpI18n = {
  en: {
    title: 'ATFX’s CRM, in Plain Language | Live Salesforce Analytics Without a New Credential',
    summary:
      'A brokerage regulated across nine jurisdictions wanted non-technical teams to query Salesforce in plain language, without loosening a control a regulated firm keeps for good reasons. Instead of minting a new credential, the connector reuses the OAuth grant Salesforce already sanctions for its CLI: company-domain login to connect, read-only by construction, zero secrets held. Reports that took engineering two days are now self-served in minutes.',
  },
  es: {
    title: 'El CRM de ATFX, en lenguaje natural | Analítica de Salesforce en vivo sin credencial nueva',
    summary:
      'Una brokerage regulada en nueve jurisdicciones quería que equipos no técnicos consultaran Salesforce en lenguaje natural, sin aflojar un control que una firma regulada conserva por buenas razones. En lugar de acuñar una credencial nueva, el conector reutiliza el grant OAuth que Salesforce ya sanciona para su CLI: login por dominio de la empresa para conectar, read-only por construcción, cero secretos guardados. Reportes que tomaban dos días a ingeniería ahora se autoatienden en minutos.',
  },
}

export const salesforceAtfxMcpMarkdown_es = esMarkdown
export const salesforceAtfxMcpMarkdown_en = enMarkdown

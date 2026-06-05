// Per-article case studies — one source file per article for easy writing and git history.
// These are converted to Lexical format (what the project detail renderer expects).
import { atomWebflowMeta, atomWebflowI18n, atomWebflowMarkdown_en, atomWebflowMarkdown_es } from '@/content/projects/atom-webflow'
import {
  aurinChatbotThreeLayerMeta,
  aurinChatbotThreeLayerI18n,
  aurinChatbotThreeLayerMarkdown_en,
  aurinChatbotThreeLayerMarkdown_es,
} from '@/content/projects/aurin-chatbot-three-layer'
import {
  contextDrivenVibecodingMeta,
  contextDrivenVibecodingI18n,
  contextDrivenVibecodingMarkdown_en,
  contextDrivenVibecodingMarkdown_es,
} from '@/content/projects/context-driven-vibecoding'
import {
  designSystemShipsItselfMeta,
  designSystemShipsItselfI18n,
  designSystemShipsItselfMarkdown_en,
  designSystemShipsItselfMarkdown_es,
} from '@/content/projects/design-system-ships-itself'
import { PLACEHOLDER_PROJECT_I18N } from '@/content/projects/placeholder-i18n'
import { parseMarkdown } from '@/lib/markdown-to-lexical'
import type { Project } from '@karen-portfolio/shared'
import type { Block } from '@/components/blocks/types'

type PlaceholderProject = Project & {
  services?: string
  blocks?: Block[]
  i18n?: Record<string, { title: string; summary: string; role?: string; services?: string; lexical?: unknown; blocks?: Block[] }>
}

function withPlaceholderI18n(project: PlaceholderProject): PlaceholderProject {
  const localized = PLACEHOLDER_PROJECT_I18N[project.slug]
  if (!localized) return project

  return {
    ...project,
    title: localized.en.title,
    summary: localized.en.summary,
    role: localized.en.role,
    services: localized.en.services,
    i18n: {
      en: {
        title: localized.en.title,
        summary: localized.en.summary,
        role: localized.en.role,
        services: localized.en.services,
      },
      es: {
        title: localized.es.title,
        summary: localized.es.summary,
        role: localized.es.role,
        services: localized.es.services,
      },
    },
  }
}

export const STICKERS = [
  { src: '/stickers/astrosticker.webp', alt: 'Astro' },
  { src: '/stickers/dockersticker.webp', alt: 'Docker' },
  { src: '/stickers/gsapsticker.webp', alt: 'GSAP' },
  { src: '/stickers/claudecodesticker.webp', alt: 'Claude Code' },
  { src: '/stickers/nextjsSticker.webp', alt: 'Next.js' },
  { src: '/stickers/postgressticker.webp', alt: 'PostgreSQL' },
  { src: '/stickers/reactsticker.webp', alt: 'React' },
  { src: '/stickers/TypescriptSticker.webp', alt: 'TypeScript' },
  { src: '/stickers/figmasticker.webp', alt: 'Figma' },
  { src: '/stickers/githubsticker.webp', alt: 'GitHub' },
] as const

const atomWebflowParsed_en = parseMarkdown(atomWebflowMarkdown_en)
const atomWebflowParsed_es = parseMarkdown(atomWebflowMarkdown_es)
const aurinChatbotParsed_en = parseMarkdown(aurinChatbotThreeLayerMarkdown_en)
const aurinChatbotParsed_es = parseMarkdown(aurinChatbotThreeLayerMarkdown_es)
const contextDrivenVibecodingParsed_en = parseMarkdown(contextDrivenVibecodingMarkdown_en)
const contextDrivenVibecodingParsed_es = parseMarkdown(contextDrivenVibecodingMarkdown_es)
const designSystemParsed_en = parseMarkdown(designSystemShipsItselfMarkdown_en)
const designSystemParsed_es = parseMarkdown(designSystemShipsItselfMarkdown_es)

export const PLACEHOLDER_PROJECTS: PlaceholderProject[] = [
  // Long-form articles first (home links to /articulos/…)
  {
    ...contextDrivenVibecodingMeta,
    title: contextDrivenVibecodingI18n.en.title,
    summary: contextDrivenVibecodingI18n.en.summary,
    description: contextDrivenVibecodingParsed_en.lexical,
    blocks: contextDrivenVibecodingParsed_en.blocks,
    i18n: {
      en: {
        ...contextDrivenVibecodingI18n.en,
        lexical: contextDrivenVibecodingParsed_en.lexical,
        blocks: contextDrivenVibecodingParsed_en.blocks,
      },
      es: {
        ...contextDrivenVibecodingI18n.es,
        lexical: contextDrivenVibecodingParsed_es.lexical,
        blocks: contextDrivenVibecodingParsed_es.blocks,
      },
    },
  },
  {
    ...aurinChatbotThreeLayerMeta,
    title: aurinChatbotThreeLayerI18n.en.title,
    summary: aurinChatbotThreeLayerI18n.en.summary,
    description: aurinChatbotParsed_en.lexical,
    blocks: aurinChatbotParsed_en.blocks,
    i18n: {
      en: {
        ...aurinChatbotThreeLayerI18n.en,
        lexical: aurinChatbotParsed_en.lexical,
        blocks: aurinChatbotParsed_en.blocks,
      },
      es: {
        ...aurinChatbotThreeLayerI18n.es,
        lexical: aurinChatbotParsed_es.lexical,
        blocks: aurinChatbotParsed_es.blocks,
      },
    },
  },
  {
    ...designSystemShipsItselfMeta,
    title: designSystemShipsItselfI18n.en.title,
    summary: designSystemShipsItselfI18n.en.summary,
    description: designSystemParsed_en.lexical,
    blocks: designSystemParsed_en.blocks,
    i18n: {
      en: {
        ...designSystemShipsItselfI18n.en,
        lexical: designSystemParsed_en.lexical,
        blocks: designSystemParsed_en.blocks,
      },
      es: {
        ...designSystemShipsItselfI18n.es,
        lexical: designSystemParsed_es.lexical,
        blocks: designSystemParsed_es.blocks,
      },
    },
  },
  {
    ...atomWebflowMeta,
    title: atomWebflowI18n.en.title,
    summary: atomWebflowI18n.en.summary,
    description: atomWebflowParsed_en.lexical,
    blocks: atomWebflowParsed_en.blocks,
    i18n: {
      en: { ...atomWebflowI18n.en, lexical: atomWebflowParsed_en.lexical, blocks: atomWebflowParsed_en.blocks },
      es: { ...atomWebflowI18n.es, lexical: atomWebflowParsed_es.lexical, blocks: atomWebflowParsed_es.blocks },
    },
  },
  withPlaceholderI18n({
    id: '1', title: 'Token-First Design at Scale', slug: 'token-first-design-at-scale', status: 'published',
    category: 'design_system', role: 'Lead Designer & Engineer', year: '2025', featured: true,
    summary: 'A token-first design system powering consistent UI across web and mobile products.',
    description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Prism is a comprehensive design system built with a token-first approach. It includes a component library, documentation site, and Figma plugin for seamless designer-developer handoff. The system serves 4 product teams and has reduced UI inconsistencies by 80%.', format: 0, direction: null, indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
    tags: [{ tag: 'React' }, { tag: 'Tokens' }, { tag: 'Figma' }, { tag: 'Storybook' }],
    coverImage: { url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e49a704afe5e3f4a55d_Fluid%20Abstract%20Design.avif', alt: 'Prism' },
    liveUrl: 'https://example.com', repoUrl: 'https://github.com/example',
    services: 'Development',
    createdAt: '2025-01-01', updatedAt: '2025-01-01',
  }),
  withPlaceholderI18n({
    id: '2', title: 'Real-Time Product Intelligence with AI', slug: 'real-time-product-intelligence-with-ai', status: 'published',
    category: 'web', role: 'Frontend Engineer', year: '2025', featured: true,
    summary: 'AI-powered analytics dashboard for product teams to understand user behavior in real-time.',
    description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Oracle is a real-time analytics platform that uses AI to surface actionable insights from user behavior data. Built with Next.js and Supabase, it processes millions of events daily and presents them through an intuitive dashboard designed for product managers and engineers.', format: 0, direction: null, indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
    tags: [{ tag: 'Next.js' }, { tag: 'AI' }, { tag: 'Supabase' }],
    coverImage: { url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2ea2b1de5d693cf173_Elegant%20Ice%20Bottle%20Display.avif', alt: 'Oracle' },
    liveUrl: 'https://example.com', repoUrl: '',
    services: 'Design, Development',
    createdAt: '2025-01-01', updatedAt: '2025-01-01',
  }),
  withPlaceholderI18n({
    id: '3', title: 'Component Libraries That Ship', slug: 'component-libraries-that-ship', status: 'published',
    category: 'web', role: 'Engineer', year: '2024', featured: false,
    summary: 'Component library and npm package for distributed product teams building with React.',
    description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Mosaic is an open-source React component library distributed as an npm package. It implements the ATOM design language with full TypeScript support, tree-shaking, and accessibility baked in. Used by 3 product teams across different time zones.', format: 0, direction: null, indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
    tags: [{ tag: 'React' }, { tag: 'npm' }, { tag: 'TypeScript' }],
    coverImage: { url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2e3a3b6987bbb92dfd_Serene%20Floral%20Arrangement.avif', alt: 'Mosaic' },
    liveUrl: '', repoUrl: 'https://github.com/example',
    services: 'Development',
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  }),
  withPlaceholderI18n({
    id: '4', title: 'AI Agents for Non-Technical Teams', slug: 'ai-agents-for-non-technical-teams', status: 'published',
    category: 'web', role: 'Designer & Engineer', year: '2024', featured: true,
    summary: 'MCP server integrations and AI agent tools that enable non-technical teams to automate workflows.',
    description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Zenith is a suite of MCP server integrations that connect AI agents with business tools. Built with TypeScript and deployed on edge functions, it enables product and marketing teams to automate repetitive workflows without writing code.', format: 0, direction: null, indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
    tags: [{ tag: 'MCP' }, { tag: 'AI' }, { tag: 'Edge Functions' }],
    coverImage: { url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e349d92acc75bd79fa8_Minimalist%20Green%20Stools.avif', alt: 'Zenith' },
    liveUrl: 'https://example.com', repoUrl: 'https://github.com/example',
    services: 'Strategy, Design',
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  }),
  withPlaceholderI18n({
    id: '5', title: 'Automating Operations with LLMs', slug: 'automating-operations-with-llms', status: 'published',
    category: 'web', role: 'Engineer', year: '2024', featured: false,
    summary: 'Automation platform connecting LLMs with internal tools for product operations teams.',
    description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Nebula connects large language models with internal business tools through a clean API layer. Product operations teams use it to automate data entry, generate reports, and triage support tickets, reducing manual work by 60%.', format: 0, direction: null, indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
    tags: [{ tag: 'AI' }, { tag: 'Automation' }, { tag: 'APIs' }],
    coverImage: { url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e49a704afe5e3f4a55d_Fluid%20Abstract%20Design.avif', alt: 'Nebula' },
    liveUrl: '', repoUrl: 'https://github.com/example',
    services: 'AI, Development',
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  }),
]

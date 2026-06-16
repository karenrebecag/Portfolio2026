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
import {
  decoupledOwnershipPlatformsMeta,
  decoupledOwnershipPlatformsI18n,
  decoupledOwnershipPlatformsMarkdown_en,
  decoupledOwnershipPlatformsMarkdown_es,
} from '@/content/projects/decoupled-ownership-platforms'
import {
  aurinTaskManagerMeta,
  aurinTaskManagerI18n,
  aurinTaskManagerMarkdown_en,
  aurinTaskManagerMarkdown_es,
} from '@/content/projects/aurin-task-manager'
import {
  portfolioFrontendDesignCodeMeta,
  portfolioFrontendDesignCodeI18n,
  portfolioFrontendDesignCodeMarkdown_en,
  portfolioFrontendDesignCodeMarkdown_es,
} from '@/content/projects/portfolio-frontend-design-code'
import {
  monexOneMobileBankingMeta,
  monexOneMobileBankingI18n,
  monexOneMobileBankingMarkdown_en,
  monexOneMobileBankingMarkdown_es,
} from '@/content/projects/monex-one-mobile-banking'
import {
  mariaLuisaDeMateoJamstackMeta,
  mariaLuisaDeMateoJamstackI18n,
  mariaLuisaDeMateoJamstackMarkdown_en,
  mariaLuisaDeMateoJamstackMarkdown_es,
} from '@/content/projects/maria-luisa-de-mateo-jamstack'
import {
  salesforceAtfxMcpMeta,
  salesforceAtfxMcpI18n,
  salesforceAtfxMcpMarkdown_en,
  salesforceAtfxMcpMarkdown_es,
} from '@/content/projects/salesforce-atfx-mcp'
import { parseMarkdown } from '@/lib/markdown-to-lexical'
import type { Project } from '@karen-portfolio/shared'
import type { Block } from '@/components/blocks/types'

type PlaceholderProject = Project & {
  services?: string
  blocks?: Block[]
  articleSlug?: string
  canonicalRoute?: 'article' | 'project'
  i18n?: Record<string, { title: string; summary: string; role?: string; services?: string; lexical?: unknown; blocks?: Block[] }>
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
  { src: '/stickers/webflowsticker.webp', alt: 'Webflow' },
  { src: '/stickers/cloudflaresticker.webp', alt: 'Cloudflare' },
] as const

const atomWebflowParsed_en = parseMarkdown(atomWebflowMarkdown_en)
const atomWebflowParsed_es = parseMarkdown(atomWebflowMarkdown_es)
const aurinChatbotParsed_en = parseMarkdown(aurinChatbotThreeLayerMarkdown_en)
const aurinChatbotParsed_es = parseMarkdown(aurinChatbotThreeLayerMarkdown_es)
const contextDrivenVibecodingParsed_en = parseMarkdown(contextDrivenVibecodingMarkdown_en)
const contextDrivenVibecodingParsed_es = parseMarkdown(contextDrivenVibecodingMarkdown_es)
const designSystemParsed_en = parseMarkdown(designSystemShipsItselfMarkdown_en)
const designSystemParsed_es = parseMarkdown(designSystemShipsItselfMarkdown_es)
const decoupledOwnershipParsed_en = parseMarkdown(decoupledOwnershipPlatformsMarkdown_en)
const decoupledOwnershipParsed_es = parseMarkdown(decoupledOwnershipPlatformsMarkdown_es)
const aurinTaskManagerParsed_en = parseMarkdown(aurinTaskManagerMarkdown_en)
const aurinTaskManagerParsed_es = parseMarkdown(aurinTaskManagerMarkdown_es)
const portfolioFrontendParsed_en = parseMarkdown(portfolioFrontendDesignCodeMarkdown_en)
const portfolioFrontendParsed_es = parseMarkdown(portfolioFrontendDesignCodeMarkdown_es)
const monexOneParsed_en = parseMarkdown(monexOneMobileBankingMarkdown_en)
const monexOneParsed_es = parseMarkdown(monexOneMobileBankingMarkdown_es)
const mariaLuisaParsed_en = parseMarkdown(mariaLuisaDeMateoJamstackMarkdown_en)
const mariaLuisaParsed_es = parseMarkdown(mariaLuisaDeMateoJamstackMarkdown_es)
const salesforceAtfxMcpParsed_en = parseMarkdown(salesforceAtfxMcpMarkdown_en)
const salesforceAtfxMcpParsed_es = parseMarkdown(salesforceAtfxMcpMarkdown_es)

export const PLACEHOLDER_PROJECTS: PlaceholderProject[] = [
  // Long-form articles first (home links to /articulos/…)
  {
    ...salesforceAtfxMcpMeta,
    title: salesforceAtfxMcpI18n.en.title,
    summary: salesforceAtfxMcpI18n.en.summary,
    description: salesforceAtfxMcpParsed_en.lexical,
    blocks: salesforceAtfxMcpParsed_en.blocks,
    i18n: {
      en: {
        ...salesforceAtfxMcpI18n.en,
        lexical: salesforceAtfxMcpParsed_en.lexical,
        blocks: salesforceAtfxMcpParsed_en.blocks,
      },
      es: {
        ...salesforceAtfxMcpI18n.es,
        lexical: salesforceAtfxMcpParsed_es.lexical,
        blocks: salesforceAtfxMcpParsed_es.blocks,
      },
    },
  },
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
  {
    ...portfolioFrontendDesignCodeMeta,
    title: portfolioFrontendDesignCodeI18n.en.title,
    summary: portfolioFrontendDesignCodeI18n.en.summary,
    description: portfolioFrontendParsed_en.lexical,
    blocks: portfolioFrontendParsed_en.blocks,
    i18n: {
      en: {
        ...portfolioFrontendDesignCodeI18n.en,
        lexical: portfolioFrontendParsed_en.lexical,
        blocks: portfolioFrontendParsed_en.blocks,
      },
      es: {
        ...portfolioFrontendDesignCodeI18n.es,
        lexical: portfolioFrontendParsed_es.lexical,
        blocks: portfolioFrontendParsed_es.blocks,
      },
    },
  },
  {
    ...decoupledOwnershipPlatformsMeta,
    title: decoupledOwnershipPlatformsI18n.en.title,
    summary: decoupledOwnershipPlatformsI18n.en.summary,
    description: decoupledOwnershipParsed_en.lexical,
    blocks: decoupledOwnershipParsed_en.blocks,
    i18n: {
      en: {
        ...decoupledOwnershipPlatformsI18n.en,
        lexical: decoupledOwnershipParsed_en.lexical,
        blocks: decoupledOwnershipParsed_en.blocks,
      },
      es: {
        ...decoupledOwnershipPlatformsI18n.es,
        lexical: decoupledOwnershipParsed_es.lexical,
        blocks: decoupledOwnershipParsed_es.blocks,
      },
    },
  },
  {
    ...monexOneMobileBankingMeta,
    title: monexOneMobileBankingI18n.en.title,
    summary: monexOneMobileBankingI18n.en.summary,
    description: monexOneParsed_en.lexical,
    blocks: monexOneParsed_en.blocks,
    i18n: {
      en: {
        ...monexOneMobileBankingI18n.en,
        lexical: monexOneParsed_en.lexical,
        blocks: monexOneParsed_en.blocks,
      },
      es: {
        ...monexOneMobileBankingI18n.es,
        lexical: monexOneParsed_es.lexical,
        blocks: monexOneParsed_es.blocks,
      },
    },
  },
  {
    ...aurinTaskManagerMeta,
    title: aurinTaskManagerI18n.en.title,
    summary: aurinTaskManagerI18n.en.summary,
    description: aurinTaskManagerParsed_en.lexical,
    blocks: aurinTaskManagerParsed_en.blocks,
    i18n: {
      en: {
        ...aurinTaskManagerI18n.en,
        role: aurinTaskManagerMeta.role,
        services: aurinTaskManagerMeta.services,
        lexical: aurinTaskManagerParsed_en.lexical,
        blocks: aurinTaskManagerParsed_en.blocks,
      },
      es: {
        ...aurinTaskManagerI18n.es,
        role: aurinTaskManagerMeta.role,
        services: aurinTaskManagerMeta.services,
        lexical: aurinTaskManagerParsed_es.lexical,
        blocks: aurinTaskManagerParsed_es.blocks,
      },
    },
  },
  {
    ...mariaLuisaDeMateoJamstackMeta,
    title: mariaLuisaDeMateoJamstackI18n.en.title,
    summary: mariaLuisaDeMateoJamstackI18n.en.summary,
    description: mariaLuisaParsed_en.lexical,
    blocks: mariaLuisaParsed_en.blocks,
    i18n: {
      en: {
        ...mariaLuisaDeMateoJamstackI18n.en,
        lexical: mariaLuisaParsed_en.lexical,
        blocks: mariaLuisaParsed_en.blocks,
      },
      es: {
        ...mariaLuisaDeMateoJamstackI18n.es,
        lexical: mariaLuisaParsed_es.lexical,
        blocks: mariaLuisaParsed_es.blocks,
      },
    },
  },
]

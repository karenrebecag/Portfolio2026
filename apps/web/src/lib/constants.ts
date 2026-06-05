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
const decoupledOwnershipParsed_en = parseMarkdown(decoupledOwnershipPlatformsMarkdown_en)
const decoupledOwnershipParsed_es = parseMarkdown(decoupledOwnershipPlatformsMarkdown_es)
const aurinTaskManagerParsed_en = parseMarkdown(aurinTaskManagerMarkdown_en)
const aurinTaskManagerParsed_es = parseMarkdown(aurinTaskManagerMarkdown_es)
const portfolioFrontendParsed_en = parseMarkdown(portfolioFrontendDesignCodeMarkdown_en)
const portfolioFrontendParsed_es = parseMarkdown(portfolioFrontendDesignCodeMarkdown_es)

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
  withPlaceholderI18n({
    id: '1',
    title: 'Monex One | Mobile Banking UX/UI for Mexico',
    slug: 'monex-one-mobile-banking',
    status: 'published',
    category: 'mobile',
    role: 'UX/UI Designer',
    year: '2024',
    featured: true,
    summary:
      'Eight months embedded with Aurin and Ancient Global designing Monex One—the mobile banking app for Monex’s Mexico division. Shipped on the App Store within a year.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Monex One is the mobile banking experience for Monex’s Mexico division. Over eight months I worked alongside the Aurin team and Ancient Global—mapping flows, defining UI patterns, and shipping a complete mobile product from research through high-fidelity screens and handoff. A year after the engagement, the app is live on the App Store.',
                format: 0,
                direction: null,
                indent: 0,
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
    tags: [{ tag: 'UX/UI' }, { tag: 'Figma' }, { tag: 'iOS' }, { tag: 'Mobile Banking' }],
    coverImage: {
      url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2ea2b1de5d693cf173_Elegant%20Ice%20Bottle%20Display.avif',
      alt: 'Monex One mobile banking',
    },
    liveUrl: 'https://www.monex.com.mx/portal/monexone',
    repoUrl: '',
    services: 'UX/UI Design, Mobile Product',
    createdAt: '2024-03-01',
    updatedAt: '2025-06-01',
  }),
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
  withPlaceholderI18n({
    id: '3',
    title: 'María Luisa de Mateo | Artsy & Instagram as the CMS',
    slug: 'maria-luisa-de-mateo-jamstack',
    status: 'published',
    category: 'web',
    role: 'UX Engineer & Product Designer',
    year: '2025',
    featured: true,
    summary:
      'Most artist sites ship with a CMS the creator never opens. This one pulls live inventory from Artsy and Instagram—47 works on R2, bilingual Next.js, GSAP galleries—so María Luisa keeps selling where she already sells.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'María Luisa de Mateo sells on Artsy and shows on Instagram. She did not need another admin panel—she needed a site that reads those channels and still feels like a gallery. I shipped a lean JAMstack build on Next.js: 47 portfolio pieces on Cloudflare R2, live availability from Artsy’s GraphQL API, an Instagram strip with static fallback when the feed fails, bilingual routing, and GSAP motion that stays out of the work’s way. Small codebase, deliberate architecture—power without asking the artist to become a publisher.',
                format: 0,
                direction: null,
                indent: 0,
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
    tags: [
      { tag: 'Next.js' },
      { tag: 'JAMstack' },
      { tag: 'GSAP' },
      { tag: 'Artsy' },
      { tag: 'R2' },
      { tag: 'next-intl' },
    ],
    coverImage: {
      url: 'https://cdn.prod.website-files.com/6889f182607452ec007a0ae1/688a1e2e3a3b6987bbb92dfd_Serene%20Floral%20Arrangement.avif',
      alt: 'María Luisa de Mateo artist portfolio',
    },
    liveUrl: 'https://marialuisademateo.com',
    repoUrl: 'https://github.com/karenrebecag/MariaLuisadeMateo',
    services: 'UX Engineering, Product Design, JAMstack',
    createdAt: '2025-06-01',
    updatedAt: '2026-06-01',
  }),
]

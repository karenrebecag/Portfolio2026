import type { Metadata } from 'next'
import { SITE_AUTHOR, SITE_KEYWORDS, SITE_OG_IMAGE } from '@/lib/seo/site-config'

/** Non-standard meta tags that signal LLM-friendly, machine-readable intent (from Astro portfolio). */
export function llmDiscoveryMeta(): Metadata['other'] {
  return {
    'AI-optimized': 'true',
    'LLM-friendly': 'structured-content, semantic-markup, comprehensive-data',
    'content-type': 'portfolio, product-engineering, web-development, ai-integration',
    expertise:
      'Product Engineering, UX/UI, Frontend, Full-Stack, Design Systems, MCP, LLM Automation, Next.js, Astro',
    availability: 'freelance, full-time, consulting',
    location: 'Mexico, Remote, LATAM, US, Europe',
  }
}

export function baseSiteKeywords(): string[] {
  return [...SITE_KEYWORDS]
}

export function twitterCreator(): string {
  return SITE_AUTHOR.twitter
}

export type OgImageDescriptor = { url: string; width?: number; height?: number; alt: string }

export function defaultOgImages(alt?: string): OgImageDescriptor[] {
  return [
    {
      url: SITE_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: alt ?? `${SITE_AUTHOR.name} — Product Engineer, Web & AI`,
    },
  ]
}

export function articleOgImages(imageUrl: string, alt: string): OgImageDescriptor[] {
  return [{ url: imageUrl, alt }]
}
import { SITE_URL, localizedPath, ogLocale } from '@/lib/seo'
import {
  SITE_AUTHOR,
  SITE_FAQ,
  SITE_OG_IMAGE,
  SITE_SOCIAL,
  type FaqPair,
} from '@/lib/seo/site-config'

type JsonLd = Record<string, unknown>

function absoluteUrl(locale: string, path: string) {
  return `${SITE_URL}${localizedPath(locale, path)}`
}

export function buildPersonNode(locale: string, description: string): JsonLd {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_AUTHOR.name,
    alternateName: SITE_AUTHOR.alternateName,
    url: SITE_URL,
    email: SITE_AUTHOR.email,
    jobTitle: 'Product Engineer',
    description,
    image: SITE_OG_IMAGE,
    knowsAbout: [
      'Product Engineering',
      'Web Development',
      'Frontend Engineering',
      'Full-Stack Development',
      'AI Integration',
      'AI Agents',
      'MCP',
      'Design Systems',
      'Next.js',
      'Astro',
      'TypeScript',
      'GSAP',
    ],
    sameAs: [SITE_SOCIAL.github, SITE_SOCIAL.linkedin, SITE_SOCIAL.instagram],
    worksFor: {
      '@type': 'Organization',
      name: 'Karen Rebeca Ortiz — Product Engineering',
      url: SITE_URL,
    },
  }
}

export function buildOrganizationNode(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Karen Rebeca Ortiz',
    alternateName: 'Karen Ortiz',
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    description:
      'Product engineering studio: AI-powered web products, design systems, and full-stack delivery for global teams.',
    founder: { '@id': `${SITE_URL}/#person` },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Product Engineering',
      'UX/UI Design',
      'React',
      'Next.js',
      'AI Integration',
      'Design Systems',
    ],
  }
}

export function buildCreativeWorkNode(locale: string, description: string): JsonLd {
  return {
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/#portfolio`,
    name: 'Karen Rebeca Ortiz — Portfolio',
    description,
    url: absoluteUrl(locale, '/'),
    author: { '@id': `${SITE_URL}/#person` },
    inLanguage: locale === 'es' ? 'es-MX' : 'en-US',
    genre: 'Portfolio',
    keywords: 'Product Engineering, AI, Web Development, Design Systems',
    dateModified: new Date().toISOString().split('T')[0],
  }
}

export function buildWebSiteNode(locale: string): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Karen Rebeca Ortiz',
    alternateName: 'Karen Ortiz Portfolio',
    url: SITE_URL,
    inLanguage: [ogLocale('es'), ogLocale('en')],
    isAccessibleForFree: true,
    publisher: { '@id': `${SITE_URL}/#person` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildFaqPageSchema(faqs: FaqPair[]): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function getHomePageSchema(locale: string, personDescription: string): JsonLd {
  const faqs = SITE_FAQ[locale === 'es' ? 'es' : 'en']
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildPersonNode(locale, personDescription),
      buildOrganizationNode(),
      buildCreativeWorkNode(locale, personDescription),
      buildWebSiteNode(locale),
      buildFaqPageSchema(faqs),
    ],
  }
}

export function getSpeakableWebPageSchema(selectors: readonly string[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [...selectors],
    },
  }
}

export function getAboutPageSchema(locale: string, description: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': absoluteUrl(locale, '/about'),
        url: absoluteUrl(locale, '/about'),
        name: locale === 'es' ? 'Sobre Karen Rebeca Ortiz' : 'About Karen Rebeca Ortiz',
        description,
        inLanguage: locale === 'es' ? 'es-MX' : 'en-US',
        mainEntity: buildPersonNode(locale, description),
      },
      buildPersonNode(locale, description),
    ],
  }
}

export type ArticleSchemaInput = {
  locale: string
  slug: string
  /** Logical path without locale prefix, e.g. `/articulos/foo` or `/projects/foo`. */
  path?: string
  title: string
  description: string
  imageUrl?: string
  datePublished?: string
  dateModified?: string
  tags?: string[]
}

export function getArticleSchema(input: ArticleSchemaInput): JsonLd {
  const path = input.path ?? `/articulos/${input.slug}`
  const url = absoluteUrl(input.locale, path)
  const image = input.imageUrl ?? SITE_OG_IMAGE

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image,
    datePublished: input.datePublished ?? input.dateModified,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_URL,
    },
    inLanguage: input.locale === 'es' ? 'es-MX' : 'en-US',
    keywords: input.tags?.join(', '),
    articleSection: 'Case Study',
  }
}

export function getArticleBreadcrumbSchema(
  locale: string,
  slug: string,
  title: string,
): JsonLd {
  const homeLabel = locale === 'es' ? 'Inicio' : 'Home'
  const articlesLabel = locale === 'es' ? 'Artículos' : 'Articles'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: absoluteUrl(locale, '/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: articlesLabel,
        item: absoluteUrl(locale, '/#projects'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: absoluteUrl(locale, `/articulos/${slug}`),
      },
    ],
  }
}

export function getProjectBreadcrumbSchema(
  locale: string,
  slug: string,
  title: string,
): JsonLd {
  const homeLabel = locale === 'es' ? 'Inicio' : 'Home'
  const projectsLabel = locale === 'es' ? 'Proyectos' : 'Projects'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: absoluteUrl(locale, '/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: projectsLabel,
        item: absoluteUrl(locale, '/#projects'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: absoluteUrl(locale, `/projects/${slug}`),
      },
    ],
  }
}
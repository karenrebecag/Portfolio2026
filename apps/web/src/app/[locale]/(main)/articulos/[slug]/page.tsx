import { notFound } from 'next/navigation'
import { redirect } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { ArticleCaseStudyPage } from '@/components/article-case-study-page'
import { JsonLdScript } from '@/components/seo/json-ld'
import {
  getAllArticleSlugs,
  getArticleProjectByArticleSlug,
  getClientWorkRedirectForArticleSlug,
} from '@/lib/article-projects'
import { buildAlternates, localizedPath, ogLocale } from '@/lib/seo'
import { articleOgImages, defaultOgImages } from '@/lib/seo/metadata-helpers'
import {
  getArticleBreadcrumbSchema,
  getArticleSchema,
} from '@/lib/seo/structured-data'
import { SITE_AUTHOR } from '@/lib/seo/site-config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}

// Sin esto, cualquier slug inventado se renderiza on-demand y escribe una
// entrada nueva al cache ISR — superficie de costo abierta a crawlers.
// El slug legacy que antes redirigía desde aquí ahora vive en next.config.ts.
export const dynamicParams = false

function truncateDescription(text: string, max = 155): string {
  if (text.length <= max) return text
  const cut = text.lastIndexOf(' ', max)
  return text.slice(0, cut > 0 ? cut : max) + '…'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getArticleProjectByArticleSlug(slug)
  if (!project) return { title: 'Not found' }
  const localized = project.i18n?.[locale]
  const title = localized?.title ?? project.title
  const rawDescription =
    (localized as { description?: string } | undefined)?.description ??
    localized?.summary ??
    project.summary
  const description = truncateDescription(rawDescription)
  const path = `/articulos/${slug}`
  const coverUrl = project.coverImage?.url
  const ogImages = coverUrl
    ? articleOgImages(coverUrl, project.coverImage?.alt ?? title)
    : defaultOgImages(title)
  const published = project.createdAt
  const modified = project.updatedAt ?? project.createdAt
  const tagKeywords = project.tags?.map((t) => t.tag) ?? []

  return {
    title,
    description,
    keywords: tagKeywords.length > 0 ? tagKeywords : undefined,
    authors: [{ name: SITE_AUTHOR.name }],
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: 'article',
      locale: ogLocale(locale),
      url: localizedPath(locale, path),
      title,
      description,
      images: ogImages,
      publishedTime: published,
      modifiedTime: modified,
      authors: [SITE_AUTHOR.name],
      section: 'Case Study',
      tags: tagKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((img) => img.url as string),
    },
  }
}

export default async function ArticleBySlugPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getArticleProjectByArticleSlug(slug)
  if (!project) {
    const moved = getClientWorkRedirectForArticleSlug(slug)
    if (moved) redirect({ href: moved, locale })
    notFound()
  }

  const localized = project.i18n?.[locale]
  const title = localized?.title ?? project.title
  const description =
    (localized as { description?: string } | undefined)?.description ??
    localized?.summary ??
    project.summary

  const jsonLd = [
    getArticleSchema({
      locale,
      slug,
      title,
      description,
      imageUrl: project.coverImage?.url,
      datePublished: project.createdAt,
      dateModified: project.updatedAt ?? project.createdAt,
      tags: project.tags?.map((t) => t.tag),
    }),
    getArticleBreadcrumbSchema(locale, slug, title),
  ]

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ArticleCaseStudyPage locale={locale} articleSlug={slug} />
    </>
  )
}
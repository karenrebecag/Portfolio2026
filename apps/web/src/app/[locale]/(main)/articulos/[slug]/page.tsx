import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { ArticleCaseStudyPage } from '@/components/article-case-study-page'
import { JsonLdScript } from '@/components/seo/json-ld'
import { getAllArticleSlugs, getArticleProjectByArticleSlug } from '@/lib/article-projects'
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getArticleProjectByArticleSlug(slug)
  if (!project) return { title: 'Not found' }
  const localized = project.i18n?.[locale]
  const title = localized?.title ?? project.title
  const description = localized?.summary ?? project.summary
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
  if (!project) notFound()

  const localized = project.i18n?.[locale]
  const title = localized?.title ?? project.title
  const description = localized?.summary ?? project.summary

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
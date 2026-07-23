import { notFound } from 'next/navigation'
import { Link, redirect } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getLocalizedProject } from '@/lib/project-i18n'
import { CaseStudyPage } from '@/components/article-case-study-page'
import { JsonLdScript } from '@/components/seo/json-ld'
import { getArticleSlugForProject } from '@/lib/article-projects'
import { buildAlternates, localizedPath, ogLocale } from '@/lib/seo'
import { articleOgImages, defaultOgImages } from '@/lib/seo/metadata-helpers'
import {
  getArticleSchema,
  getProjectBreadcrumbSchema,
} from '@/lib/seo/structured-data'
import { SITE_AUTHOR } from '@/lib/seo/site-config'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

function findProject(slug: string) {
  return PLACEHOLDER_PROJECTS.find((p) => p.slug === slug) || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const articleSlug = getArticleSlugForProject(slug)
  if (articleSlug) {
    const project = findProject(slug)
    if (!project) return { title: 'Not found' }
    const localized = project.i18n?.[locale]
    const title = localized?.title ?? project.title
    const description = localized?.summary ?? project.summary
    const path = `/articulos/${articleSlug}`
    const coverUrl = project.coverImage?.url
    const ogImages = coverUrl
      ? articleOgImages(coverUrl, project.coverImage?.alt ?? title)
      : defaultOgImages(title)

    return {
      title,
      description,
      alternates: buildAlternates(locale, path),
    }
  }

  const project = findProject(slug)
  if (!project) return { title: 'Not found' }
  const localized = project.i18n?.[locale]
  const title = localized?.title || project.title
  const description = localized?.summary || project.summary
  const path = `/projects/${slug}`
  const coverUrl = project.coverImage?.url
  const ogImages = coverUrl
    ? articleOgImages(coverUrl, project.coverImage?.alt ?? title)
    : defaultOgImages(title)

  const tagKeywords = project.tags?.map((t) => t.tag) ?? []
  const published = project.createdAt
  const modified = project.updatedAt ?? project.createdAt

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
      section: 'Client Work',
      tags: tagKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
  }
}

export async function generateStaticParams() {
  return PLACEHOLDER_PROJECTS.map((p) => ({ slug: p.slug }))
}

// Sin esto, cualquier slug inventado se renderiza on-demand y escribe una
// entrada nueva al cache ISR — superficie de costo abierta a crawlers.
export const dynamicParams = false

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)

  const articleSlug = getArticleSlugForProject(slug)
  if (articleSlug) {
    redirect({ href: `/articulos/${articleSlug}`, locale })
  }

  const found = findProject(slug)
  const t = await getTranslations('project_detail')

  if (!found) notFound()

  const project = getLocalizedProject(found, locale)

  if (project.status === 'archived') {
    return (
      <div className="px-4 lg:px-6 py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">{t('archived_title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('archived_text')}</p>
        <Link href="/projects" className="mt-6 inline-block text-sm underline underline-offset-4">{t('view_projects')}</Link>
      </div>
    )
  }

  const localized = project.i18n?.[locale]
  const title = localized?.title || project.title
  const summary = localized?.summary || project.summary

  const jsonLd = [
    getArticleSchema({
      locale,
      slug,
      path: `/projects/${slug}`,
      title,
      description: summary,
      imageUrl: project.coverImage?.url,
      datePublished: found.createdAt,
      dateModified: found.updatedAt ?? found.createdAt,
      tags: project.tags?.map((tag) => tag.tag),
    }),
    getProjectBreadcrumbSchema(locale, slug, title),
  ]

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CaseStudyPage locale={locale} projectSlug={slug} variant="client-work" />
    </>
  )
}
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { ArticleCaseStudyPage } from '@/components/article-case-study-page'
import { getAllArticleSlugs, getArticleProjectByArticleSlug } from '@/lib/article-projects'
import { buildAlternates, localizedPath, ogLocale } from '@/lib/seo'

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

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: 'article',
      locale: ogLocale(locale),
      url: localizedPath(locale, path),
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ArticleBySlugPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getArticleProjectByArticleSlug(slug)
  if (!project) notFound()

  return <ArticleCaseStudyPage locale={locale} articleSlug={slug} />
}
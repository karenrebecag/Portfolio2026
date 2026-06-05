import { notFound } from 'next/navigation'
import { Link, redirect } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getLocalizedProject } from '@/lib/project-i18n'
import { RichTextRenderer } from '@/components/rich-text-renderer'
import { ScrollHighlight } from '@/components/scroll-highlight'
import { ArticleTOC } from '@/components/article-toc'
import { Button061 } from '@/components/ui/button-061'
import { ContactSection } from '@/components/contact-section'
import { SocialShare } from '@/components/social-share'
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
  const heroDescription = (project as { description?: string }).description ?? summary
  const description = localized?.lexical || project.description
  const blocks = localized?.blocks || (found as { blocks?: unknown[] }).blocks

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
    <section
      data-theme-section="light"
      data-semantic-role="portfolio"
      data-llm-context="client-work-case-study"
      className="pt-32 pb-16"
    >
      <ArticleTOC
        title={t('toc_title')}
        offset={80}
        readTimeLabel={t('read_time')}
        readTimeUnit={t('read_time_unit')}
      >
        <header className="mb-10">
          <Button061 href="/#projects" arrow="left">
            {t('back')}
          </Button061>

          <h1 className="mt-10 text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-[1.05]">{title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="capitalize">{project.category.replace('_', ' ')}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{project.role}</span>
            {project.year && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{project.year}</span>
              </>
            )}
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="mt-5 flex gap-2 flex-wrap">
              {project.tags.map((tag) => (
                <span key={tag.tag} className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground font-accent uppercase tracking-wide">{tag.tag}</span>
              ))}
            </div>
          )}

          {heroDescription && (
            <p className="mt-8 text-base md:text-lg leading-relaxed text-foreground/80 w-full max-w-none">
              {heroDescription}
            </p>
          )}

          <div className="mt-8 h-px w-full bg-border" />

          <div className="mt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('case_study')}</span>
          </div>
        </header>

        <ScrollHighlight>
          <div className="prose">
            <RichTextRenderer content={description as any} blocks={blocks as any} />
          </div>

          {(project.liveUrl || project.repoUrl) && (
            <div className="mt-12 flex gap-4">
              {project.liveUrl && (
                <Button061 href={project.liveUrl} target="_blank" rel="noopener noreferrer">{t('live')}</Button061>
              )}
              {project.repoUrl && (
                <Button061 href={project.repoUrl} target="_blank" rel="noopener noreferrer" variant="secondary">{t('repo')}</Button061>
              )}
            </div>
          )}
        </ScrollHighlight>

        <SocialShare
          className="article-share"
          heading={t('share_heading')}
          title={`${title} | Karen Ortiz`}
        />
      </ArticleTOC>
    </section>

    <ContactSection />
    </>
  )
}
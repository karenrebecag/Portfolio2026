import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { Pill } from '@/components/ui/pill'
import { Button061 } from '@/components/ui/button-061'
import { ArticleTOC } from '@/components/article-toc'
import { RichTextRenderer } from '@/components/rich-text-renderer'
import { ScrollHighlight } from '@/components/scroll-highlight'
import { SocialShare } from '@/components/social-share'
import { ContactSection } from '@/components/contact-section'
import { getArticleMetaForProject, getArticleProjectByArticleSlug } from '@/lib/article-projects'
import { getLocalizedProject } from '@/lib/project-i18n'

type ArticleCaseStudyPageProps = {
  locale: string
  articleSlug: string
}

export async function ArticleCaseStudyPage({ locale, articleSlug }: ArticleCaseStudyPageProps) {
  const found = getArticleProjectByArticleSlug(articleSlug)
  if (!found) return null

  const project = getLocalizedProject(found, locale)
  const articleMeta = getArticleMetaForProject(found)
  const localized = project.i18n?.[locale]
  const title = localized?.title ?? project.title
  const summary = localized?.summary ?? project.summary
  const heroDescription =
    (project as { description?: string }).description ?? summary
  const description = localized?.lexical ?? project.description
  const blocks = localized?.blocks ?? (found as { blocks?: unknown[] }).blocks
  const year = articleMeta?.year ?? (found as { year?: string }).year ?? '2026'

  const t = await getTranslations('project_detail')

  return (
    <>
    <article
      data-theme-section="light"
      data-semantic-role="article"
      data-llm-context="case-study-long-form"
      className="article-page"
    >
      <Container className="article-page__container px-4 lg:px-6">
        <header className="article-hero border-b border-border pb-10 pt-28 lg:pt-36">
          <Button061 href="/#projects" arrow="left">
            {t('back')}
          </Button061>

          <div className="mt-8">
            <Pill>Artículo • {year}</Pill>
          </div>

          <h1 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight max-w-[20ch]">
            {title.split(/\s*\|\s*|\s+[—–·]\s+/).filter(Boolean).map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {summary && heroDescription !== summary && (
            <p className="mt-6 text-sm md:text-base font-medium leading-relaxed text-foreground/70 w-full">
              {summary}
            </p>
          )}
          <p className="mt-4 text-base md:text-lg leading-relaxed text-foreground/80 w-full max-w-none">
            {heroDescription}
          </p>

          {project.tags && project.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
              {project.tags.map((tag) => (
                <li key={tag.tag}>
                  <span className="px-3 py-1.5 text-xs font-accent bg-secondary text-secondary-foreground uppercase tracking-wide">
                    {tag.tag}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {(project.liveUrl || project.repoUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && (
                <Button061 href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  {t('live')}
                </Button061>
              )}
              {project.repoUrl && (
                <Button061
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  {t('repo')}
                </Button061>
              )}
            </div>
          )}
        </header>

        <ArticleTOC
          title={t('toc_title')}
          levels="h2,h3"
          offset={88}
          readTimeLabel={t('read_time')}
          readTimeUnit={t('read_time_unit')}
        >
          <ScrollHighlight>
            <div className="article-prose">
              <RichTextRenderer content={description as never} blocks={blocks as never} />
            </div>
          </ScrollHighlight>

          <SocialShare
            className="article-share"
            heading={t('share_heading')}
            title={`${title} | Karen Ortiz`}
          />
        </ArticleTOC>
      </Container>
    </article>

    <ContactSection />
    </>
  )
}
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
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getLocalizedProject, getProjectBodyContent, getProjectHeroDescription } from '@/lib/project-i18n'

type CaseStudyPageVariant = 'article' | 'client-work'

type CaseStudyPageProps = {
  locale: string
  projectSlug: string
  variant?: CaseStudyPageVariant
}

export async function CaseStudyPage({
  locale,
  projectSlug,
  variant = 'article',
}: CaseStudyPageProps) {
  const found = PLACEHOLDER_PROJECTS.find((p) => p.slug === projectSlug)
  if (!found) return null

  const project = getLocalizedProject(found, locale)
  const articleMeta = getArticleMetaForProject(found)
  const localized = project.i18n?.[locale]
  const title = localized?.title ?? project.title
  const summary = localized?.summary ?? project.summary
  const heroDescription = getProjectHeroDescription(found, locale)
  const description = getProjectBodyContent(found, locale)
  const blocks = localized?.blocks ?? (found as { blocks?: unknown[] }).blocks
  const year = articleMeta?.year ?? (found as { year?: string }).year ?? '2026'

  const t = await getTranslations('project_detail')
  const pillLabel =
    variant === 'article' ? `Artículo • ${year}` : `${t('case_study')} • ${year}`

  return (
    <>
      <article
        data-theme-section="light"
        data-semantic-role={variant === 'article' ? 'article' : 'portfolio'}
        data-llm-context={
          variant === 'article' ? 'case-study-long-form' : 'client-work-case-study'
        }
        className="article-page"
      >
        <Container className="article-page__container px-4 lg:px-6">
          <header className="article-hero border-b border-border pb-10 pt-28 lg:pt-36">
            <Button061 href="/#projects" arrow="left">
              {t('back')}
            </Button061>

            <div className="mt-8">
              <Pill>{pillLabel}</Pill>
            </div>

            <h1 className="mt-6 w-full max-w-none text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight">
              {title.split(/\s*\|\s*|\s+[—–·]\s+/).filter(Boolean).map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {summary && heroDescription !== summary && (
              <p className="mt-6 w-full text-sm font-medium leading-relaxed text-foreground/70 md:text-base">
                {summary}
              </p>
            )}
            {heroDescription && (
              <p className="mt-4 w-full max-w-none text-base leading-relaxed text-foreground/80 md:text-lg">
                {heroDescription}
              </p>
            )}

            {project.tags && project.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
                {project.tags.map((tag) => (
                  <li key={tag.tag}>
                    <span className="px-3 py-1.5 font-accent text-xs uppercase tracking-wide bg-secondary text-secondary-foreground">
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

type ArticleCaseStudyPageProps = {
  locale: string
  articleSlug: string
}

/** Long-form layout for /articulos/[slug] — same shell as client-work case studies. */
export async function ArticleCaseStudyPage({ locale, articleSlug }: ArticleCaseStudyPageProps) {
  const found = getArticleProjectByArticleSlug(articleSlug)
  if (!found) return null

  return <CaseStudyPage locale={locale} projectSlug={found.slug} variant="article" />
}
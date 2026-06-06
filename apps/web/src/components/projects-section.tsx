'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getProjectOutcome } from '@/content/project-outcomes'
import { Pill } from '@/components/ui/pill'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'
import type { Project } from '@karen-portfolio/shared'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getProjectHref, isArticleProject } from '@/lib/article-projects'
import { AdditionalWorkMarquee } from '@/components/additional-work'

const MAX_ESSAYS = 6
const MAX_CLIENT = 4

function ProjectRows({
  projects,
  badge,
  emptyKey,
}: {
  projects: Project[]
  badge: string
  emptyKey: 'empty_essays' | 'empty_client'
}) {
  const t = useTranslations('projects')
  const locale = useLocale()

  if (projects.length === 0) {
    return <p className="text-muted-foreground py-6 text-sm">{t(emptyKey)}</p>
  }

  return (
    <div className="w-full">
      <div className="preview-list flex flex-col w-full relative max-[767px]:gap-y-8">
        {projects.map((project) => {
          const outcome = getProjectOutcome(project.slug, locale)
          const localized = (
            project as Project & {
              i18n?: Record<string, { description?: string; summary?: string }>
            }
          ).i18n?.[locale]
          const blurb =
            outcome ??
            (typeof localized?.description === 'string' ? localized.description : undefined) ??
            localized?.summary ??
            project.summary
          return (
          <div key={project.id} className="preview-item w-full transition-opacity duration-200">
            <Link
              href={getProjectHref(project.slug)}
              className="preview-item__inner border-t border-border w-full py-7 block no-underline text-inherit max-[767px]:border-none max-[767px]:flex max-[767px]:flex-col max-[767px]:p-0"
            >
              <div className="preview-item__row flex flex-wrap justify-start items-center w-full gap-y-2 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-1">
                <div className="flex-1 min-w-0 max-[767px]:flex-none max-[767px]:w-full">
                  <span className="inline-block mb-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-accent bg-secondary text-secondary-foreground">
                    {badge}
                  </span>
                  <h3 className="preview-item__heading font-display text-[2rem] font-bold leading-[1.02] max-[767px]:text-lg">
                    {project.title.split(/\s*\|\s*|\s+[—–·]\s+/).filter(Boolean).map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  {blurb && (
                    <p className="mt-3 w-full max-w-none text-sm leading-relaxed text-muted-foreground">
                      {blurb}
                    </p>
                  )}
                </div>
                <div className="md:hidden flex-none w-full">
                  <p className="text-sm font-normal leading-[1.2] text-muted-foreground break-words">
                    {project.year || '--'}
                  </p>
                </div>
                <div className="md:hidden flex-none w-full">
                  <p className="text-sm font-normal leading-[1.2] text-muted-foreground break-words">
                    {(project as Project & { services?: string }).services ||
                      project.role ||
                      project.category.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </Link>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('projects')
  const tAdditional = useTranslations('additional')
  const raw = projects.length > 0 ? projects : (PLACEHOLDER_PROJECTS as unknown as Project[])
  const published = raw.filter((p) => p.status === 'published')
  const essays = published.filter((p) => isArticleProject(p.slug)).slice(0, MAX_ESSAYS)
  const clientWork = published.filter((p) => !isArticleProject(p.slug)).slice(0, MAX_CLIENT)

  return (
    <section
      id="projects"
      data-semantic-role="portfolio"
      data-llm-context="work-examples-case-studies"
      data-theme-section="light"
      data-reveal-group
      className="px-4 lg:px-6 py-40 scroll-mt-20"
    >
      <Container>
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Pill>{t('pill')}</Pill>

              <h2
                data-split="heading"
                data-split-reveal="words"
                className="mt-6 text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] max-w-[18ch]"
              >
                {t('heading')}
              </h2>

              <div className="mt-6 mb-6 h-px w-full bg-border" />

              <p className="text-sm leading-relaxed text-foreground/80 max-w-[40ch]">{t('description')}</p>

              <div className="mt-8">
                <Button061 href="/projects">{t('view_all')}</Button061>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 min-w-0 space-y-14">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/40">
                {t('essays_heading')}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-[42ch]">
                {t('essays_description')}
              </p>
              <div className="mt-4">
                <ProjectRows projects={essays} badge={t('badge_essay')} emptyKey="empty_essays" />
              </div>
            </div>

            {clientWork.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/40">
                  {t('client_heading')}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-[42ch]">
                  {t('client_description')}
                </p>
                <div className="mt-4">
                  <ProjectRows projects={clientWork} badge={t('badge_case_study')} emptyKey="empty_client" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      <div className="mt-20 pb-10 hidden md:block">
        <Container className="px-4 lg:px-6 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">
            {tAdditional('pill')}
          </span>
        </Container>
        <AdditionalWorkMarquee />
      </div>
    </section>
  )
}
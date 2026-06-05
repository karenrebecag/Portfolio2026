'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Pill } from '@/components/ui/pill'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'
import type { Project } from '@karen-portfolio/shared'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getProjectHref, isArticleProject } from '@/lib/article-projects'
import { AdditionalWorkMarquee } from '@/components/additional-work'

const MAX_PROJECTS = 5

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('projects')
  const raw = projects.length > 0 ? projects : (PLACEHOLDER_PROJECTS as unknown as Project[])
  const sorted = [...raw].sort((a, b) => {
    const aArticle = isArticleProject(a.slug)
    const bArticle = isArticleProject(b.slug)
    if (aArticle && !bArticle) return -1
    if (!aArticle && bArticle) return 1
    return 0
  })
  const visible = sorted.slice(0, MAX_PROJECTS)

  return (
    <section id="projects" data-theme-section="light" data-reveal-group className="px-4 lg:px-6 py-40 scroll-mt-20">
      <Container>
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-10">
          {/* Left -- context */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Pill>{t('pill')}</Pill>

              <h2 data-split="heading" data-split-reveal="words" className="mt-6 text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] max-w-[18ch]">
                {t('heading')}
              </h2>

              <div className="mt-6 mb-6 h-px w-full bg-border" />

              <p className="text-sm leading-relaxed text-foreground/80 max-w-[40ch]">
                {t('description')}
              </p>

              <div className="mt-8">
                <Button061 href="/projects">{t('view_all')}</Button061>
              </div>
            </div>
          </div>

          {/* Right -- project list */}
          <div className="md:col-span-7 min-w-0">
            {/* Table header -- desktop only (year + services live on mobile only) */}
            <div className="hidden lg:flex flex-wrap items-center w-full mb-2">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">{t('col_project')}</span>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="text-muted-foreground py-10">{t('empty')}</p>
            ) : (
              <div className="w-full mt-2">
                <div className="preview-list flex flex-col w-full relative max-[767px]:gap-y-8">
                  {visible.map((project) => (
                    <div key={project.id} className="preview-item w-full transition-opacity duration-200">
                      <Link href={getProjectHref(project.slug)} className="preview-item__inner border-t border-border w-full py-7 block no-underline text-inherit max-[767px]:border-none max-[767px]:flex max-[767px]:flex-col max-[767px]:p-0">
                        <div className="preview-item__row flex flex-wrap justify-start items-center w-full max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-1">
                          <div className="flex-1 min-w-0 max-[767px]:flex-none max-[767px]:w-full">
                            <h3 className="preview-item__heading font-display text-[2rem] font-bold leading-[1.02] max-[767px]:text-lg">
                              {project.title.split(/\s*\|\s*|\s+[—–·]\s+/).filter(Boolean).map((line, i) => (
                                <span key={i} className="block">{line}</span>
                              ))}
                            </h3>
                          </div>
                          {/* Year -- mobile only */}
                          <div className="md:hidden flex-none w-full">
                            <p className="text-sm font-normal leading-[1.2] text-muted-foreground break-words">{project.year || '--'}</p>
                          </div>
                          {/* Services -- mobile only */}
                          <div className="md:hidden flex-none w-full">
                            <p className="text-sm font-normal leading-[1.2] text-muted-foreground break-words">{(project as any).services || project.role || project.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Additional work marquee -- desktop only */}
      <div className="mt-20 pb-10 hidden md:block">
        <Container className="px-4 lg:px-6 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">02 / Additional Work</span>
        </Container>
        <AdditionalWorkMarquee />
      </div>
    </section>
  )
}

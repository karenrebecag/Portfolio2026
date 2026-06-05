'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { usePageInit } from '@/lib/use-page-init'
import gsap from 'gsap'
import { Pill } from '@/components/ui/pill'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'
import type { Project } from '@karen-portfolio/shared'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getProjectHref, isArticleProject } from '@/lib/article-projects'
import { AdditionalWorkMarquee } from '@/components/additional-work'

const MAX_PROJECTS = 5

function initPreviewFollower() {
  const wrappers = document.querySelectorAll<HTMLElement>('[data-follower-wrap]')

  wrappers.forEach((wrap) => {
    const collection = wrap.querySelector<HTMLElement>('[data-follower-collection]')
    const items = wrap.querySelectorAll<HTMLElement>('[data-follower-item]')
    const follower = document.querySelector<HTMLElement>('[data-follower-cursor]')
    const followerInner = document.querySelector<HTMLElement>('[data-follower-cursor-inner]')

    if (!collection || !follower || !followerInner) return

    let prevIndex: number | null = null
    let firstEntry = true
    const offset = 100
    const duration = 0.5
    const ease = 'power2.inOut'

    gsap.set(follower, { xPercent: -50, yPercent: -50 })

    const xTo = gsap.quickTo(follower, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.6, ease: 'power3' })

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    })

    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        const forward = prevIndex === null || index > prevIndex
        prevIndex = index

        follower.querySelectorAll('[data-follower-visual]').forEach((el) => {
          gsap.killTweensOf(el)
          gsap.to(el, {
            yPercent: forward ? -offset : offset,
            duration, ease, overwrite: 'auto',
            onComplete: () => el.remove(),
          })
        })

        const visual = item.querySelector('[data-follower-visual]')
        if (!visual) return
        const clone = visual.cloneNode(true) as HTMLElement
        followerInner.appendChild(clone)

        if (!firstEntry) {
          gsap.fromTo(clone,
            { yPercent: forward ? offset : -offset },
            { yPercent: 0, duration, ease, overwrite: 'auto' },
          )
        } else {
          firstEntry = false
        }
      })

      item.addEventListener('mouseleave', () => {
        const el = follower.querySelector('[data-follower-visual]')
        if (!el) return
        gsap.killTweensOf(el)
        gsap.to(el, { yPercent: -offset, duration, ease, overwrite: 'auto', onComplete: () => el.remove() })
      })
    })

    collection.addEventListener('mouseleave', () => {
      follower.querySelectorAll('[data-follower-visual]').forEach((el) => {
        gsap.killTweensOf(el)
        gsap.delayedCall(duration, () => el.remove())
      })
      firstEntry = true
      prevIndex = null
    })
  })
}

export function ProjectsSection({ projects, cmsBase }: { projects: Project[]; cmsBase: string }) {
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  usePageInit(useCallback(() => {
    initPreviewFollower()
  }, []))

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

          {/* Right -- project list with preview follower */}
          <div className="md:col-span-7 min-w-0" data-follower-wrap>
            {/* Table header -- desktop only */}
            <div className="hidden lg:flex flex-wrap items-center w-full mb-2">
              <div className="flex-1 min-w-0 max-w-[45%]">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">{t('col_project')}</span>
              </div>
              <div className="flex-1 min-w-0 max-w-[15%]">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">{t('col_year')}</span>
              </div>
              <div className="flex-1 min-w-0 max-w-[30%]">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">{t('col_services')}</span>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="text-muted-foreground py-10">{t('empty')}</p>
            ) : (
              <div data-follower-collection className="w-full mt-2">
                <div className="preview-list flex flex-col w-full relative max-[767px]:gap-y-8">
                  {visible.map((project) => (
                    <div key={project.id} data-follower-item className="preview-item w-full transition-opacity duration-200">
                      <Link href={getProjectHref(project.slug)} className="preview-item__inner border-t border-border w-full py-7 block no-underline text-inherit max-[767px]:border-none max-[767px]:flex max-[767px]:flex-col max-[767px]:p-0">
                        <div className="preview-item__row flex flex-wrap justify-start items-center w-full max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-1">
                          <div className="flex-1 min-w-0 max-w-[45%] max-[767px]:flex-none max-[767px]:w-full max-[767px]:max-w-none">
                            <h3 className="preview-item__heading font-display text-[2rem] font-bold leading-none max-[767px]:text-lg">{project.title}</h3>
                          </div>
                          <div className="flex-1 min-w-0 max-w-[15%] max-[767px]:flex-none max-[767px]:w-full max-[767px]:max-w-none">
                            <p className="text-sm font-normal leading-[1.2] text-muted-foreground break-words">{project.year || '--'}</p>
                          </div>
                          <div className="flex-1 min-w-0 max-w-[30%] max-[767px]:flex-none max-[767px]:w-full max-[767px]:max-w-none">
                            <p className="text-sm font-normal leading-[1.2] text-muted-foreground break-words">{(project as any).services || project.role || project.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                        {project.coverImage && (
                          <div data-follower-visual className="preview-item__visual max-[767px]:!block max-[767px]:!relative max-[767px]:!w-full max-[767px]:order-first max-[767px]:mb-3 max-[767px]:border max-[767px]:border-border">
                            <img
                              src={project.coverImage.url.startsWith('http') ? project.coverImage.url : `${cmsBase}${project.coverImage.url}`}
                              alt={project.coverImage.alt}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cursor follower -- portaled to body */}
            {mounted && createPortal(
              <div data-follower-cursor className="preview-follower">
                <div data-follower-cursor-inner className="preview-follower__inner" />
              </div>,
              document.body,
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

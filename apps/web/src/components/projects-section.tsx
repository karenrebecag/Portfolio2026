'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePageInit } from '@/lib/use-page-init'
import gsap from 'gsap'
import { Pill } from '@/components/ui/pill'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'
import type { Project } from '@karen-portfolio/shared'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
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
  const raw = projects.length > 0 ? projects : PLACEHOLDER_PROJECTS as unknown as Project[]
  const visible = raw.slice(0, MAX_PROJECTS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  usePageInit(useCallback(() => {
    initPreviewFollower()
  }, []))

  return (
    <section id="projects" data-theme-section="light" data-reveal-group className="px-4 lg:px-6 py-40 scroll-mt-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-10">
          {/* Left -- context */}
          <div className="col-span-12 md:col-span-5">
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
          <div className="col-span-12 md:col-span-7" data-follower-wrap>
            {/* Table header -- desktop only */}
            <div className="preview-item__row hidden lg:flex mb-2">
              <div className="preview-item__col is--large">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">Project</span>
              </div>
              <div className="preview-item__col is--small">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">Year</span>
              </div>
              <div className="preview-item__col is--medium">
                <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-foreground/30">Services</span>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="text-muted-foreground py-10">{t('empty')}</p>
            ) : (
              <div data-follower-collection className="preview-collection">
                <div className="preview-list">
                  {visible.map((project) => (
                    <div key={project.id} data-follower-item className="preview-item">
                      <Link href={`/projects/${project.slug}`} className="preview-item__inner">
                        <div className="preview-item__row">
                          <div className="preview-item__col is--large">
                            <h3 className="preview-item__heading font-display">{project.title}</h3>
                          </div>
                          <div className="preview-item__col is--small">
                            <p className="preview-item__text">{project.year || '--'}</p>
                          </div>
                          <div className="preview-item__col is--medium">
                            <p className="preview-item__text">{(project as any).services || project.role || project.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                        {project.coverImage && (
                          <div data-follower-visual className="preview-item__visual">
                            <img
                              src={project.coverImage.url.startsWith('http') ? project.coverImage.url : `${cmsBase}${project.coverImage.url}`}
                              alt={project.coverImage.alt}
                              className="preview-item__visual-img"
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

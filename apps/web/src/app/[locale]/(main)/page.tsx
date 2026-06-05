import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Button061 } from '@/components/ui/button-061'
import { LogoWall } from '@/components/logo-wall'
import { Container } from '@/components/ui/container'
import { WhySection } from '@/components/why-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactSection } from '@/components/contact-section'
import { Pill } from '@/components/ui/pill'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getLocalizedProject } from '@/lib/project-i18n'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = PLACEHOLDER_PROJECTS
    .filter((p) => p.status === 'published')
    .map((p) => getLocalizedProject(p, locale))
  const t = await getTranslations()

  return (
    <>
      {/* Hero Banner */}
      <section data-theme-section="dark" className="relative min-h-[70vh] md:min-h-[85vh] lg:min-h-[95vh] px-4 lg:px-6 pt-20 overflow-hidden flex flex-col justify-end text-white">
        <div
          data-parallax="trigger"
          data-parallax-scroll-start="top top"
          data-parallax-start="0"
          data-parallax-end="40"
          className="absolute inset-0 z-0 h-[120%]"
        >
          <img
            data-parallax="target"
            src="https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/jj.webp"
            alt=""
            className="w-full h-full object-cover object-bottom"
          />
        </div>
        {/* 1. Stronger gradient -- covers bottom 60% for text legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/20 via-black/30 via-40% to-transparent" />

        <Container className="relative z-[1] mb-6">
          {/* Name */}
          <div className="relative mb-6 overflow-hidden">
            <h1 data-split="heading" data-split-reveal="lines" data-split-trigger="mount" className="text-[13vw] sm:text-[11vw] md:text-[10vw] font-bold uppercase leading-[0.85] tracking-[-0.03em]">
              Karen Ortiz
            </h1>
          </div>

          {/* Divider */}
          <div className="mb-8 h-[5px] w-full bg-current" />

          {/* Hero content grid */}
          <div className="mb-10 grid grid-cols-8 gap-x-6 gap-y-8 md:grid-cols-16 md:gap-6">
            {/* Title */}
            <div className="col-span-8 md:col-span-10">
              <h2 data-split="heading" data-split-reveal="lines" data-split-trigger="mount" className="text-xl sm:text-2xl font-semibold leading-snug tracking-tight">
                {t('hero.title')}
              </h2>
            </div>

            {/* Links */}
            <div className="col-span-8 md:col-span-6 flex items-start justify-end pt-1">
              <div className="flex gap-6 text-xs font-bold uppercase font-accent">
                <a href="https://github.com/karenrebecag" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">GitHub</a>
                <a href="https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">LinkedIn</a>
                <span className="opacity-40">&copy; 2026</span>
              </div>
            </div>

            {/* Subtitle */}
            <div className="col-span-8 md:col-span-8">
              <p className="text-sm font-normal leading-relaxed tracking-tight opacity-80">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Bullets */}
            <div className="col-span-8 md:col-span-8">
              <ul className="space-y-2 text-xs leading-relaxed opacity-75">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                  {t('hero.bullet_1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                  {t('hero.bullet_2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                  {t('hero.bullet_3')}
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="col-span-8 md:col-span-16 flex flex-col gap-3 items-start">
              <div className="flex flex-wrap gap-3">
                <Button061 href="/about" variant="secondary">{t('hero.cta_secondary')}</Button061>
                <Button061 href="#contact">{t('hero.cta_button')}</Button061>
              </div>
              <p className="text-xs opacity-40">{t('hero.subcopy')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 01 Selected Projects */}
      <ProjectsSection projects={projects} cmsBase="" />


      {/* 03 Why work with me */}
      <WhySection />

      {/* 04 Selected Collaborations */}
      <LogoWall />

      {/* About */}
      <section id="about" data-theme-section="dark" data-reveal-group className="relative px-4 lg:px-6 py-40 scroll-mt-20 text-white overflow-hidden">
        {/* Background image -- parallax */}
        <div
          data-parallax="trigger"
          data-parallax-scroll-start="top bottom"
          data-parallax-start="0"
          data-parallax-end="15"
          className="absolute inset-0 z-0 h-[120%] -top-[10%]"
        >
          <img
            data-parallax="target"
            src="https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Artboard%201.webp"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/30 via-40% to-transparent" />

        <Container className="relative z-[1]">
          {/* Eyebrow */}
          <p className="text-[10px] font-bold uppercase tracking-widest font-accent text-white/40">
            {t('about.eyebrow')}
          </p>

          {/* Heading */}
          <h2 className="mt-6 text-[clamp(1.75rem,4.5vw,3.5rem)] leading-[1.1] tracking-tight max-w-[20ch]">
            <span className="font-normal text-white/70">{t('about.heading_before')}</span>
            <span className="font-bold text-white">{t('about.heading_highlight')}</span>
          </h2>

          {/* Divider */}
          <div className="mt-10 mb-10 h-px w-full bg-white/15" />

          {/* Bullets */}
          <div className="space-y-8 max-w-xl">
            {(['bullet_1', 'bullet_2', 'bullet_3', 'bullet_4'] as const).map((key) => (
              <div key={key} className="flex items-start gap-4">
                <span className="mt-1 w-5 h-5 shrink-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8.5L6 12.5L14 3.5" stroke="var(--plantation)" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed text-white/80 font-medium">{t(`about.${key}`)}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-10 mb-10 h-px w-full bg-white/15" />

          {/* CTA */}
          <Button061 href="#contact" variant="secondary">{t('about.cta')}</Button061>
        </Container>
      </section>

      {/* Contact */}
      <ContactSection />
    </>
  )
}

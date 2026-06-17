import type { Metadata } from 'next'
import { preload } from 'react-dom'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { HeroParallaxBg } from '@/components/hero-parallax-bg'
import { HERO_IMAGES } from '@/lib/hero-assets'
import { buildAlternates, localizedPath } from '@/lib/seo'
import { defaultOgImages } from '@/lib/seo/metadata-helpers'
import {
  getHomePageSchema,
  getSpeakableWebPageSchema,
} from '@/lib/seo/structured-data'
import { HOME_SPEAKABLE_SELECTORS } from '@/lib/seo/site-config'
import { JsonLdScript } from '@/components/seo/json-ld'
import { Button061 } from '@/components/ui/button-061'
import { LogoWall } from '@/components/logo-wall'
import { Container } from '@/components/ui/container'
import { WhySection } from '@/components/why-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactSection } from '@/components/contact-section'
import { Pill } from '@/components/ui/pill'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { getLocalizedProject } from '@/lib/project-i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: { absolute: t('home_title') },
    description: t('home_description'),
    alternates: buildAlternates(locale, '/'),
    openGraph: {
      type: 'profile',
      url: localizedPath(locale, '/'),
      title: t('home_title'),
      description: t('home_description'),
      images: defaultOgImages(t('home_title')),
    },
    twitter: {
      title: t('home_title'),
      description: t('home_description'),
    },
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = PLACEHOLDER_PROJECTS
    .filter((p) => p.status === 'published')
    .map((p) => getLocalizedProject(p, locale))
  const t = await getTranslations()

  const personDescription = t('metadata.person_description')
  const jsonLd = [
    getHomePageSchema(locale, personDescription),
    getSpeakableWebPageSchema(HOME_SPEAKABLE_SELECTORS),
  ]

  preload(HERO_IMAGES.home, { as: 'image', fetchPriority: 'high' })
  preload(HERO_IMAGES.about, { as: 'image', fetchPriority: 'low' })

  return (
    <>
      <JsonLdScript data={jsonLd} />
      {/* Hero Banner */}
      <section
        id="hero"
        data-semantic-role="hero"
        data-llm-context="introduction-value-proposition"
        data-theme-section="dark"
        className="relative min-h-[70vh] md:min-h-[85vh] lg:min-h-[95vh] px-4 lg:px-6 pt-20 overflow-hidden flex flex-col justify-end text-white"
      >
        <div
          data-parallax="trigger"
          data-parallax-scroll-start="top top"
          data-parallax-start="0"
          data-parallax-end="40"
          className="absolute inset-0 z-0 h-[120%]"
        >
          <HeroParallaxBg src={HERO_IMAGES.home} priority />
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
              <ul className="space-y-2 text-sm leading-relaxed opacity-75">
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
            <div className="col-span-8 md:col-span-16">
              <div className="inline-flex flex-col gap-4 rounded-sm border border-white/20 bg-black/35 backdrop-blur-sm px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-row flex-nowrap gap-3 items-center">
                  <Button061 href="#contact" className="hero-cta-primary shrink-0">
                    {t('hero.cta_button')}
                  </Button061>
                  <Button061 href="/about" variant="secondary" className="shrink-0">
                    {t('hero.cta_secondary')}
                  </Button061>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 opacity-60 text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 640 640" fill="currentColor" aria-hidden="true">
                      <path d="M256 112L256 160L384 160L384 112C384 103.2 376.8 96 368 96L272 96C263.2 96 256 103.2 256 112zM224 160L224 112C224 85.5 245.5 64 272 64L368 64C394.5 64 416 85.5 416 112L416 160L512 160C547.3 160 576 188.7 576 224L576 480C576 515.3 547.3 544 512 544L128 544C92.7 544 64 515.3 64 480L64 224C64 188.7 92.7 160 128 160L224 160zM400 192L128 192C110.3 192 96 206.3 96 224L96 480C96 497.7 110.3 512 128 512L512 512C529.7 512 544 497.7 544 480L544 224C544 206.3 529.7 192 512 192L400 192z"/>
                    </svg>
                    <span className="text-2xs leading-none font-accent tracking-wide">{t('hero.availability.freelance')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 640 640" fill="currentColor" aria-hidden="true">
                      <path d="M544 256C579.3 256 608 284.7 608 320C608 355.3 579.3 384 544 384L439 384L267.8 570.8C264.8 574.1 260.5 576 256 576L176 576C170.9 576 166 573.5 163 569.4C160 565.3 159.2 559.9 160.8 555L217.8 384.1L159.7 384.1L100.5 458.1C97.5 461.9 92.9 464.1 88 464.1L40 464.1C35.1 464.1 30.4 461.8 27.4 457.9C24.4 454 23.3 449 24.5 444.2L55.5 320.1L24.5 196C23.3 191.2 24.4 186.2 27.4 182.3C30.4 178.4 35.1 176 40 176L88 176C92.9 176 97.5 178.2 100.5 182L159.7 256L217.8 256L160.8 85.1C159.2 80.2 160 74.9 163 70.7C166 66.5 170.9 64 176 64L256 64C260.5 64 264.8 65.9 267.8 69.2L439 256L544 256zM576 320C576 302.3 561.7 288 544 288L152 288C147.1 288 142.5 285.8 139.5 282L80.3 208L60.5 208L87.5 316.1C88.1 318.6 88.1 321.3 87.5 323.9L60.5 432L80.3 432L139.5 358C142.5 354.2 147.1 352 152 352L544 352C561.7 352 576 337.7 576 320zM395.6 384L251.5 384L198.2 544L249 544L395.7 384zM249 96L198.2 96L251.5 256L395.6 256L248.9 96z"/>
                    </svg>
                    <span className="text-2xs leading-none font-accent tracking-wide">{t('hero.availability.remote')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                      <path d="M12 22C14.2091 22 16 17.5228 16 12C16 6.47715 14.2091 2 12 2C9.79086 2 8 6.47715 8 12C8 17.5228 9.79086 22 12 22Z"/>
                      <path d="M2 12H22"/>
                      <path d="M20 18C17.4703 16.937 14.743 16.4256 12 16.5C9.25702 16.4256 6.52971 16.937 4 18"/>
                      <path d="M4 6C6.52971 7.06302 9.25702 7.57439 12 7.5C14.743 7.57439 17.4703 7.06302 20 6"/>
                    </svg>
                    <span className="text-2xs leading-none font-accent tracking-wide">{t('hero.availability.relocation')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 01 Selected Projects */}
      <ProjectsSection projects={projects} />


      {/* 03 Why work with me */}
      <WhySection />

      {/* 04 Selected Collaborations */}
      <LogoWall />

      {/* About */}
      <section
        id="about"
        data-semantic-role="about"
        data-llm-context="professional-background-expertise"
        data-theme-section="dark"
        data-reveal-group
        className="relative px-4 lg:px-6 py-40 scroll-mt-20 text-white overflow-hidden"
      >
        {/* Background image -- parallax */}
        <div
          data-parallax="trigger"
          data-parallax-scroll-start="top bottom"
          data-parallax-start="0"
          data-parallax-end="15"
          className="absolute inset-0 z-0 h-[120%] -top-[10%]"
        >
          <HeroParallaxBg src={HERO_IMAGES.homeAboutSection} objectPosition="top" />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/30 via-40% to-transparent" />

        <Container className="relative z-[1]">
          {/* Eyebrow */}
          <p className="text-2xs font-bold uppercase tracking-widest font-accent text-white/40">
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

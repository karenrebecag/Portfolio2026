import { Mail } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPublishedProjects } from '@/lib/payload'
import { Button061 } from '@/components/ui/button-061'
import { LogoWall } from '@/components/logo-wall'
import { Container } from '@/components/ui/container'
import { WhySection } from '@/components/why-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactForm } from '@/components/contact-form'
import { Pill } from '@/components/ui/pill'

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const CONTACT_LINKS = [
  { label: 'GitHub', href: 'https://github.com/karenrebecaortiz', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/karenrebecaortiz', icon: LinkedInIcon },
  { label: 'Email', href: 'mailto:hello@karenortiz.dev', icon: Mail },
]

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = await getPublishedProjects()
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
            <h1 data-split="heading" data-split-reveal="lines" data-split-trigger="mount" className="text-[11vw] sm:text-[10vw] font-bold uppercase leading-[0.85] tracking-[-0.03em] whitespace-nowrap">
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
                <a href="https://github.com/karenrebecaortiz" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">GitHub</a>
                <a href="https://linkedin.com/in/karenrebecaortiz" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">LinkedIn</a>
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
              <Button061 href="#contact">{t('hero.cta_button')}</Button061>
              <p className="text-xs opacity-40">{t('hero.subcopy')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 01 Selected Projects */}
      <ProjectsSection projects={projects} cmsBase={process.env.PAYLOAD_API_URL?.replace('/api', '') || ''} />


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
          data-parallax-end="30"
          className="absolute inset-0 z-0 h-[200%] -top-[50%]"
        >
          <img
            data-parallax="target"
            src="https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/bg.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />

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
                    <path d="M2 8.5L6 12.5L14 3.5" stroke="#88C0AF" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed text-white/80 font-medium">{t(`about.${key}`)}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-10 mb-10 h-px w-full bg-white/15" />

          {/* CTA */}
          <Button061 href="#contact">{t('about.cta')}</Button061>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" data-theme-section="dark" data-reveal-group className="bg-surface text-surface-foreground py-40 scroll-mt-20">
        <Container className="px-4 lg:px-6">
          <div className="grid gap-16 md:grid-cols-12">
            {/* Left -- context */}
            <div className="col-span-12 md:col-span-4">
              <Pill>{t('contact.label')}</Pill>
              <h2 data-split="heading" data-split-reveal="words" className="mt-6 text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] max-w-[16ch]">
                {t('contact.title')}
              </h2>
              <p className="mt-4 text-sm text-[#fdf9ed]/60 max-w-[30ch]">{t('contact.description')}</p>

              <div className="mt-8 h-px w-full bg-[#fdf9ed]/10" />

              <div className="mt-8 flex flex-col gap-3">
                {CONTACT_LINKS.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-[#fdf9ed]/50 hover:text-[#fdf9ed] transition-colors">
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right -- form */}
            <div className="col-span-12 md:col-span-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

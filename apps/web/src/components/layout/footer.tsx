'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'
import { FooterTechMarquee } from '@/components/footer-tech-marquee'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const common = useTranslations('common')

  return (
    <div data-footer-parallax className="footer-parallax-wrap">
    <footer data-footer-parallax-inner data-theme-section="dark" className="bg-surface text-surface-foreground">
      <Container className="px-4 lg:px-6 pt-20 pb-10">
        {/* Top: tagline + year */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-8">
          <div className="flex-1 font-display text-[2.75rem] leading-[1] font-bold tracking-tighter text-balance md:text-[6vw]">
            <p data-split="heading" data-split-reveal="words">{t('tagline_1')}</p>
            <p data-split="heading" data-split-reveal="words" className="text-surface-foreground/40">{t('tagline_2')}</p>
          </div>
          <div>
            <p className="font-display text-[45vw] leading-[1] font-bold tracking-tighter md:text-[12.75vw]">&copy;26</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-8 h-px w-full bg-surface-foreground/10" />

        {/* Middle: bio + CTA */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[80%] tracking-tight text-balance text-surface-foreground/70 text-base md:text-lg">{t('bio')}</p>
          <div className="shrink-0">
            <Button061
              href="/#contact"
              className="footer-cta"
            >
              {t('cta')}
            </Button061>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px w-full bg-surface-foreground/10" />

        {/* Bottom grid */}
        <div className="grid grid-cols-1 gap-y-10 text-base md:grid-cols-16 md:gap-x-6 md:gap-y-12">
          {/* Name + copyright */}
          <div className="order-last col-span-16 md:order-first md:col-span-4">
            <span className="block mb-2 font-display text-lg font-bold uppercase tracking-tight">{t('name')}</span>
            <span className="text-surface-foreground/40 text-sm font-accent">{t('rights')} &copy;&nbsp;2026</span>
          </div>

          {/* Location */}
          <div className="col-span-8 md:col-span-3 text-surface-foreground/60">
            <span className="font-bold text-surface-foreground">{t('location')}</span><br />{t('location_remote')}
          </div>

          {/* Email */}
          <div className="col-span-8 md:col-span-4">
            <a href="mailto:karenrortizg@gmail.com" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit font-accent text-sm">
              karenrortizg@gmail.com
            </a>
          </div>

          {/* Links */}
          <div className="order-first col-span-16 flex justify-evenly md:order-last md:col-span-5">
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-surface-foreground/30 text-sm font-accent uppercase mb-1">{common('socials')}</span>
              <a href="https://github.com/karenrebecag" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">GitHub</a>
              <a href="https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">LinkedIn</a>
              <a href="https://www.instagram.com/karenrebeca.og/" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">Instagram</a>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-surface-foreground/30 text-sm font-accent uppercase mb-1">{common('navigate')}</span>
              <Link href="/#projects" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">{nav('projects')}</Link>
              <Link href="/about" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">{nav('about')}</Link>
              <Link href="/#contact" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">{nav('contact')}</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-surface-foreground/10 flex items-center justify-between gap-6 text-sm text-surface-foreground/30 font-accent">
          <span className="shrink-0">{t('built_by')}</span>
          <div className="footer-tech-marquee-wrap">
            <FooterTechMarquee />
          </div>
        </div>
      </Container>
    </footer>
    <div data-footer-parallax-dark className="footer-parallax-dark" />
    </div>
  )
}
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const contact = useTranslations('contact')
  const common = useTranslations('common')

  return (
    <div data-footer-parallax className="footer-parallax-wrap">
    <footer data-footer-parallax-inner data-theme-section="dark" data-reveal-group data-stagger="80" className="bg-surface text-surface-foreground">
      <Container className="px-4 lg:px-6 pt-20 pb-10">
        {/* Top: tagline + year */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-8">
          <div className="flex-1 text-[2.75rem] leading-[1] font-[900] tracking-tighter text-balance md:text-[6vw]">
            <p data-split="heading" data-split-reveal="words">{t('tagline_1')}</p>
            <p data-split="heading" data-split-reveal="words" className="text-surface-foreground/40">{t('tagline_2')}</p>
          </div>
          <div>
            <p className="text-[45vw] leading-[1] font-[900] tracking-tighter md:text-[12.75vw]">&copy;26</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-8 h-px w-full bg-surface-foreground/10" />

        {/* Middle: bio + CTA */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[48ch] tracking-tight text-balance text-surface-foreground/70 md:text-lg">{t('bio')}</p>
          <div className="shrink-0">
            <Button061
              href="mailto:hello@karenortiz.dev"
              className="footer-cta"
            >
              {contact('cta')}
            </Button061>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px w-full bg-surface-foreground/10" />

        {/* Bottom grid */}
        <div className="grid grid-cols-1 gap-y-10 text-sm md:grid-cols-16 md:gap-x-6 md:gap-y-12">
          {/* Name + copyright */}
          <div className="order-last col-span-16 md:order-first md:col-span-4">
            <span className="block mb-2 font-display text-lg font-bold uppercase tracking-tight">{t('name')}</span>
            <span className="text-surface-foreground/40 text-xs font-accent">{t('rights')} &copy;&nbsp;2026</span>
          </div>

          {/* Location */}
          <div className="col-span-8 md:col-span-3 text-surface-foreground/60">
            {t('location')}<br />{t('location_remote')}
          </div>

          {/* Email */}
          <div className="col-span-8 md:col-span-4">
            <a href="mailto:hello@karenortiz.dev" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit font-accent text-xs">
              hello@karenortiz.dev
            </a>
          </div>

          {/* Links */}
          <div className="order-first col-span-16 flex justify-evenly md:order-last md:col-span-5">
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-surface-foreground/30 text-xs font-accent uppercase mb-1">{common('socials')}</span>
              <a href="https://github.com/karenrebecag" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">GitHub</a>
              <a href="https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">LinkedIn</a>
              <a href="https://www.instagram.com/karenrebeca.og/" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">Instagram</a>
              <a href="https://music.apple.com/profile/karenrebecaog" target="_blank" rel="noopener noreferrer" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">Apple Music</a>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-surface-foreground/30 text-xs font-accent uppercase mb-1">{common('navigate')}</span>
              <Link href="/#projects" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">{nav('projects')}</Link>
              <Link href="/about" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">{nav('about')}</Link>
              <Link href="/#contact" className="text-surface-foreground/60 hover:text-surface-foreground transition-colors max-w-fit">{nav('contact')}</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-surface-foreground/10 flex items-center justify-between text-xs text-surface-foreground/30 font-accent">
          <span>{t('built_by')}</span>
          <span>{t('stack')}</span>
        </div>
      </Container>
    </footer>
    <div data-footer-parallax-dark className="footer-parallax-dark" />
    </div>
  )
}

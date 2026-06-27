import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, localizedPath } from '@/lib/seo'
import { defaultOgImages } from '@/lib/seo/metadata-helpers'
import { SITE_AUTHOR } from '@/lib/seo/site-config'
import {
  PACKAGE_PRESENTATION,
  type ProposalFaq,
  type ProposalPackageText,
  type ProposalProcessStep,
  type ProposalService,
} from '@/content/proposals'
import { Container } from '@/components/ui/container'
import { GridGuides } from '@/components/ui/grid-guides'
import { Button061 } from '@/components/ui/button-061'
import { HeroHoverList } from '@/components/hero-hover-list'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import { ScrollSwapMarquee } from '@/components/scroll-swap-marquee'
import { ServicesShowcase } from '@/components/services-showcase'
import { NumberOdometer } from '@/components/number-odometer'
import { PackagesCarousel } from '@/components/packages-carousel'
import { RotatingSteps } from '@/components/rotating-steps'
import { FaqAccordion } from '@/components/faq-accordion'
import { ContactSection } from '@/components/contact-section'

/** Shapes multicolor para el image trail del hero. En public/shapes/. */
const TRAIL_SHAPES = [
  '/shapes/flower.png',
  '/shapes/clover.png',
  '/shapes/petals.png',
  '/shapes/bloom.png',
  '/shapes/donut.png',
  '/shapes/arrow.png',
  '/shapes/metaball.png',
  '/shapes/energy.png',
  '/shapes/star-sparkles.png',
  '/shapes/sparkle-circle.png',
  '/shapes/connection.png',
  '/shapes/semi-circle.png',
  '/shapes/blue-flower.png',
  '/shapes/blue-smile.png',
  '/shapes/blue-pink-circle.png',
  '/shapes/blue-x.png',
  '/shapes/black-spades.png',
  '/shapes/black-ellipse.png',
  '/shapes/orange-asterisk.png',
  '/shapes/orange-hearts.png',
  '/shapes/orange-diamond.png',
  '/shapes/orange-pin.png',
  '/shapes/pink-flower.png',
  '/shapes/pink-bang-star.png',
  '/shapes/pink-fish.png',
  '/shapes/pink-click.png',
  '/shapes/purple-star.png',
  '/shapes/purple-petals.png',
  '/shapes/purple-windmill.png',
  '/shapes/purple-gear.png',
  '/shapes/purple-six-flower.png',
  '/shapes/purple-chat.png',
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('proposals_title'),
    description: t('proposals_description'),
    alternates: buildAlternates(locale, '/proposals/pigmento-studio'),
    authors: [{ name: SITE_AUTHOR.name }],
    openGraph: {
      type: 'website',
      url: localizedPath(locale, '/proposals/pigmento-studio'),
      title: t('proposals_title'),
      description: t('proposals_description'),
      images: defaultOgImages(t('proposals_title')),
    },
    twitter: {
      title: t('proposals_title'),
      description: t('proposals_description'),
    },
  }
}

export default async function ProposalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('proposals')

  const heroLines = t.raw('hero_lines') as string[]
  const marqueeServices = t.raw('marquee_services') as string[]
  const services = t.raw('services') as ProposalService[]
  const processSteps = t.raw('process') as ProposalProcessStep[]
  const faq = t.raw('faq') as ProposalFaq[]
  const toolboxBody = t.raw('packages_toolbox_body') as string[]
  const terms = t.raw('packages_terms') as string[]

  // Pricing formateado (MXN, separador de miles) construido aquí para que tanto
  // el grid como el carrusel rendericen strings listos (i18n solo en el server).
  const priceUnit = t('packages_price_unit')
  const weeklyVisitNote = t('packages_weekly_visit')
  const fmtMxn = (n: number) => '$' + n.toLocaleString('en-US')
  const packages = (t.raw('packages') as ProposalPackageText[]).map((pkg, i) => {
    const pres = PACKAGE_PRESENTATION[i]
    return {
      ...pkg,
      ...pres,
      priceValue: fmtMxn(pres.priceMonthly),
      priceUnit,
      extraProjectNote: t('packages_extra_project', {
        price: fmtMxn(pres.priceMonthly / pres.projectsPerMonth),
      }),
      projectsIncludedNote: t('packages_projects_included', { count: pres.projectsPerMonth }),
      weeklyVisitNote: pkg.footerNote ?? (pres.weeklyVisit ? weeklyVisitNote : undefined),
    }
  })

  return (
    <div id="proposals-page" data-semantic-role="services" data-llm-context="professional-services-offering">
      {/* Hero — bg surface (token más oscuro) + maquetación MWG 041: lista interactiva */}
      <section
        data-semantic-role="hero"
        data-llm-context="services-offering"
        data-theme-section="dark"
        className="relative min-h-[90vh] md:min-h-dvh px-4 lg:px-6 pt-20 overflow-hidden flex flex-col justify-center bg-surface text-surface-foreground"
      >
        <GridGuides className="z-0" />
        <CursorImageTrail images={TRAIL_SHAPES} autoIntervalMs={550} className="absolute inset-0 z-0" />
        <div
          data-reveal-group
          data-stagger="140"
          data-start="top 90%"
          data-distance="2.5em"
          className="relative z-[1] flex flex-1 flex-col items-center justify-center py-12"
        >
          <HeroHoverList items={heroLines} />
          <p className="mt-8 max-w-[42ch] text-center text-base md:text-lg leading-relaxed text-surface-foreground/70">
            {t('hero_subtitle')}
          </p>
          <div
            data-reveal-group-nested
            data-stagger="90"
            data-distance="1.5em"
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            <Button061 href="#contact">{t('hero_cta_primary')}</Button061>
            <Button061 href="#packages" variant="secondary">{t('hero_cta_secondary')}</Button061>
          </div>
        </div>
      </section>

      {/* Services marquee — banda separadora bajo el hero (scroll lento) */}
      <ScrollSwapMarquee items={marqueeServices} compact speed={45} />

      {/* Services — switch responsive: fan (MWG 003) ≥992px, stack (MWG 031) <992px */}
      <ServicesShowcase
        services={services}
        labels={{
          eyebrow: t('services_eyebrow'),
          heading: t('services_heading'),
          count: t('services_count'),
          scrollHint: t('services_scroll_hint'),
          itemLabel: t('services_item_label'),
          includesLabel: t('services_includes_label'),
        }}
      />

      {/* Packages */}
      <section id="packages" data-theme-section="dark" className="px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container>
          <div data-reveal-group data-stagger="90" data-distance="1.5em">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('packages_eyebrow')}</span>
            <div data-ignore="true">
              <h2 data-split="heading" data-split-reveal="words" className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-tight max-w-[24ch]">{t('packages_heading')}</h2>
            </div>
          </div>

          {/* ≥1200: grid de 3 columnas. <1200: carrusel horizontal (MWG 087). */}
          <div data-reveal-group data-stagger="80" data-distance="1.5em" className="mt-16 grid grid-cols-1 gap-6 items-stretch min-[1200px]:grid-cols-3 min-[520px]:max-[1199px]:hidden">
            {packages.map((pkg) => (
              // Wrapper exterior = item del reveal-group (GSAP lo anima y le hace
              // clearProps:'all'). El gradiente vive en el div interior para que
              // clearProps no borre el style inline. Ver home: usa clases, no inline.
              <div key={pkg.name} className="flex">
                <div
                  style={
                    {
                      background: pkg.gradient.bg,
                      color: pkg.gradient.text,
                      '--button-061-color': '#fdf9ed',
                      '--button-061-color-background': pkg.gradient.text,
                      '--button-061-hover-color-background': 'rgba(0, 0, 0, 0.22)',
                    } as React.CSSProperties
                  }
                  className={`relative flex w-full flex-col overflow-hidden rounded-2xl p-8 ${pkg.featured ? 'shadow-2xl' : 'shadow-lg'}`}
                >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold leading-tight tracking-tight">{pkg.name}</h3>
                  {pkg.featured && (
                    <span
                      style={{ background: 'rgba(0, 0, 0, 0.14)' }}
                      className="rounded-full px-2 py-1 text-2xs font-accent uppercase tracking-widest"
                    >
                      {t('packages_featured_label')}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <NumberOdometer items={[{ value: pkg.priceValue }]} numberClassName="text-[2.5rem] font-bold leading-none tracking-tight" />
                  <span className="pb-1 text-2xs font-accent uppercase tracking-wide opacity-60">{pkg.priceUnit}</span>
                </div>
                <p className="mt-1.5 text-2xs font-medium opacity-75">{pkg.projectsIncludedNote}</p>
                <p className="mt-1 text-2xs opacity-60">{pkg.extraProjectNote}</p>

                <p className="mt-5 text-base font-medium leading-snug opacity-95">{pkg.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{pkg.audience}</p>

                <span className="mt-8 block text-2xs font-accent uppercase tracking-widest opacity-60">{pkg.includesLabel}</span>
                <ul className="mt-3 space-y-3 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-[1.6]">
                      <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      <span className="opacity-85">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.weeklyVisitNote && (
                  <p className="mt-5 border-t border-current/15 pt-4 text-xs font-medium leading-snug opacity-80">{pkg.weeklyVisitNote}</p>
                )}

                {pkg.disclaimer && (
                  <p className="mt-5 flex gap-1.5 border-t border-current/15 pt-4 font-accent text-2xs leading-[1.5] opacity-50">
                    <span aria-hidden>*</span>
                    <span>{pkg.disclaimer}</span>
                  </p>
                )}
                </div>
              </div>
            ))}
          </div>

          <PackagesCarousel
            packages={packages}
            featuredLabel={t('packages_featured_label')}
            className="max-[519px]:hidden min-[1200px]:hidden"
          />

          {/* Pricing terms — disclaimer fluido en monospace, sin contenedor */}
          <p className="mt-10 w-full font-accent text-2xs leading-[1.8] text-surface-foreground/45">
            <span className="font-bold uppercase tracking-widest text-surface-foreground/65">{t('packages_terms_heading')}:</span>{' '}
            {terms.join('  ·  ')}
          </p>

          {/* Toolbox — disclaimer fluido en monospace, bold para highlight */}
          <p className="mt-6 w-full font-accent text-2xs leading-[1.8] text-surface-foreground/45">
            <span className="font-bold uppercase tracking-widest text-surface-foreground/65">{t('packages_toolbox_heading')}:</span>{' '}
            <span className="font-bold text-surface-foreground/75">{t('packages_toolbox_subheading')}</span>{' '}
            {toolboxBody.join('  ·  ')}
          </p>
        </Container>
      </section>

      {/* Process — steps que voltean en 3D al scroll (MWG 053) */}
      <RotatingSteps steps={processSteps} shapes={TRAIL_SHAPES} />

      {/* FAQ — centrado, tamaños equivalentes a ATOM Academy */}
      <section data-theme-section="dark" className="px-4 lg:px-6 py-14 lg:py-20">
        <Container
          data-reveal-group
          data-stagger="90"
          data-start="top 82%"
          data-distance="2em"
          className="flex flex-col items-center text-center"
        >
          <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('faq_eyebrow')}</span>
          <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.1] tracking-tight max-w-[18ch]">{t('faq_heading')}</h2>

          <div className="mt-16 w-full text-left">
            <FaqAccordion items={faq} />
          </div>
        </Container>
      </section>

      {/* Contact */}
      <ContactSection />
    </div>
  )
}

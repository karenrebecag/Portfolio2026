import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, localizedPath } from '@/lib/seo'
import { defaultOgImages } from '@/lib/seo/metadata-helpers'
import { SITE_AUTHOR } from '@/lib/seo/site-config'
import {
  ECOMMERCE_CARD_GRADIENT,
  ECOMMERCE_PRICING_PRESENTATION,
  MAORI_CARD_GRADIENT,
  MAORI_PRICING_PRESENTATION,
  PACKAGE_PRESENTATION,
  PROJECT_PRICING_PRESENTATION,
  RETAINER_CARD_GRADIENT,
  type ProposalDualOptionPresentation,
  type ProposalDualOptionText,
  type ProposalFaq,
  type ProposalProjectPricingText,
  type ProposalRetainerText,
} from '@/content/proposals'
import { Container } from '@/components/ui/container'
import { GridGuides } from '@/components/ui/grid-guides'
import { Button061 } from '@/components/ui/button-061'
import { HeroHoverList } from '@/components/hero-hover-list'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import { ScrollSwapMarquee } from '@/components/scroll-swap-marquee'
import { ExpandingDisclaimer } from '@/components/expanding-disclaimer'
import { ReviewsMarquee } from '@/components/reviews-marquee'
import { NumberOdometer } from '@/components/number-odometer'
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

/** Renderiza `**texto**` como <strong>; usado en el copy de scope_includes/scope_excludes. */
function renderWithBold(text: string) {
  return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))
}

type DualOption = ProposalDualOptionText & ProposalDualOptionPresentation & {
  isRange: boolean
  priceValue: string
  priceUnit: string
}

type PriceCardItem = ProposalProjectPricingText & {
  isRange: boolean
  priceValue: string
  priceUnit: string
  gradient: { bg: string; text: string }
}

/** Card de precio único (1er y 3er slot: tintas.zip, Pigmento Studio). */
function PriceCard({ item }: { item: PriceCardItem }) {
  return (
    <div className="flex">
      <div
        style={{ background: item.gradient.bg, color: item.gradient.text }}
        className="relative flex w-full flex-col overflow-hidden rounded-2xl p-8 shadow-lg"
      >
        <span className="text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{item.category}</span>
        <h3 className="mt-3 font-display text-[clamp(1.25rem,2vw,1.75rem)] font-extrabold leading-[0.98] tracking-[-0.02em]">{item.title}</h3>

        <div className="mt-5 flex items-end gap-2">
          <NumberOdometer
            items={[{ value: item.priceValue }]}
            numberClassName={`font-display font-extrabold leading-none tracking-[-0.03em] ${item.isRange ? 'text-[clamp(1.15rem,2vw,1.6rem)]' : 'text-[2.25rem]'}`}
          />
          <span className="pb-1 text-xs font-accent uppercase tracking-wide opacity-60">{item.priceUnit}</span>
        </div>
        <p className="mt-1.5 text-xs font-medium opacity-75">{item.timeline}</p>

        <p className="mt-4 text-sm font-medium leading-relaxed opacity-95">{item.tagline}</p>

        <ul className="mt-6 flex-1">
          {item.includes.map((feature, i) => (
            <li
              key={feature}
              className={`py-3 text-sm font-medium leading-[1.45] opacity-85 ${i === 0 ? 'pt-0' : 'border-t border-current/15'}`}
            >
              {feature}
            </li>
          ))}
        </ul>

        <p className="mt-auto pt-6 border-t border-current/15 text-2xs font-accent uppercase tracking-[0.08em] opacity-70">
          {item.audience}
        </p>
      </div>
    </div>
  )
}

/**
 * Card compartida con 2 opciones apiladas (divisor horizontal), en vez de una
 * card por opción. Usada por el 2do slot (e-commerce: Jamstack vs. Shopify +
 * Stripe) y el 4to slot (maori: reparación vs. recreación) del grid.
 */
function DualOptionCard({ gradient, options }: { gradient: { bg: string; text: string }; options: DualOption[] }) {
  return (
    <div className="flex">
      <div
        style={{ background: gradient.bg, color: gradient.text }}
        className="relative flex w-full flex-col divide-y divide-current/15 overflow-hidden rounded-2xl shadow-lg"
      >
        {options.map((opt) => (
          <div key={opt.label} className="flex flex-col p-8">
            <span className="text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{opt.label}</span>
            <h3 className="mt-3 font-display text-[clamp(1.25rem,2vw,1.75rem)] font-extrabold leading-[0.98] tracking-[-0.02em]">{opt.title}</h3>

            <div className="mt-5 flex items-end gap-2">
              <NumberOdometer
                items={[{ value: opt.priceValue }]}
                numberClassName={`font-display font-extrabold leading-none tracking-[-0.03em] ${opt.isRange ? 'text-[clamp(1.15rem,2vw,1.6rem)]' : 'text-[2.25rem]'}`}
              />
              <span className="pb-1 text-xs font-accent uppercase tracking-wide opacity-60">{opt.priceUnit}</span>
            </div>
            <p className="mt-1.5 text-xs font-medium opacity-75">{opt.timeline}</p>

            <p className="mt-4 text-sm font-medium leading-relaxed opacity-95">{opt.tagline}</p>

            <p className="mt-auto pt-6 text-2xs font-accent uppercase tracking-[0.08em] opacity-70">{opt.audience}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('proposalsProject_title'),
    description: t('proposalsProject_description'),
    alternates: buildAlternates(locale, '/proposals/ronda01-pigmento'),
    authors: [{ name: SITE_AUTHOR.name }],
    openGraph: {
      type: 'website',
      url: localizedPath(locale, '/proposals/ronda01-pigmento'),
      title: t('proposalsProject_title'),
      description: t('proposalsProject_description'),
      images: defaultOgImages(t('proposalsProject_title')),
    },
    twitter: {
      title: t('proposalsProject_title'),
      description: t('proposalsProject_description'),
    },
  }
}

export default async function ProposalsProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('proposalsProject')

  const heroLines = t.raw('hero_lines') as string[]
  const marqueeServices = t.raw('marquee_services') as string[]
  const faq = t.raw('faq') as ProposalFaq[]
  const toolboxBody = t.raw('pricing_toolbox_body') as string[]
  const terms = t.raw('pricing_terms') as string[]
  const scopeIncludes = t.raw('scope_includes') as string[]
  const scopeExcludes = t.raw('scope_excludes') as string[]

  // Precio formateado (MXN, separador de miles) por tipo de proyecto, fusionado
  // por índice con la presentación en content/proposals.ts. Con `priceMax`, el
  // proyecto se cotiza como rango (estimado con dos alcances).
  const priceUnit = t('pricing_price_unit')
  const fmtMxn = (n: number) => '$' + n.toLocaleString('en-US')
  const pricing = (t.raw('pricing') as ProposalProjectPricingText[]).map((item, i) => {
    const pres = PROJECT_PRICING_PRESENTATION[i]
    const isRange = pres.priceMax != null
    return {
      ...item,
      ...pres,
      isRange,
      priceValue: isRange ? `${fmtMxn(pres.price)} – ${fmtMxn(pres.priceMax!)}` : fmtMxn(pres.price),
      priceUnit,
    }
  })

  // 2do slot — e-commerce: Jamstack vs. Shopify + Stripe son dos caminos con
  // precio propio, no un rango genérico; misma card compartida que maori.
  const ecommerceOptions = (t.raw('ecommerce_options') as ProposalDualOptionText[]).map((opt, i) => {
    const pres = ECOMMERCE_PRICING_PRESENTATION[i]
    const isRange = pres.priceMax != null
    return {
      ...opt,
      ...pres,
      isRange,
      priceValue: isRange ? `${fmtMxn(pres.price)} – ${fmtMxn(pres.priceMax!)}` : fmtMxn(pres.price),
      priceUnit,
    }
  })

  // Card full-width del retainer — alternativa a cotizar por proyecto. Por la
  // complejidad de estos cuatro proyectos solo es viable el tier más alto de
  // la primera propuesta (Visionary), así que el precio es el techo, no el piso.
  const retainer = t.raw('retainer') as ProposalRetainerText
  const retainerPrice = fmtMxn(Math.max(...PACKAGE_PRESENTATION.map((p) => p.priceMonthly)))

  // 4to slot — card compartida de maori.com.mx, ver 2 opciones (reparación
  // WooCommerce vs. recreación Shopify) apiladas en una sola card.
  const tMaori = await getTranslations('proposalsMaori')
  const maoriOptions = (tMaori.raw('options') as ProposalDualOptionText[]).map((opt, i) => {
    const pres = MAORI_PRICING_PRESENTATION[i]
    const isRange = pres.priceMax != null
    return {
      ...opt,
      ...pres,
      isRange,
      priceValue: isRange ? `${fmtMxn(pres.price)} – ${fmtMxn(pres.priceMax!)}` : fmtMxn(pres.price),
      priceUnit,
    }
  })

  return (
    <div id="proposals-project-page" data-semantic-role="services" data-llm-context="professional-services-offering">
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
          {/* Container único para heading, subheading y CTAs: todos comparten el mismo max-width. */}
          <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center">
            <HeroHoverList items={heroLines} />
            <p className="mt-8 w-full text-center text-base md:text-lg leading-relaxed text-surface-foreground/70">
              {t('hero_subtitle')}
            </p>
            <div
              data-reveal-group-nested
              data-stagger="90"
              data-distance="1.5em"
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              <Button061 href="#contact">{t('hero_cta_primary')}</Button061>
              <Button061 href="#pricing" variant="secondary">{t('hero_cta_secondary')}</Button061>
            </div>
          </div>
        </div>
      </section>

      {/* Services marquee — banda separadora bajo el hero (scroll lento) */}
      <ScrollSwapMarquee items={marqueeServices} compact speed={45} />

      {/* Pricing — alcance compartido + precio fijo por cada uno de los 3 proyectos */}
      <section id="pricing" data-theme-section="dark" className="px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container>
          {/* Intro centrado — mismas entradas de scroll que la sección de FAQ
              (reveal-group con stagger, elementos completos). */}
          <div
            data-reveal-group
            data-stagger="90"
            data-start="top 82%"
            data-distance="2em"
            className="flex flex-col items-center gap-6 text-center"
          >
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('pricing_eyebrow')}</span>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight max-w-[16ch]">{t('pricing_intro_heading')}</h2>
            <p className="max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">{t('pricing_intro_subtitle')}</p>
          </div>

          {/* Precio por proyecto */}
          {/* Grid 2x2: 2 columnas desde sm, 1 columna en mobile. 4 slots
              explícitos porque ya no son homogéneos: 1 y 3 son cards de precio
              único (tintas.zip, Pigmento Studio); 2 y 4 son la card
              compartida de 2 opciones (e-commerce, maori). */}
          <div data-reveal-group data-stagger="80" data-distance="1.5em" className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <PriceCard item={pricing[0]} />
            <DualOptionCard gradient={ECOMMERCE_CARD_GRADIENT} options={ecommerceOptions} />
            <PriceCard item={pricing[1]} />
            <DualOptionCard gradient={MAORI_CARD_GRADIENT} options={maoriOptions} />

            {/* Separator — corta el grid por proyecto antes de la alternativa retainer. */}
            <div aria-hidden className="lg:col-span-2 mt-4 border-t border-surface-foreground/15" />

            {/* Card full-width — alternativa retainer: todos los proyectos por
                fases bajo tarifa mensual fija, con asesoría continua (vs. la
                asesoría limitada al proyecto contratado del modelo por proyecto). */}
            <div className="flex lg:col-span-2">
              <div
                style={
                  {
                    background: RETAINER_CARD_GRADIENT.bg,
                    color: RETAINER_CARD_GRADIENT.text,
                    '--button-061-color': '#fdf9ed',
                    '--button-061-color-background': RETAINER_CARD_GRADIENT.text,
                    '--button-061-hover-color-background': 'rgba(0, 0, 0, 0.22)',
                  } as React.CSSProperties
                }
                className="relative flex w-full flex-col gap-8 overflow-hidden rounded-2xl p-8 shadow-lg lg:flex-row lg:gap-12"
              >
                <div className="flex flex-col lg:w-2/5 lg:shrink-0">
                  <span className="text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{retainer.label}</span>
                  <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em]">{retainer.title}</h3>

                  <div className="mt-5 flex items-end gap-2">
                    <span className="pb-1 text-xs font-accent uppercase tracking-wide opacity-60">{retainer.price_prefix}</span>
                    <NumberOdometer
                      items={[{ value: retainerPrice }]}
                      numberClassName="font-display text-[2.25rem] font-extrabold leading-none tracking-[-0.03em]"
                    />
                    <span className="pb-1 text-xs font-accent uppercase tracking-wide opacity-60">{retainer.price_unit}</span>
                  </div>

                  <p className="mt-4 text-sm font-medium leading-relaxed opacity-95">{retainer.tagline}</p>

                  <div className="mt-8">
                    <Button061 href="/proposals/pigmento-studio">{retainer.cta}</Button061>
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <ul className="flex-1">
                    {retainer.includes.map((feature, i) => (
                      <li
                        key={feature}
                        className={`py-3 text-sm font-medium leading-[1.45] opacity-85 ${i === 0 ? 'pt-0' : 'border-t border-current/15'}`}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto pt-6 border-t border-current/15 text-2xs font-accent uppercase tracking-[0.08em] opacity-70">
                    {retainer.note}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing terms — disclaimer fluido en monospace, sin contenedor */}
          <p className="mt-10 w-full font-accent text-2xs leading-[1.8] text-surface-foreground/45">
            <span className="font-bold uppercase tracking-widest text-surface-foreground/65">{t('pricing_terms_heading')}:</span>{' '}
            {terms.join('  ·  ')}
          </p>

          {/* Toolbox — disclaimer fluido en monospace, bold para highlight */}
          <p className="mt-6 w-full font-accent text-2xs leading-[1.8] text-surface-foreground/45">
            <span className="font-bold uppercase tracking-widest text-surface-foreground/65">{t('pricing_toolbox_heading')}:</span>{' '}
            <span className="font-bold text-surface-foreground/75">{t('pricing_toolbox_subheading')}</span>{' '}
            {toolboxBody.join('  ·  ')}
          </p>
        </Container>
      </section>

      {/* Process — oculto por ahora; el copy sigue en proposalsProject.process.
          Para reactivarlo: <RotatingSteps steps={processSteps} shapes={TRAIL_SHAPES} /> */}

      {/* Reviews — galería horizontal con pin (MWG 087), mismo REVIEWS del home */}
      <ReviewsMarquee
        eyebrow={t('reviews_eyebrow')}
        heading={t('reviews_heading')}
        subheading={t('reviews_subheading')}
      />

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

      {/* Disclaimer flotante — se porta al mismo div fixed del IconButton de
          LinkedIn en el layout raíz (#fixed-corner-actions), como hermano. */}
      <ExpandingDisclaimer
        label={t('disclaimer_label')}
        primaryLabel={t('scope_includes_label')}
        primaryItems={scopeIncludes.map((line, i) => ({
          key: `include-${i}`,
          content: (
            <div className="flex gap-2.5">
              <img
                src={TRAIL_SHAPES[i % TRAIL_SHAPES.length]}
                alt=""
                aria-hidden
                className="mt-[0.2em] h-3.5 w-3.5 shrink-0 object-contain"
              />
              <span className="opacity-90">{renderWithBold(line)}</span>
            </div>
          ),
        }))}
        secondaryLabel={t('scope_excludes_label')}
        secondaryItems={scopeExcludes.map((line, i) => ({
          key: `exclude-${i}`,
          content: (
            <div className="flex gap-2.5">
              <img
                src={TRAIL_SHAPES[i % TRAIL_SHAPES.length]}
                alt=""
                aria-hidden
                className="mt-[0.2em] h-3.5 w-3.5 shrink-0 object-contain grayscale opacity-50"
              />
              <span className="opacity-60">{renderWithBold(line)}</span>
            </div>
          ),
        }))}
      />
    </div>
  )
}

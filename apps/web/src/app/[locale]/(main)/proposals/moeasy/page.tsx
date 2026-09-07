import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, localizedPath } from '@/lib/seo'
import { defaultOgImages } from '@/lib/seo/metadata-helpers'
import { SITE_AUTHOR } from '@/lib/seo/site-config'
import {
  MARGIN_CARD_GRADIENT,
  MOEASY_TIER_PRESENTATION,
  PROPOSAL_TRAIL_SHAPES,
  type ProposalFaq,
  type ProposalTier,
  type ProposalTierText,
} from '@/content/proposals'
import { Container } from '@/components/ui/container'
import { GridGuides } from '@/components/ui/grid-guides'
import { Button061 } from '@/components/ui/button-061'
import { HeroHoverList } from '@/components/hero-hover-list'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import { AccordionCssInit } from '@/components/accordion-css'
import { ScrollSwapMarquee } from '@/components/scroll-swap-marquee'
import { ScrollHighlight } from '@/components/scroll-highlight'
import { NumberOdometer } from '@/components/number-odometer'

/** Problema del diagnóstico, en `proposalsMoeasy.problems`. */
type MoeasyProblem = {
  n: string
  /** Etiqueta corta de la capa donde vive el problema, ej. "Búsqueda". */
  tag: string
  title: string
  body: string
  /** Qué le cuesta a MoEasy en operaciones. Sin esto el problema es un dato, no un argumento. */
  cost: string
}

/** Camino descartado, en `proposalsMoeasy.alternatives_rows`. */
type AlternativeRow = {
  name: string
  cost: string
  why: string
}

/** Objeción de MoEasy con su respuesta y la concesión que sí se puede dar. */
type ObjectionRow = {
  objection: string
  response: string
  concession: string
}

/** Fila de una tabla de precios de mercado (agencias, membresías, infraestructura). */
type PriceRow = {
  name: string
  range: string
  note: string
  /** Nombre de la fuente; ausente cuando el dato es una estimación propia. */
  source?: string
  url?: string
}

/** Dato de mercado, en `proposalsMoeasy.market_stats`. */
type MarketStat = {
  value: string
  label: string
  source: string
  url?: string
}

/** Rama del árbol de decisión, en `proposalsMoeasy.choose_tree`. */
type DecisionBranch = {
  condition: string
  result: string
}

/**
 * Etiqueta de capa. La página tiene dos lectores (Pigmento decide, MoEasy
 * podría verla reenviada), así que cada bloque declara para quién es.
 * Misma anatomía que `Pill`, con color por tipo.
 */
const BADGE_TONES = {
  client: 'bg-[var(--plantation)] text-background',
  internal: 'border border-current/40 text-[var(--plantation)]',
  discovery: 'border border-current/30 text-surface-foreground/60',
} as const

function SectionBadge({ tone, children }: { tone: keyof typeof BADGE_TONES; children: React.ReactNode }) {
  return (
    <span className={`inline-block px-2 py-1 text-2xs font-bold uppercase tracking-widest leading-none font-accent ${BADGE_TONES[tone]}`}>
      {children}
    </span>
  )
}

/** Argumento de por qué esto y por qué Pigmento. Mismo shape que un outcome. */
type WhyPoint = {
  title: string
  body: string
}

/** Página del sitio, en `proposalsMoeasy.scope_pages`. */
type ScopePage = {
  name: string
  detail: string
}

/** Solución propuesta, ligada a una falla de la auditoría, con su pronóstico. */
type Solution = {
  /** Falla de la auditoría a la que responde, ej. "Falla 01, captación". */
  answers: string
  title: string
  body: string
  /** Qué esperar, con cifra de mercado cuando existe. */
  forecast: string
  source?: string
  url?: string
}

/** Área que Pigmento puede vender por su cuenta, en `proposalsMoeasy.margin_items`. */
type MarginItem = {
  name: string
  pitch: string
  /** Referencia de mercado, no un precio mío. */
  reference: string
  /** Cuándo se vende: la señal en el cliente que abre la conversación. */
  trigger: string
}

type TierView = ProposalTier & {
  priceValue: string
  priceUnit: string
  /** Banda sugerida de reventa, ya formateada, ej. "$80,000 a $98,000". */
  suggestedValue: string
  /** Margen de Pigmento, en pesos y en porcentaje sobre el costo. */
  marginValue: string
}

/** Tabla de precios de mercado: proveedor, rango y qué entrega. Se usa tres
 *  veces en la sección interna de contexto (agencias, membresías, infra). */
function PriceTable({ columns, rows, sourceLabel }: { columns: string[]; rows: PriceRow[]; sourceLabel: string }) {
  const source = (row: PriceRow) =>
    row.url && (
      <a
        href={row.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block font-accent text-2xs uppercase tracking-[0.1em] text-foreground/55 underline underline-offset-4 transition-colors hover:text-[var(--plantation)]"
      >
        {sourceLabel}: {row.source}
      </a>
    )

  return (
    <>
      {/* En móvil se apila: la tabla necesita 48rem y meterla en un teléfono
          empuja el layout en horizontal en vez de envolver. */}
      <ul className="mt-8 md:hidden">
        {rows.map((row) => (
          <li key={row.name} className="border-t border-foreground/15 py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-sm font-bold leading-[1.4]">{row.name}</h4>
              <span className="font-accent text-sm font-bold leading-[1.6] text-[var(--plantation)]">{row.range}</span>
            </div>
            <p className="mt-2 text-sm leading-[1.6] text-foreground/75">{row.note}</p>
            {source(row)}
          </li>
        ))}
      </ul>

      <div className="mt-8 -mx-4 hidden overflow-x-auto px-4 md:block lg:mx-0 lg:px-0">
        <table className="w-full min-w-[48rem] border-collapse text-left">
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th
                  key={column}
                  scope="col"
                  className={`pb-4 pr-6 align-bottom text-xs font-bold uppercase tracking-widest font-accent text-muted-foreground ${
                    i === 0 ? 'w-[26%]' : i === 1 ? 'w-[26%]' : 'w-[48%]'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-foreground/15">
                <th scope="row" className="py-5 pr-6 align-top text-sm font-bold leading-[1.4]">{row.name}</th>
                <td className="py-5 pr-6 align-top font-accent text-sm font-bold leading-[1.6] text-[var(--plantation)]">{row.range}</td>
                <td className="py-5 pr-6 align-top text-sm leading-[1.6] text-foreground/75">
                  {row.note}
                  {source(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/** Card de un tier. Misma anatomía que las packages de pigmento-studio, con precio por proyecto en vez de mensual. */
function TierCard({
  tier,
  labels,
  wide = false,
}: {
  wide?: boolean
  tier: TierView
  labels: {
    diff: string
    rationale: string
    scope: string
    includes: string
    limits: string
    featured: string
    excludes: string
    recurring: string
    suggested: string
    margin: string
    suggestedMin: string
    suggestedTarget: string
  }
}) {
  const identity = (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{tier.label}</span>
        {tier.featured && (
          <span className="rounded-full border border-current/25 px-2.5 py-1 text-2xs font-accent uppercase tracking-[0.12em] opacity-80">
            {labels.featured}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-extrabold leading-[0.94] tracking-[-0.03em]">{tier.name}</h3>

      <div className="mt-5 flex items-end gap-2">
        <NumberOdometer
          items={[{ value: tier.priceValue }]}
          numberClassName="font-display text-[2.25rem] font-extrabold leading-none tracking-[-0.03em]"
        />
        <span className="pb-1 text-xs font-accent uppercase tracking-wide opacity-60">{tier.priceUnit}</span>
      </div>
      <p className="mt-1.5 text-xs font-medium opacity-75">{tier.timeline}</p>

      {/* Sugerencia de reventa: es una nota para Pigmento, así que se separa con
          un relleno de su propia tinta y no con el peso del precio real. */}
      <div className="mt-5 rounded-xl bg-current/10 px-4 py-3.5">
        <span className="block text-2xs font-accent uppercase tracking-[0.12em] opacity-60">{labels.suggested}</span>
        <p className="mt-1 text-sm font-bold leading-tight">{tier.suggestedValue}</p>
        <span className="mt-2.5 block text-2xs font-accent uppercase tracking-[0.12em] opacity-60">{labels.margin}</span>
        <p className="mt-1 text-xs font-bold leading-tight">{tier.marginValue}</p>
      </div>
    </div>
  )

  const promise = (
    <div className="flex flex-col">
      <p className="text-sm font-medium leading-relaxed opacity-95">{tier.tagline}</p>

      {/* El caso de negocio: por qué este paquete se paga solo, o dónde deja
          de hacerlo. Es lo que Pigmento repite cuando le preguntan el precio. */}
      <div className="mt-5 border-t border-current/15 pt-4">
        <span className="block text-2xs font-accent uppercase tracking-[0.12em] opacity-60">{labels.rationale}</span>
        <p className="mt-2 text-sm leading-[1.55] opacity-85">{tier.rationale}</p>
      </div>
    </div>
  )

  const difference = (
    <div className="flex flex-col">
      <span className="block text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{labels.diff}</span>
      <dl className="mt-3 border-t border-current/15">
        {tier.diff.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5 border-b border-current/15 py-2.5 sm:flex-row sm:gap-4">
            <dt className="text-2xs font-accent uppercase tracking-[0.1em] opacity-55 sm:w-[42%] sm:shrink-0">{item.label}</dt>
            <dd className="text-xs font-bold leading-[1.5] opacity-90">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )

  return (
    <div className="flex">
      <div
        style={
          {
            background: tier.gradient.bg,
            color: tier.gradient.text,
          } as React.CSSProperties
        }
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl p-8 ${
          tier.featured ? 'shadow-2xl' : 'shadow-lg'
        }`}
      >
        {/* A lo ancho la card se reparte en tres columnas. Apilar identidad y
            promesa en una sola dejaba la columna de la diferencia corta y con
            un hueco debajo. */}
        {wide ? (
          <div className="mb-8 grid gap-10 lg:grid-cols-[0.9fr_1fr_1.1fr] lg:gap-12">
            {identity}
            {promise}
            {difference}
          </div>
        ) : (
          <div className="mb-8 flex flex-col gap-6">
            {identity}
            {promise}
            {difference}
          </div>
        )}

        {/* El alcance completo se pliega. La card vende con precio, diferencia y
            caso de negocio; el detalle se abre solo cuando lo piden. */}
        <details className="group mt-auto border-t border-current/15">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-2xs font-accent uppercase tracking-[0.12em] opacity-70 transition-opacity hover:opacity-100 [&::-webkit-details-marker]:hidden">
            {labels.scope}
            <span aria-hidden className="text-base leading-none transition-transform duration-200 group-open:rotate-45">
              +
            </span>
          </summary>

          <div className={wide ? 'grid gap-8 lg:grid-cols-2 lg:gap-12' : ''}>
            <div>
              <span className="block text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{labels.includes}</span>
              <ul className="mt-3 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm font-medium leading-[1.45]">
                    <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                    <span className="opacity-85">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={wide ? '' : 'mt-6'}>
              {/* Los límites son el campo que distingue un tier del siguiente. */}
              <div className="border-t border-current/15 pt-4">
                <span className="block text-2xs font-accent uppercase tracking-[0.12em] opacity-60">{labels.limits}</span>
                <p className="mt-2 text-xs leading-[1.6] opacity-70">{tier.limits}</p>
              </div>

              {/* Costo recurrente: infraestructura que el cliente paga directo a
                  cada proveedor. No pasa por Pigmento ni lleva margen. */}
              <div className="mt-4 border-t border-current/15 pt-4">
                <span className="block text-2xs font-accent uppercase tracking-[0.12em] opacity-60">{labels.recurring}</span>
                <p className="mt-2 text-xs leading-[1.6] opacity-70">{tier.recurring}</p>
              </div>

              {/* Exclusiones: la lista que protege el precio cuando el alcance crece. */}
              <div className="mt-4 border-t border-current/15 pt-4">
                <span className="block text-2xs font-accent uppercase tracking-[0.12em] opacity-60">{labels.excludes}</span>
                <ul className="mt-2 space-y-1.5">
                  {tier.excludes.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-[1.5] opacity-60">
                      <span aria-hidden className="mt-[0.55em] h-px w-2 shrink-0 bg-current" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-5 border-t border-current/15 pt-4 text-2xs font-accent uppercase tracking-[0.08em] opacity-70">
            {tier.audience}
          </p>
        </details>
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
    title: t('proposalsMoeasy_title'),
    description: t('proposalsMoeasy_description'),
    alternates: buildAlternates(locale, '/proposals/moeasy'),
    authors: [{ name: SITE_AUTHOR.name }],
    openGraph: {
      type: 'website',
      url: localizedPath(locale, '/proposals/moeasy'),
      title: t('proposalsMoeasy_title'),
      description: t('proposalsMoeasy_description'),
      images: defaultOgImages(t('proposalsMoeasy_title')),
    },
    twitter: {
      title: t('proposalsMoeasy_title'),
      description: t('proposalsMoeasy_description'),
    },
  }
}

export default async function ProposalsMoeasyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('proposalsMoeasy')

  const heroLines = t.raw('hero_lines') as string[]
  const marqueeServices = t.raw('marquee_services') as string[]
  const situacionBullets = t.raw('situacion_bullets') as string[]
  const problems = t.raw('problems') as MoeasyProblem[]
  const whyProduct = t.raw('why_product') as WhyPoint[]
  const whyPigmento = t.raw('why_pigmento') as WhyPoint[]
  const marketStats = t.raw('market_stats') as MarketStat[]
  const agencyRows = t.raw('agency_rows') as PriceRow[]
  const membershipRows = t.raw('membership_rows') as PriceRow[]
  const infraRows = t.raw('infra_rows') as PriceRow[]
  const alternativeRows = t.raw('alternatives_rows') as AlternativeRow[]
  const chooseTree = t.raw('choose_tree') as DecisionBranch[]
  const objectionRows = t.raw('objections_rows') as ObjectionRow[]
  const objectionColumns = t.raw('objections_columns') as string[]
  const governanceItems = t.raw('governance_items') as string[]
  const alternativeColumns = t.raw('alternatives_columns') as string[]
  const scopePages = t.raw('scope_pages') as ScopePage[]
  const solutions = t.raw('solutions') as Solution[]
  const marginItems = t.raw('margin_items') as MarginItem[]
  const terms = t.raw('pricing_terms') as string[]

  // Precio formateado (MXN, separador de miles) fusionado por índice con la
  // presentación de content/proposals.ts, igual que en ronda01-pigmento.
  const priceUnit = t('tiers_price_unit')
  const fmtMxn = (n: number) => '$' + n.toLocaleString('en-US')
  const tiers: TierView[] = (t.raw('tiers') as ProposalTierText[]).map((tier, i) => ({
    ...tier,
    ...MOEASY_TIER_PRESENTATION[i],
    priceValue: fmtMxn(MOEASY_TIER_PRESENTATION[i].price),
    priceUnit,
    suggestedValue: `${fmtMxn(MOEASY_TIER_PRESENTATION[i].suggestedMin)} a ${fmtMxn(MOEASY_TIER_PRESENTATION[i].suggestedTarget)}`,
    marginValue: (() => {
      const { price, suggestedMin, suggestedTarget } = MOEASY_TIER_PRESENTATION[i]
      const pct = (n: number) => Math.round(((n - price) / price) * 100)
      return `${fmtMxn(suggestedMin - price)} a ${fmtMxn(suggestedTarget - price)} · ${pct(suggestedMin)}% a ${pct(suggestedTarget)}%`
    })(),
  }))

  const tierCardLabels = {
    diff: t('tiers_diff_label'),
    rationale: t('tiers_rationale_label'),
    scope: t('tiers_scope_label'),
    includes: t('tiers_includes_label'),
    limits: t('tiers_limits_label'),
    featured: t('tiers_featured_label'),
    excludes: t('tiers_excludes_label'),
    recurring: t('tiers_recurring_label'),
    margin: t('tiers_margin_label'),
    suggested: t('tiers_suggested_label'),
    suggestedMin: t('tiers_suggested_min'),
    suggestedTarget: t('tiers_suggested_target'),
  }

  return (
    <div id="proposals-moeasy-page" data-semantic-role="services" data-llm-context="professional-services-offering">
      <AccordionCssInit />
      {/* Hero — bg surface (token más oscuro) + maquetación MWG 041: lista interactiva */}
      <section
        data-semantic-role="hero"
        data-llm-context="services-offering"
        data-theme-section="dark"
        className="relative min-h-[90vh] md:min-h-dvh px-4 lg:px-6 pt-20 overflow-hidden flex flex-col justify-center bg-surface text-surface-foreground"
      >
        <GridGuides className="z-0" />
        <CursorImageTrail images={PROPOSAL_TRAIL_SHAPES} autoIntervalMs={550} className="absolute inset-0 z-0" />
        <div
          data-reveal-group
          data-stagger="140"
          data-start="top 90%"
          data-distance="2.5em"
          className="relative z-[1] flex flex-1 flex-col items-center justify-center py-12"
        >
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
              <Button061 href="#paquetes">{t('hero_cta_primary')}</Button061>
              <Button061 href="#diagnostico" variant="secondary">{t('hero_cta_secondary')}</Button061>
            </div>
          </div>
        </div>
      </section>

      {/* Services marquee — banda separadora bajo el hero (scroll lento) */}
      <ScrollSwapMarquee items={marqueeServices} compact speed={45} />

      {/* Situación — el estado de hechos que el cliente acepta sin discutir (marco SCR).
          Maqueta a 12 columnas: el heading ocupa la izquierda, la nota de
          verificación cierra la derecha y los bullets corren a lo ancho, para
          que la columna derecha no quede vacía en desktop. */}
      <section data-theme-section="dark" className="bg-surface text-surface-foreground px-4 lg:px-6 py-14 lg:py-20">
        <Container data-reveal-group data-stagger="120" data-start="top 80%" data-distance="2.5em">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('situacion_eyebrow')}</span>
              <ScrollHighlight>
                <h2 className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight">
                  <span className="font-normal text-surface-foreground/70">{t('situacion_heading_before')}</span>
                  <span className="font-bold" data-highlight>{t('situacion_heading_highlight')}</span>
                </h2>
              </ScrollHighlight>
            </div>

            <p className="font-accent text-2xs leading-[1.8] text-surface-foreground/45 lg:col-span-4 lg:col-start-9 lg:self-end">
              {t('situacion_sub')}
            </p>
          </div>

          <div className="mt-12 h-px w-full bg-surface-foreground/15" />

          {/* Los cuatro hechos a lo ancho del contenedor, no en una columna. */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {situacionBullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8.5L6 12.5L14 3.5" stroke="var(--plantation)" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed font-medium text-surface-foreground/80">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-surface-foreground/15" />
        </Container>
      </section>

      {/* Complicación — por qué la situación exige actuar.
          El problema 04 asume que la audiencia en mandarín está en China. Si el
          cliente confirma que son inversionistas radicados en México, se
          sustituye ese item de `problems` en los messages (es el único que
          depende de ese supuesto). */}
      <section id="diagnostico" data-theme-section="dark" className="bg-surface text-surface-foreground px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container>
          <div data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('complicacion_eyebrow')}</span>
              <SectionBadge tone="client">{t('badge_client')}</SectionBadge>
            </div>
            <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.1] tracking-tight max-w-[20ch]">{t('complicacion_heading')}</h2>
            <p className="mt-6 max-w-[54rem] text-base md:text-lg leading-relaxed text-muted-foreground">{t('complicacion_sub')}</p>
          </div>

          {/* services-table: mismo grid índice / título / cuerpo de WhySection. */}
          <div data-reveal-group data-stagger="80" data-distance="1.5em" className="mt-14 services-table">
            {problems.map((problem) => (
              <div key={problem.n} className="services-table__row">
                <div className="services-table__index">
                  <span className="text-2xs font-accent text-[var(--plantation)]">{problem.n}</span>
                </div>
                <div className="services-table__title">
                  <h3 className="text-sm font-semibold text-surface-foreground">{problem.title}</h3>
                </div>
                <div className="services-table__body">
                  <span className="text-2xs font-accent tracking-wider text-[var(--plantation)]/60">{problem.tag}</span>
                  <p className="mt-1.5 text-sm leading-relaxed text-surface-foreground/60">{problem.body}</p>
                  <div className="mt-3 border-l-2 border-[var(--plantation)]/40 pl-3">
                    <span className="block text-2xs font-accent uppercase tracking-[0.12em] text-[var(--plantation)]">
                      {t('complicacion_cost_label')}
                    </span>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-surface-foreground/80">{problem.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cifras del mercado en el que opera MoEasy */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-20">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('market_stats_label')}</span>

            <div className="mt-8 grid grid-cols-1 gap-px border border-surface-foreground/15 bg-surface-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
              {marketStats.map((stat) => (
                <div key={stat.value} className="flex flex-col bg-surface p-6">
                  <p className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold leading-none tracking-[-0.03em] text-[var(--plantation)]">
                    {stat.value}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-surface-foreground/70">{stat.label}</p>
                  {stat.url ? (
                    <a
                      href={stat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 font-accent text-2xs uppercase tracking-[0.1em] text-surface-foreground/40 underline underline-offset-4 transition-colors hover:text-[var(--plantation)]"
                    >
                      {stat.source}
                    </a>
                  ) : (
                    <p className="mt-5 font-accent text-2xs uppercase tracking-[0.1em] text-surface-foreground/40">{stat.source}</p>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 w-full font-accent text-2xs leading-[1.8] text-surface-foreground/45">{t('market_stats_note')}</p>
          </div>
        </Container>
      </section>

      {/* Contexto de mercado para Pigmento — cuánto cobra la competencia nuestra,
          cuánto cuestan las membresías del sector y cuánto la infraestructura.
          Sección interna: le da a Pigmento el marco para poner su precio. */}
      <section data-theme-section="light" className="bg-background text-foreground px-4 lg:px-6 py-14 lg:py-20">
        <Container>
          <div data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('market_eyebrow')}</span>
              <SectionBadge tone="internal">{t('badge_internal')}</SectionBadge>
            </div>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight max-w-[16ch]">{t('market_heading')}</h2>
            <p className="mt-6 max-w-[54rem] text-base md:text-lg leading-relaxed text-muted-foreground">{t('market_sub')}</p>
          </div>

          {/* Agencias: con quién compite este precio */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-16">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('agency_label')}</span>
            <PriceTable columns={t.raw('agency_columns') as string[]} rows={agencyRows} sourceLabel={t('sources_label')} />
          </div>

          {/* Membresías del sector: contra qué compara el cliente */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-20">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('membership_label')}</span>
            <PriceTable columns={t.raw('membership_columns') as string[]} rows={membershipRows} sourceLabel={t('sources_label')} />
          </div>

          {/* Infraestructura: lo que el cliente paga cada mes, en cualquier ruta */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-20">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('infra_label')}</span>
            <PriceTable columns={t.raw('infra_columns') as string[]} rows={infraRows} sourceLabel={t('sources_label')} />
            <p className="mt-8 w-full font-accent text-2xs leading-[1.8] text-foreground/45">{t('infra_note')}</p>
          </div>

          {/* Alternativas evaluadas: lo que MoEasy podría comprar en vez de esto */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-20">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('alternatives_label')}</span>
            <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1.1] tracking-tight max-w-[18ch]">{t('alternatives_heading')}</h3>
            <p className="mt-4 max-w-[84ch] text-sm leading-relaxed text-foreground/70">{t('alternatives_sub')}</p>

            {/* La última fila es la propuesta: se destaca para cerrar el argumento. */}
            <ul className="mt-8 md:hidden">
              {alternativeRows.map((row, i) => {
                const isProposal = i === alternativeRows.length - 1
                return (
                  <li key={row.name} className="border-t border-foreground/15 py-5">
                    <h4 className={`text-sm font-bold leading-[1.4] ${isProposal ? 'text-[var(--plantation)]' : ''}`}>
                      {row.name}
                    </h4>
                    <p className="mt-2 font-accent text-sm font-bold leading-[1.6] text-foreground/80">{row.cost}</p>
                    <p className={`mt-2 text-sm leading-[1.6] ${isProposal ? 'font-medium text-foreground/90' : 'text-foreground/65'}`}>
                      {row.why}
                    </p>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 -mx-4 hidden overflow-x-auto px-4 md:block lg:mx-0 lg:px-0">
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead>
                  <tr>
                    {alternativeColumns.map((column, i) => (
                      <th
                        key={column}
                        scope="col"
                        className={`pb-4 pr-6 align-bottom text-xs font-bold uppercase tracking-widest font-accent text-muted-foreground ${
                          i === 0 ? 'w-[22%]' : i === 1 ? 'w-[24%]' : 'w-[54%]'
                        }`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alternativeRows.map((row, i) => {
                    const isProposal = i === alternativeRows.length - 1
                    return (
                      <tr key={row.name} className="border-t border-foreground/15">
                        <th
                          scope="row"
                          className={`py-6 pr-6 align-top text-sm font-bold leading-[1.35] ${
                            isProposal ? 'text-[var(--plantation)]' : 'text-foreground'
                          }`}
                        >
                          {row.name}
                        </th>
                        <td className="py-6 pr-6 align-top font-accent text-sm font-bold leading-[1.6] text-foreground/80">
                          {row.cost}
                        </td>
                        <td
                          className={`py-6 pr-6 align-top text-sm leading-[1.55] ${
                            isProposal ? 'font-medium text-foreground/90' : 'text-foreground/65'
                          }`}
                        >
                          {row.why}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* Por qué esto y por qué Pigmento — la lógica comercial detrás de la
          propuesta. Alineado a la izquierda, como el resto de la página. */}
      <section data-theme-section="dark" className="bg-surface text-surface-foreground px-4 lg:px-6 py-14 lg:py-20">
        <Container>
          <div data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('why_eyebrow')}</span>
            <div data-ignore="true">
              <h2
                data-split="heading"
                data-split-reveal="words"
                className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight max-w-[20ch]"
              >
                {t('why_heading')}
              </h2>
            </div>
            <p className="mt-6 max-w-[54rem] text-base md:text-lg leading-relaxed text-muted-foreground">{t('why_sub')}</p>
          </div>

          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-2">
            {[
              { label: t('why_product_label'), points: whyProduct },
              { label: t('why_pigmento_label'), points: whyPigmento },
            ].map((column) => (
              <div key={column.label}>
                <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{column.label}</span>
                <div className="mt-6">
                  {column.points.map((point, i) => (
                    <div
                      key={point.title}
                      className={`py-5 ${i === 0 ? 'pt-0' : 'border-t border-surface-foreground/15'}`}
                    >
                      <h3 className="font-display text-[clamp(1.05rem,1.6vw,1.35rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
                        {point.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-surface-foreground/70">{point.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </Container>
      </section>

      {/* La solución — cada pieza ligada a la falla que resuelve y a lo que se
          espera de ella. Va sin lenguaje técnico: la lee Pigmento y la lee el
          cliente. */}
      <section id="solucion" data-theme-section="dark" className="bg-surface text-surface-foreground px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container>
          <div data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('scope_eyebrow')}</span>
              <SectionBadge tone="client">{t('badge_client')}</SectionBadge>
            </div>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight max-w-[18ch]">{t('scope_heading')}</h2>
            <p className="mt-6 max-w-[54rem] text-base md:text-lg leading-relaxed text-muted-foreground">{t('scope_sub')}</p>
          </div>

          {/* Falla, solución y pronóstico: el orden importa, es el argumento. */}
          <div data-reveal-group data-stagger="80" data-distance="1.5em" className="mt-16">
            {solutions.map((solution, i) => (
              <div
                key={solution.title}
                className={`grid grid-cols-1 gap-x-12 gap-y-6 py-10 lg:grid-cols-12 ${
                  i === 0 ? 'border-t border-surface-foreground/15 pt-10' : 'border-t border-surface-foreground/15'
                }`}
              >
                <div className="lg:col-span-5">
                  <span className="font-accent text-2xs uppercase tracking-[0.12em] text-[var(--plantation)]">
                    {t('scope_answers_label')} {solution.answers}
                  </span>
                  <h3 className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
                    {solution.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-surface-foreground/70">{solution.body}</p>
                </div>

                <div className="lg:col-span-6 lg:col-start-7">
                  <span className="font-accent text-2xs uppercase tracking-[0.12em] text-surface-foreground/45">
                    {t('scope_forecast_label')}
                  </span>
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-surface-foreground/85">{solution.forecast}</p>
                  {solution.url && (
                    <a
                      href={solution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block font-accent text-2xs uppercase tracking-[0.1em] text-surface-foreground/40 underline underline-offset-4 transition-colors hover:text-[var(--plantation)]"
                    >
                      {t('sources_label')}: {solution.source}
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t border-surface-foreground/15" />
          </div>

          {/* Lo que incluye el sitio */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-20">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('scope_pages_label')}</span>
            <div className="mt-6 services-table">
              {scopePages.map((page, i) => (
                <div key={page.name} className="services-table__row">
                  <div className="services-table__index">
                    <span className="text-2xs font-accent text-[var(--plantation)]">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="services-table__title">
                    <h3 className="text-sm font-semibold text-surface-foreground">{page.name}</h3>
                  </div>
                  <div className="services-table__body">
                    <p className="text-sm leading-relaxed text-surface-foreground/60">{page.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </Container>
      </section>

      {/* Áreas de margen — card full-width dirigida a Pigmento, no a MoEasy */}
      <section data-theme-section="dark" className="bg-surface text-surface-foreground px-4 lg:px-6 py-14 lg:py-20">
        <Container>
          <div data-reveal-group data-stagger="80" data-distance="1.5em">
            <div className="flex">
              <div
                style={
                  {
                    background: MARGIN_CARD_GRADIENT.bg,
                    color: MARGIN_CARD_GRADIENT.text,
                  } as React.CSSProperties
                }
                className="relative flex w-full flex-col gap-8 overflow-hidden rounded-2xl p-8 shadow-lg lg:flex-row lg:gap-12"
              >
                <div className="flex flex-col lg:w-2/5 lg:shrink-0">
                  <span className="inline-block self-start border border-current/40 px-2 py-1 text-2xs font-bold uppercase tracking-widest leading-none font-accent opacity-80">
                    {t('badge_internal')}
                  </span>
                  <span className="mt-4 text-2xs font-accent uppercase tracking-[0.14em] opacity-70">{t('margin_label')}</span>
                  <h2 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em]">
                    {t('margin_title')}
                  </h2>
                  <p className="mt-5 text-sm font-medium leading-relaxed opacity-95">{t('margin_tagline')}</p>
                </div>

                <div className="flex flex-1 flex-col">
                {/* Accordion CSS: la apertura la anima grid-template-rows en
                    globals.css, el click solo alterna data-accordion-status. */}
                <div data-accordion-css-init data-accordion-close-siblings="true">
                  <ul className="accordion-css__list">
                    {marginItems.map((item, i) => (
                      <li key={item.name} data-accordion-status="not-active" className="accordion-css__item">
                        {/* El botón va dentro del heading: es el patrón de accordion
                            de WAI-ARIA y deja el título en el árbol de encabezados. */}
                        <h3 className="m-0">
                          <button
                            type="button"
                            data-accordion-toggle
                            aria-expanded="false"
                            aria-controls={`margin-panel-${i}`}
                            className="accordion-css__item-top"
                          >
                            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                              <span className="text-sm font-bold leading-[1.35]">{item.name}</span>
                              <span className="font-accent text-2xs uppercase tracking-[0.08em] opacity-70">{item.reference}</span>
                            </span>
                            <span aria-hidden className="accordion-css__item-icon">
                              <svg className="accordion-css__item-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
                                <path d="M28.5 22.5L18 12L7.5 22.5" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" />
                              </svg>
                            </span>
                          </button>
                        </h3>
                        <div id={`margin-panel-${i}`} className="accordion-css__item-bottom">
                          <div className="accordion-css__item-bottom-wrap">
                            <div className="accordion-css__item-bottom-content">
                              <p className="text-sm leading-[1.5] opacity-75">{item.pitch}</p>
                              <p className="mt-2 font-accent text-2xs uppercase tracking-[0.08em] opacity-55">{item.trigger}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Los tres paquetes */}
      <section id="paquetes" data-theme-section="dark" className="bg-surface text-surface-foreground px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container>
          <div
            data-reveal-group
            data-stagger="90"
            data-start="top 82%"
            data-distance="2em"
            className="flex flex-col items-center gap-6 text-center"
          >
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('tiers_eyebrow')}</span>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight max-w-[16ch]">{t('tiers_heading')}</h2>
            <p className="max-w-[54rem] text-base md:text-lg leading-relaxed text-muted-foreground">{t('tiers_subtitle')}</p>
          </div>

          {/* 3 columnas ≥1024; apilado abajo. No usa PackagesCarousel: está
              tipado contra ProposalPackageView (precio mensual, proyectos
              incluidos) y no aplica a un precio por proyecto. */}
          {/* Dos cards por fila y la recomendada a lo ancho: con siete features
              y sus exclusiones, en tres columnas se aplastaba. */}
          <div data-reveal-group data-stagger="80" data-distance="1.5em" className="mt-16 grid grid-cols-1 gap-6 items-stretch lg:grid-cols-2">
            {tiers.slice(0, 2).map((tier) => (
              <TierCard key={tier.name} tier={tier} labels={tierCardLabels} />
            ))}
          </div>

          <div data-reveal-group data-stagger="80" data-distance="1.5em" className="mt-6">
            <TierCard tier={tiers[2]} labels={tierCardLabels} wide />
          </div>

          {/* Lo que va en los tres, para no repetirlo card por card */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-14">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[var(--plantation)]">{t('tiers_common_label')}</span>
            <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
              {(t.raw('tiers_common') as string[]).map((item) => (
                <div key={item} className="flex items-start gap-3 border-t border-surface-foreground/15 pt-4">
                  <span aria-hidden className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 8.5L6 12.5L14 3.5" stroke="var(--plantation)" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-surface-foreground/75">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cómo elegir: se lee con los precios enfrente, no en una strip aparte. */}
          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-14">
            <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.875rem)] font-extrabold leading-[1.05] tracking-[-0.02em] max-w-[22ch]">
              {t('choose_tree_label')}
            </h3>
            <div className="mt-8 grid grid-cols-1 gap-px border border-surface-foreground/15 bg-surface-foreground/15 md:grid-cols-2 lg:grid-cols-4">
              {chooseTree.map((branch) => (
                <div key={branch.condition} className="flex flex-col justify-between gap-4 bg-surface p-6">
                  <p className="text-sm leading-relaxed text-surface-foreground/70">{branch.condition}</p>
                  <p className="font-display text-base font-extrabold leading-[1.15] tracking-[-0.02em] text-[var(--plantation)]">
                    {branch.result}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 w-full font-accent text-2xs leading-[1.8] text-surface-foreground/45">{t('choose_note')}</p>
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-3 font-accent text-2xs leading-[1.8] text-surface-foreground/45">
            <SectionBadge tone="internal">{t('badge_internal')}</SectionBadge>
            <span>{t('tiers_suggested_note')}</span>
          </p>

          {/* Condiciones plegadas: son contractuales y hay que tenerlas, pero
              apiladas a la vista eran el muro que enterraba a los paquetes. */}
          <details className="group mt-6 border-t border-surface-foreground/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-accent text-2xs font-bold uppercase tracking-widest text-surface-foreground/65 transition-colors hover:text-surface-foreground [&::-webkit-details-marker]:hidden">
              {t('pricing_terms_heading')}
              <span aria-hidden className="text-base leading-none transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>

            <ul className="space-y-2 pb-2">
              {terms.map((term) => (
                <li key={term} className="font-accent text-2xs leading-[1.8] text-surface-foreground/55">
                  {term}
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-surface-foreground/15 pt-4 font-accent text-2xs leading-[1.8] text-surface-foreground/55">
              <span className="font-bold uppercase tracking-widest text-surface-foreground/65">{t('governance_heading')}:</span>{' '}
              {governanceItems.join('  ·  ')}
            </p>
          </details>

        </Container>
      </section>

      {/* Manejo de objeciones — cada objeción con su respuesta y la concesión
          que recorta alcance en vez de precio. */}
      <section data-theme-section="light" className="bg-background text-foreground px-4 lg:px-6 py-14 lg:py-20">
        <Container>
          <div data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">{t('objections_eyebrow')}</span>
              <SectionBadge tone="internal">{t('badge_internal')}</SectionBadge>
            </div>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight max-w-[18ch]">{t('objections_heading')}</h2>
            <p className="mt-6 max-w-[54rem] text-base md:text-lg leading-relaxed text-muted-foreground">{t('objections_sub')}</p>
          </div>

          <div data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-14">
            <ul className="md:hidden">
              {objectionRows.map((row) => (
                <li key={row.objection} className="border-t border-foreground/15 py-5">
                  <h3 className="text-sm font-bold leading-[1.4]">{row.objection}</h3>
                  <p className="mt-1 text-2xs font-accent uppercase tracking-[0.1em] text-muted-foreground">{objectionColumns[1]}</p>
                  <p className="mt-1.5 text-sm leading-[1.55] text-foreground/80">{row.response}</p>
                  <p className="mt-3 text-2xs font-accent uppercase tracking-[0.1em] text-muted-foreground">{objectionColumns[2]}</p>
                  <p className="mt-1.5 text-sm leading-[1.55] text-[var(--plantation)]">{row.concession}</p>
                </li>
              ))}
            </ul>

            <div className="-mx-4 hidden overflow-x-auto px-4 md:block lg:mx-0 lg:px-0">
              <table className="w-full min-w-[54rem] border-collapse text-left">
                <thead>
                  <tr>
                    {objectionColumns.map((column, i) => (
                      <th
                        key={column}
                        scope="col"
                        className={`pb-4 pr-6 align-bottom text-xs font-bold uppercase tracking-widest font-accent text-muted-foreground ${
                          i === 0 ? 'w-[20%]' : i === 1 ? 'w-[48%]' : 'w-[32%]'
                        }`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {objectionRows.map((row) => (
                    <tr key={row.objection} className="border-t border-foreground/15">
                      <th scope="row" className="py-6 pr-6 align-top text-sm font-bold leading-[1.35]">
                        {row.objection}
                      </th>
                      <td className="py-6 pr-6 align-top text-sm leading-[1.55] text-foreground/80">{row.response}</td>
                      <td className="py-6 pr-6 align-top text-sm leading-[1.55] text-[var(--plantation)]">{row.concession}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

    </div>
  )
}

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates, localizedPath } from '@/lib/seo'
import { defaultOgImages } from '@/lib/seo/metadata-helpers'
import { SITE_AUTHOR } from '@/lib/seo/site-config'
import { TRAIL_SHAPES } from '@/lib/trail-shapes'
import {
  APPROACH_STEP_SHAPES,
  GRAPH_ACCENT_COLOR,
  PARETO_CUMULATIVE,
  PARETO_EVEN,
  PAYOFF_INVESTED,
  PAYOFF_SAVED,
  type WorkflowApproachStep,
  type WorkflowLayerText,
  type WorkflowStep,
} from '@/content/workflow'
import type { ProposalService } from '@/content/proposals'
import { Container } from '@/components/ui/container'
import { GridGuides } from '@/components/ui/grid-guides'
import { Button061 } from '@/components/ui/button-061'
import { HeroHoverList } from '@/components/hero-hover-list'
import { CursorImageTrail } from '@/components/cursor-image-trail'
import { ScrollSwapMarquee } from '@/components/scroll-swap-marquee'
import { RotatingSteps } from '@/components/rotating-steps'
import { ScrollHighlight } from '@/components/scroll-highlight'
import { ArticleInlineContent } from '@/components/article-inline-content'
import { CalloutRenderer } from '@/components/blocks/callout-renderer'
import { LineGraph } from '@/components/line-graph'
import { ServicesShowcase } from '@/components/services-showcase'
import { FooterTechMarquee } from '@/components/footer-tech-marquee'
import { Mascot } from '@/components/mascot'

/**
 * Escala de texto de la página. Dos tamaños y nada más: el cuerpo de los
 * ensayos y una variante para el texto de apoyo (intros, filas, notas). Todo
 * lo que sea prosa usa uno de los dos, para que la charla se lea igual de
 * arriba a abajo.
 */
const BODY_TEXT = 'text-[clamp(1.05rem,1.7vw,1.85rem)] leading-[1.6]'
const BODY_TEXT_SUPPORT = 'text-[clamp(1rem,1.15vw,1.35rem)] leading-[1.7]'
/**
 * CalloutRenderer viene de los artículos y fija su cuerpo en `text-sm`. No se
 * toca ahí (lo consumen los posts), así que la página sube el tamaño de sus
 * párrafos a la escala de apoyo desde fuera.
 */
const CALLOUT_BODY = '[&_p]:text-[clamp(1rem,1.15vw,1.35rem)] [&_p]:leading-[1.7]'

/**
 * Párrafos largos del ensayo, a todo lo ancho. Sin el clamp de medida la línea
 * crece, así que la tipografía escala con el viewport para que siga siendo
 * pronunciable al proyectarla.
 *
 * El copy vive como texto plano con marcado inline (`==resaltado==`,
 * `**negritas**`) y ScrollHighlight anima los resaltados al scrollear, igual
 * que en /about.
 */
function ProseBlock({ paragraphs, className = '' }: { paragraphs: string[]; className?: string }) {
  return (
    <ScrollHighlight>
      <div
        data-reveal-group-nested
        data-stagger="80"
        data-distance="1.25em"
        className={`w-full ${className}`}
      >
        {paragraphs.map((paragraph, i) => (
          <p
            key={paragraph.slice(0, 40)}
            className={`${BODY_TEXT} text-surface-foreground/80 ${i === 0 ? '' : 'mt-10'}`}
          >
            <ArticleInlineContent value={paragraph} />
          </p>
        ))}
      </div>
    </ScrollHighlight>
  )
}

/** Statement a tamaño display: el gancho y el cierre de la charla. */
function StatementBlock({ text, className = '' }: { text: string; className?: string }) {
  return (
    <ScrollHighlight>
      <p
        className={`font-display text-[clamp(1.75rem,4.5vw,4rem)] font-bold leading-[1.15] tracking-tight ${className}`}
      >
        <ArticleInlineContent value={text} />
      </p>
    </ScrollHighlight>
  )
}

/**
 * Capa reutilizable. La fila enfrenta lo que costó construir con lo que ahorra
 * cada vez: es el mismo argumento de la gráfica de payoff, sin números.
 */
function LayerRow({
  layer,
  index,
  payoffLabel,
}: {
  layer: WorkflowLayerText
  index: number
  payoffLabel: string
}) {
  return (
    <li className={`grid gap-4 py-8 lg:grid-cols-[4rem_1fr_16rem] lg:gap-10 ${index === 0 ? '' : 'border-t border-border'}`}>
      <span className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-extrabold leading-none tracking-[-0.03em] text-muted-foreground/50">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div>
        <h3 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {layer.title}
        </h3>
        <p className={`mt-3 max-w-[60ch] ${BODY_TEXT_SUPPORT} text-surface-foreground/75`}>
          {layer.body}
        </p>
      </div>

      <div className="lg:text-right">
        <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
          {payoffLabel}
        </span>
        <p className={`mt-2 ${BODY_TEXT_SUPPORT} font-bold text-[var(--plantation)]`}>{layer.payoff}</p>
      </div>
    </li>
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
    title: t('workflow_title'),
    description: t('workflow_description'),
    alternates: buildAlternates(locale, '/workflow'),
    authors: [{ name: SITE_AUTHOR.name }],
    openGraph: {
      type: 'website',
      url: localizedPath(locale, '/workflow'),
      title: t('workflow_title'),
      description: t('workflow_description'),
      images: defaultOgImages(t('workflow_title')),
    },
    twitter: {
      title: t('workflow_title'),
      description: t('workflow_description'),
    },
  }
}

export default async function WorkflowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('workflow')

  const heroLines = t.raw('hero_lines') as string[]
  const principles = t.raw('marquee_principles') as string[]
  const riskBody = t.raw('risk_body') as string[]
  const filterIntro = t.raw('filter_intro') as string[]
  const paretoLabels = t.raw('pareto_graph_labels') as string[]
  const payoffLabels = t.raw('payoff_graph_labels') as string[]
  const steps = t.raw('process') as WorkflowStep[]
  const toolsetIntro = t.raw('toolset_intro') as string[]
  const layers = t.raw('toolset_layers') as WorkflowLayerText[]
  const tools = t.raw('tools_showcase') as ProposalService[]
  const approachSteps = t.raw('approach_steps') as WorkflowApproachStep[]

  return (
    <div id="workflow-page" data-semantic-role="about" data-llm-context="how-i-work">
      {/* Hero — misma maquetación que las propuestas (MWG 041: lista interactiva) */}
      <section
        data-semantic-role="hero"
        data-llm-context="how-i-work"
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
          <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center">
            <HeroHoverList items={heroLines} />
            <p className={`mt-8 w-full text-center ${BODY_TEXT_SUPPORT} text-surface-foreground/70`}>
              {t('hero_subtitle')}
            </p>
            <div
              data-reveal-group-nested
              data-stagger="90"
              data-distance="1.5em"
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              <Button061 href="#filtro">{t('hero_cta_primary')}</Button061>
              <Button061 href="#toolset" variant="secondary">{t('hero_cta_secondary')}</Button061>
            </div>
          </div>
        </div>
      </section>

      {/* Statement — la tesis a tamaño display, dentro del Container como el
          resto de la página. */}
      <section data-theme-section="dark" className="px-4 lg:px-6 py-28 lg:py-40">
        <Container data-reveal-group data-stagger="140" data-start="top 78%" data-distance="2.5em">
          <StatementBlock text={t('statement')} />
          <p className={`mt-12 max-w-[52ch] ${BODY_TEXT_SUPPORT} text-muted-foreground`}>
            {t('statement_sub')}
          </p>
        </Container>
      </section>

      {/* Principios — banda separadora (scroll lento) */}
      <ScrollSwapMarquee items={principles} compact speed={45} />

      {/* El riesgo — ensayo largo: por qué la velocidad puede costarnos el criterio */}
      <section data-theme-section="dark" className="px-4 lg:px-6 py-20 lg:py-28">
        <Container data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
          <div className="max-w-[68ch]">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
              {t('risk_eyebrow')}
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-[1.1] tracking-tight">
              {t('risk_heading')}
            </h2>
          </div>

          <ProseBlock paragraphs={riskBody} className="mt-12" />

          <div className={`mt-12 max-w-[68ch] ${CALLOUT_BODY}`}>
            <CalloutRenderer type="tip" title={t('risk_callout_title')} text={t('risk_callout_body')} />
          </div>
        </Container>
      </section>

      {/* El filtro — Pareto explicado, y luego las cinco preguntas en flip 3D.
          El pin solo corre ≥1200px; abajo cae al fallback apilado. */}
      <section id="filtro" data-theme-section="dark" className="px-4 lg:px-6 pt-20 lg:pt-28 scroll-mt-20">
        <Container data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
          <div className="max-w-[68ch]">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
              {t('filter_eyebrow')}
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-[1.1] tracking-tight">
              {t('filter_heading')}
            </h2>
          </div>

          <ProseBlock paragraphs={filterIntro} className="mt-10" />

          {/* Las dos preguntas de Pareto, en gráfica: dónde se concentra el
              tiempo, y cuándo se paga lo que se construye. */}
          <div className="mt-16 grid grid-cols-1 gap-8 xl:grid-cols-2">
            <LineGraph
              title={t('pareto_graph_title')}
              hint={t('pareto_graph_hint')}
              suffix="%"
              min={0}
              max={100}
              steps={4}
              series={[
                {
                  key: 'real',
                  label: t('pareto_graph_series_real'),
                  legendLabel: t('pareto_graph_series_real_legend'),
                  color: GRAPH_ACCENT_COLOR,
                },
                {
                  key: 'even',
                  label: t('pareto_graph_series_even'),
                  legendLabel: t('pareto_graph_series_even_legend'),
                },
              ]}
              points={paretoLabels.map((label, i) => ({
                label,
                values: { real: PARETO_CUMULATIVE[i], even: PARETO_EVEN[i] },
              }))}
            />

            <LineGraph
              title={t('payoff_graph_title')}
              hint={t('payoff_graph_hint')}
              steps={4}
              series={[
                {
                  key: 'saved',
                  label: t('payoff_graph_series_saved'),
                  legendLabel: t('payoff_graph_series_saved_legend'),
                  color: GRAPH_ACCENT_COLOR,
                },
                {
                  key: 'cost',
                  label: t('payoff_graph_series_cost'),
                  legendLabel: t('payoff_graph_series_cost_legend'),
                },
              ]}
              points={payoffLabels.map((label, i) => ({
                label,
                values: { saved: PAYOFF_SAVED[i], cost: PAYOFF_INVESTED[i] },
              }))}
            />
          </div>

          <p className="mt-20 text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
            {t('filter_steps_label')}
          </p>
        </Container>
      </section>

      <RotatingSteps steps={steps} shapes={TRAIL_SHAPES} />

      {/* Toolset — lo que no se vuelve a construir: capas reutilizables, las
          herramientas de siempre y cómo se aproxima uno a un problema. */}
      <section id="toolset" data-theme-section="dark" className="px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
          <div className="max-w-[68ch]">
            <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
              {t('toolset_eyebrow')}
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
              {t('toolset_heading')}
            </h2>
          </div>

          <ProseBlock paragraphs={toolsetIntro} className="mt-10" />

          {/* Las capas: lo que costó una vez, contra lo que ahorra siempre. */}
          <p className="mt-20 text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
            {t('toolset_layers_label')}
          </p>
          <ul data-reveal-group data-stagger="70" data-distance="1.5em" className="mt-8">
            {layers.map((layer, i) => (
              <LayerRow key={layer.title} layer={layer} index={i} payoffLabel={t('toolset_payoff_label')} />
            ))}
          </ul>

          {/* El toolbox concreto vive fuera del Container: el fan hace pin de
              su propia sección, así que la de las capas cierra antes. */}
          <div className="mt-24 max-w-[68ch]">
            <p className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
              {t('tools_label')}
            </p>
            <p className={`mt-4 ${BODY_TEXT_SUPPORT} text-muted-foreground`}>
              {t('tools_intro')}
            </p>
          </div>
        </Container>
      </section>

      {/* Toolbox — fan de cards (MWG 003) ≥1200px, stack con scroll abajo */}
      <ServicesShowcase
        services={tools}
        labels={{
          eyebrow: t('tools_showcase_eyebrow'),
          heading: t('tools_showcase_heading'),
          count: t('tools_showcase_count'),
          scrollHint: t('tools_showcase_scroll_hint'),
          itemLabel: t('tools_showcase_item_label'),
          includesLabel: t('tools_showcase_includes_label'),
        }}
      />

      {/* Rail de logos — las mismas herramientas, con su marca */}
      <FooterTechMarquee />

      {/* El remate del toolbox. El statement es el encabezado de la sección y la
          mascota lo acompaña a la derecha, mirando al cursor (solo desde lg: el
          seguimiento no tiene sentido en táctil). */}
      <section data-theme-section="dark" className="px-4 lg:px-6 py-20 lg:py-28">
        <Container data-reveal-group data-stagger="110" data-start="top 85%" data-distance="2.5em">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
            <div>
              <StatementBlock text={t('toolset_statement')} className="max-w-[18ch]" />
              <div className={`mt-12 max-w-[62ch] ${CALLOUT_BODY}`}>
                <CalloutRenderer type="caution" title={t('tools_callout_title')} text={t('tools_callout_body')} />
              </div>
            </div>
            <Mascot size="clamp(13rem, 17vw, 20rem)" className="hidden lg:flex" />
          </div>
        </Container>
      </section>

      {/* La aproximación: qué pasa después de decidir que sí vale la pena */}
      <section id="aproximacion" data-theme-section="dark" className="px-4 lg:px-6 py-14 lg:py-20 scroll-mt-20">
        <Container data-reveal-group data-stagger="90" data-start="top 82%" data-distance="2em">
          <div className="max-w-[68ch]">
            <p className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
              {t('approach_label')}
            </p>
            <p className={`mt-4 ${BODY_TEXT_SUPPORT} text-muted-foreground`}>
              {t('approach_intro')}
            </p>
          </div>
          <ol
            data-reveal-group
            data-stagger="70"
            data-distance="1.5em"
            className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2"
          >
            {approachSteps.map((step, i) => (
              <li key={step.title} className="border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <img
                    src={APPROACH_STEP_SHAPES[i % APPROACH_STEP_SHAPES.length]}
                    alt=""
                    aria-hidden
                    className="h-10 w-10 shrink-0 object-contain"
                  />
                  <span className="font-accent text-2xs font-bold uppercase tracking-widest text-[var(--plantation)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[clamp(1.15rem,1.8vw,1.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className={`mt-3 max-w-[52ch] ${BODY_TEXT_SUPPORT} text-surface-foreground/75`}>
                  {step.description}
                </p>

                {/* La bajada al equipo: qué hace con ese paso alguien que no
                    va a escribir código nunca. */}
                <div className="mt-5 border-l-2 border-[var(--plantation)] pl-4">
                  <span className="font-accent text-2xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t('approach_handoff_label')}
                  </span>
                  <p className={`mt-1.5 max-w-[52ch] ${BODY_TEXT_SUPPORT} text-surface-foreground/85`}>
                    {step.handoff}
                  </p>
                </div>
              </li>
            ))}
          </ol>

        </Container>
      </section>

      {/* Cierre — la última diapositiva, sin CTA: es una charla, no una venta. */}
      <section data-theme-section="dark" className="px-4 lg:px-6 py-28 lg:py-40">
        <Container
          data-reveal-group
          data-stagger="120"
          data-start="top 82%"
          data-distance="2.5em"
          className="flex flex-col items-center text-center"
        >
          <span className="text-2xs font-bold uppercase tracking-widest font-accent text-muted-foreground">
            {t('closing_eyebrow')}
          </span>
          <StatementBlock text={t('closing_statement')} className="mt-10 max-w-[22ch]" />
          <p className={`mt-12 max-w-[60ch] ${BODY_TEXT} text-surface-foreground/80`}>
            {t('closing_body')}
          </p>
        </Container>
      </section>
    </div>
  )
}

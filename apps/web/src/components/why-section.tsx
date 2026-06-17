import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Pill } from '@/components/ui/pill'
import { Container } from '@/components/ui/container'
import { DraggableStickers } from '@/components/draggable-stickers'
import { WhyToolsMarquee } from '@/components/why-tools-marquee'
import { STICKERS } from '@/lib/constants'

const ROWS = [
  { key: 'row_1', glyph: '[ 01 ]' },
  { key: 'row_2', glyph: '// 02' },
  { key: 'row_3', glyph: '-> 03' },
  { key: 'row_4', glyph: '<> 04' },
] as const

export function WhySection() {
  const t = useTranslations('why')

  return (
    <section
      data-semantic-role="services"
      data-llm-context="capabilities-offerings"
      data-theme-section="dark"
      data-reveal-group
      className="relative bg-surface text-surface-foreground py-40"
    >
      <div data-sticker-bounds className="relative">
      <DraggableStickers stickers={STICKERS} />
      <Container className="relative px-4 lg:px-6">
        {/* Pill */}
        <div className="text-center mb-8">
          <span className="inline-block px-2 py-1 text-2xs font-bold uppercase tracking-widest leading-none bg-[#fdf9ed] text-[#11221f] font-accent">
            {t('pill')}
          </span>
        </div>

        {/* Heading with rotating text */}
        <h2
          data-rotating-title
          data-step-duration="2"
          className="text-center text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight max-w-[24ch] mx-auto"
        >
          {t('heading_before')}
          <span
            data-rotating-words={t('rotating_words')}
            className="rotating-text__highlight"
          >
            {t('rotating_default')}
          </span>
          {t('heading_after')}
        </h2>

        {/* Divider */}
        <div className="mt-20 h-px w-full bg-[#fdf9ed]/10" />

        {/* Rows grid */}
        <div className="why-grid why-grid--dark">
          {ROWS.map(({ key, glyph }) => (
            <div key={key} className="why-grid__item">
              <span className="block mb-4 text-xs font-accent text-[var(--plantation)] tracking-wider">{glyph}</span>
              <h3 className="text-sm font-semibold mb-2 text-[#fdf9ed]">{t(`${key}_title`)}</h3>
              <p className="text-sm leading-relaxed text-[#fdf9ed]/65">{t(`${key}_body`)}</p>
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="h-px w-full bg-[#fdf9ed]/10" />
      </Container>

      {/* Tools marquee -- inline with label */}
      <Container className="relative px-4 lg:px-6 mt-12">
        <div className="flex items-center gap-4">
          <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[#fdf9ed]/30 shrink-0 flex items-center gap-2">
            {t('tools_label')} <ArrowRight className="w-3 h-3 inline" strokeWidth={1.5} />
          </span>
          <WhyToolsMarquee />
        </div>
      </Container>
      </div>

      {/* Services table */}
      <Container className="relative px-4 lg:px-6 mt-20 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-2xs font-bold uppercase tracking-widest font-accent text-[#fdf9ed]/30">
            {t('services_label')}
          </span>
          <span className="text-2xs font-accent text-[#fdf9ed]/20">01 — 06</span>
        </div>
        <div className="services-table">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <div key={n} className="services-table__row">
              <div className="services-table__index">
                <span className="text-2xs font-accent text-[var(--plantation)]">{String(n).padStart(2, '0')}</span>
              </div>
              <div className="services-table__title">
                <h3 className="text-sm font-semibold text-[#fdf9ed]">{t(`svc_${n}_title`)}</h3>
              </div>
              <div className="services-table__body">
                <span className="text-2xs font-accent tracking-wider text-[var(--plantation)]/60">{t(`svc_${n}_tags`)}</span>
                <p className="mt-1.5 text-sm leading-relaxed text-[#fdf9ed]/50">{t(`svc_${n}_body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

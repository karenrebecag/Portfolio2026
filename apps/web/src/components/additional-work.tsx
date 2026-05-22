import { useTranslations } from 'next-intl'
import { Pill } from '@/components/ui/pill'
import { Container } from '@/components/ui/container'

const QUICK_PROJECTS = [
  { number: '01', type: 'Fullstack Platform', title: 'Ingles Individual Platform', description: 'Fullstack platform managing students, teachers, and payments for 50+ English schools.', tags: ['Laravel', 'Anime.js', 'Bootstrap'], url: 'https://www.figma.com/design/wOLxrlsIUMvcRJyOzgjIoD', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/InglesIndividualFrontend.webp' },
  { number: '02', type: 'UI Prototype', title: 'JarvioAI Canvas Prototype', description: 'AI powered prototype for Amazon seller management with interactive canvas features.', tags: ['NextJS', 'AI Platform', 'Vibe Code'], url: 'https://github.com/karenrebecag/JarvioPrototype', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/ChatGPT%20Image%20Sep%2029%2C%202025%2C%2011_13_13%20AM.webp' },
  { number: '03', type: 'Complete Site', title: 'ToTou Energy Bars', description: 'UI redesign for Mexican energy bar brand with clean layout and vibrant product showcase.', tags: ['Figma', 'UI Redesign', 'Food & Beverage'], url: 'https://www.figma.com/proto/XrmpPR40YlSaTVcTuNR4Hr', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/ToYou.webp' },
  { number: '04', type: 'Complete Site', title: 'Cadence OTC', description: 'E commerce for affordable emergency contraception with nationwide store locator.', tags: ['Figma', 'Shopify', 'Healthcare'], url: 'https://www.figma.com/proto/DL7gTFQHcZpLk9qdMLnPjF', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/cadenceotp.webp' },
  { number: '05', type: 'Landing Page', title: 'Metaverse UI Dashboard', description: 'Modern data dashboard for BEDU Data Science program with clean analytics focused UI.', tags: ['Figma', 'UI Design', 'Data Science'], url: 'https://www.figma.com/design/2EkRHWv6kzGtflVeymrd52', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/metaverse.webp' },
  { number: '06', type: 'E-Commerce', title: 'Health-Ade Kombucha', description: 'Modern redesign of e commerce for a premium kombucha brand focused on gut health.', tags: ['Figma', 'Shopify', 'E-Commerce'], url: 'https://health-ade.com/', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/HealtAde.webp' },
  { number: '07', type: 'Complete Site', title: 'Ancient Tech Redesign', description: 'Complete UX/UI redesign for an AI powered tech consulting platform.', tags: ['Figma', 'Webflow', 'UI Redesign'], url: 'https://www.figma.com/design/wOLxrlsIUMvcRJyOzgjIoD', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/AncientTech.webp' },
  { number: '08', type: 'Landing Page', title: 'Zachariel Banking', description: 'Fintech waitlist landing page with signup bonus and premium banking features.', tags: ['Webflow', 'UX/UI Design', 'Fintech'], url: 'https://www.figma.com/design/B5hLcZbHpNdXNf0KZDcNEL', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/Zachariel.webp' },
  { number: '09', type: 'Community Platform', title: 'AWE MX', description: 'Global XR community platform promoting spatial computing and AI innovation in Mexico.', tags: ['Astro', 'XR Community', 'RSV'], url: 'https://awexr.mx/', image: 'https://astro-portfolio-cms-delta.vercel.app/api/media/file/AWEMX.webp' },
]

export function AdditionalWork() {
  const t = useTranslations('additional')

  return (
    <section data-theme-section="light" data-reveal-group className="px-4 lg:px-6 py-40">
      <Container>
        <div className="text-center mb-8">
          <Pill>{t('pill')}</Pill>
        </div>
        <h2
          data-split="heading"
          data-split-reveal="words"
          className="text-center text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight max-w-[22ch] mx-auto"
        >
          {t('heading')}
        </h2>
        <p className="mt-4 text-center text-sm text-muted-foreground max-w-[50ch] mx-auto">
          {t('description')}
        </p>

        <div className="additional-masonry mt-16">
          {QUICK_PROJECTS.map((item) => (
            <div key={item.number} className="additional-masonry__item" style={{ breakInside: 'avoid' }}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-card group relative overflow-hidden"
                data-cursor="Visit"
              >
                <img src={item.image} alt={item.title} className="quick-card__image" loading="lazy" />
                <div className="quick-card__overlay">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-accent text-white/40">{item.number}</span>
                      <span className="text-[10px] font-accent uppercase tracking-widest text-white/40">{item.type}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-[11px] text-white/50">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[8px] font-accent uppercase tracking-wider px-1.5 py-0.5 bg-white/10 text-white/50">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

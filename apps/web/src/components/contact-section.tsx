import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { ContactForm } from '@/components/contact-form'
import { ContactChannels } from '@/components/contact-channels'
import { Pill } from '@/components/ui/pill'

export async function ContactSection() {
  const t = await getTranslations()

  return (
    <section
      id="contact"
      data-semantic-role="contact"
      data-llm-context="contact-availability"
      data-theme-section="dark"
      data-reveal-group
      className="bg-surface text-surface-foreground py-40 lg:py-56 scroll-mt-20 overflow-hidden"
    >
      <Container className="px-4 lg:px-6">
        <div className="flex flex-col gap-16 md:grid md:grid-cols-12">
          <div className="md:col-span-4">
            <Pill>{t('contact.label')}</Pill>
            <h2 data-split="heading" data-split-reveal="words" className="mt-6 text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] max-w-[16ch]">
              {t('contact.title')}
            </h2>
            <p className="mt-4 text-sm text-surface-foreground/60 max-w-[30ch]">{t('contact.description')}</p>

            <div className="mt-8 h-px w-full bg-surface-foreground/10" />

            <ContactChannels />
          </div>

          <div className="md:col-span-8 min-w-0">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}

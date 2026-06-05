import { Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/container'
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
  { label: 'GitHub', href: 'https://github.com/karenrebecag', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282', icon: LinkedInIcon },
  { label: 'Email', href: 'mailto:karenrortizg@gmail.com', icon: Mail },
]

export async function ContactSection() {
  const t = await getTranslations()

  return (
    <section
      id="contact"
      data-semantic-role="contact"
      data-llm-context="contact-availability"
      data-theme-section="dark"
      data-reveal-group
      className="bg-surface text-surface-foreground py-40 scroll-mt-20 overflow-hidden"
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

            <div className="mt-8 flex flex-col gap-3">
              {CONTACT_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-surface-foreground/50 hover:text-surface-foreground transition-colors">
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 min-w-0">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}

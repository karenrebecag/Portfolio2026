'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { User, Mail, Phone, Globe, Heart, DollarSign, MessageSquare, Paperclip } from 'lucide-react'
import { Button061 } from '@/components/ui/button-061'

const SERVICES = [
  'UX/UI Design & Engineering',
  'Creative Frontend Development',
  'AI-Powered Automation',
  'Full-Stack & DevOps',
]

const BUDGETS = [
  '< $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $20,000',
  '> $20,000',
]

export function ContactForm() {
  const t = useTranslations('contact')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)

  function toggleService(s: string) {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Row 1: Name + Email */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="contact-label">
            <User className="w-4 h-4 inline-block" strokeWidth={1.5} />
            {t('form_name')}
          </label>
          <div className="contact-input-wrap">
            <input type="text" placeholder={t('form_name_placeholder')} className="contact-input" />
            <div className="contact-underline" />
          </div>
        </div>
        <div>
          <label className="contact-label">
            <Mail className="w-4 h-4 inline-block" strokeWidth={1.5} />
            {t('form_email')}
          </label>
          <div className="contact-input-wrap">
            <input type="email" placeholder={t('form_email_placeholder')} className="contact-input" />
            <div className="contact-underline" />
          </div>
        </div>
      </div>

      {/* Row 2: Phone + Country */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="contact-label">
            <Phone className="w-4 h-4 inline-block" strokeWidth={1.5} />
            {t('form_phone')}
          </label>
          <div className="contact-input-wrap">
            <input type="tel" placeholder={t('form_phone_placeholder')} className="contact-input" />
            <div className="contact-underline" />
          </div>
        </div>
        <div>
          <label className="contact-label">
            <Globe className="w-4 h-4 inline-block" strokeWidth={1.5} />
            {t('form_country')}
          </label>
          <div className="contact-input-wrap">
            <input type="text" placeholder={t('form_country_placeholder')} className="contact-input" />
            <div className="contact-underline" />
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <label className="contact-label">
          <Heart className="w-4 h-4 inline-block" strokeWidth={1.5} />
          {t('form_needs')}
        </label>
        <div className="flex flex-wrap gap-2 mt-3">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleService(s)}
              className={`contact-pill ${selectedServices.includes(s) ? 'is--active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="contact-label">
          <DollarSign className="w-4 h-4 inline-block" strokeWidth={1.5} />
          {t('form_budget')}
        </label>
        <div className="flex flex-wrap gap-2 mt-3">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBudget(selectedBudget === b ? null : b)}
              className={`contact-pill ${selectedBudget === b ? 'is--active' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="contact-label">
          <MessageSquare className="w-4 h-4 inline-block" strokeWidth={1.5} />
          {t('form_message')}
        </label>
        <div className="contact-input-wrap mt-3">
          <textarea
            placeholder={t('form_message_placeholder')}
            rows={4}
            className="contact-input contact-textarea"
          />
          <div className="contact-underline" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="contact-attachment">
          <Paperclip className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <div>
            <span className="text-sm font-medium">{t('form_attachment')}</span>
            <span className="block text-[10px] text-[#fdf9ed]/30 font-accent">{t('form_attachment_specs')}</span>
          </div>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
        </label>

        <Button061 href="#" className="footer-cta" onClick={(e) => e.preventDefault()}>
          {t('form_submit')}
        </Button061>
      </div>
    </form>
  )
}

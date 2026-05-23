'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { User, Mail, Phone, Globe, Heart, DollarSign, MessageSquare, Paperclip } from 'lucide-react'
import { Button061 } from '@/components/ui/button-061'
import { Chip } from '@/components/ui/chip'

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

const labelClass = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-foreground mb-3 font-accent'
const inputClass = 'w-full min-w-0 bg-transparent border-none outline-none text-surface-foreground text-sm md:text-base font-sans py-3 placeholder:text-surface-foreground/25'
const underlineClass = 'h-px w-full bg-surface-foreground/15 transition-colors duration-300 group-focus-within:bg-brand'

export function ContactForm() {
  const t = useTranslations('contact')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)

  function toggleService(s: string) {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  return (
    <form className="space-y-8 min-w-0" onSubmit={(e) => e.preventDefault()}>
      {/* Inputs 2x2 */}
      <div className="grid grid-cols-2 gap-6 max-[767px]:grid-cols-1">
        <div>
          <label className={labelClass}>
            <User className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_name')}
          </label>
          <div className="relative group">
            <input type="text" placeholder={t('form_name_placeholder')} className={inputClass} />
            <div className={underlineClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            <Mail className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_email')}
          </label>
          <div className="relative group">
            <input type="email" placeholder={t('form_email_placeholder')} className={inputClass} />
            <div className={underlineClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            <Phone className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_phone')}
          </label>
          <div className="relative group">
            <input type="tel" placeholder={t('form_phone_placeholder')} className={inputClass} />
            <div className={underlineClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            <Globe className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_country')}
          </label>
          <div className="relative group">
            <input type="text" placeholder={t('form_country_placeholder')} className={inputClass} />
            <div className={underlineClass} />
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <label className={labelClass}>
          <Heart className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {t('form_needs')}
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
          {SERVICES.map((s) => (
            <Chip key={s} active={selectedServices.includes(s)} onClick={() => toggleService(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className={labelClass}>
          <DollarSign className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {t('form_budget')}
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
          {BUDGETS.map((b) => (
            <Chip key={b} active={selectedBudget === b} onClick={() => setSelectedBudget(selectedBudget === b ? null : b)}>
              {b}
            </Chip>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>
          <MessageSquare className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {t('form_message')}
        </label>
        <div className="relative group mt-1">
          <textarea
            placeholder={t('form_message_placeholder')}
            rows={4}
            className={`${inputClass} resize-y min-h-24 max-w-full`}
          />
          <div className={underlineClass} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
        <label className="flex items-center gap-3 text-surface-foreground/50 cursor-pointer transition-colors duration-200 hover:text-surface-foreground min-w-0">
          <Paperclip className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <span className="text-sm font-medium">{t('form_attachment')}</span>
            <span className="block text-[10px] text-surface-foreground/30 font-accent">{t('form_attachment_specs')}</span>
          </div>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
        </label>

        <div className="shrink-0">
          <Button061 href="#" className="footer-cta" onClick={(e) => e.preventDefault()}>
            {t('form_submit')}
          </Button061>
        </div>
      </div>
    </form>
  )
}

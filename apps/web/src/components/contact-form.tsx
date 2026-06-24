'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { track } from '@vercel/analytics'
import { User, Mail, Phone, Globe, Heart, DollarSign, MessageSquare, Paperclip } from 'lucide-react'
import { Chip } from '@/components/ui/chip'
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

const labelClass =
  'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-foreground mb-3 font-accent'
const optionalBadgeClass =
  'ml-1.5 text-2xs font-normal normal-case tracking-normal text-surface-foreground/40'
const inputClass = 'w-full min-w-0 bg-transparent border-none outline-none text-surface-foreground text-sm md:text-base font-sans py-3 placeholder:text-surface-foreground/25'
const underlineClass = 'h-px w-full bg-surface-foreground/15 transition-colors duration-300 group-focus-within:bg-brand'

export function ContactForm() {
  const t = useTranslations('contact')
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending'>('idle')

  function toggleService(s: string) {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  async function handleSubmit(e?: React.SyntheticEvent) {
    e?.preventDefault()
    const form = formRef.current
    if (!form || status === 'sending') return

    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      country: String(fd.get('country') ?? '').trim(),
      services: selectedServices,
      budget: selectedBudget,
      message: String(fd.get('message') ?? '').trim(),
      website: String(fd.get('website') ?? ''),
    }

    if (!payload.name || !payload.email || !payload.message) {
      toast.error(t('form_error_required'))
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.ok) {
        track('contact_submit', {
          budget: selectedBudget ?? 'none',
          services: selectedServices.length > 0 ? selectedServices.join(', ') : 'none',
        })
        toast.success(t('form_success'))
        form.reset()
        setSelectedServices([])
        setSelectedBudget(null)
      } else if (json.error === 'not_configured' || json.error === 'sandbox_restricted') {
        toast.error(t('form_error_config'))
      } else if (json.error === 'rate_limited') {
        toast.error(t('form_error_rate_limited'))
      } else {
        toast.error(t('form_error'))
      }
    } catch {
      toast.error(t('form_error'))
    } finally {
      setStatus('idle')
    }
  }

  return (
    <form ref={formRef} className="space-y-8 min-w-0" onSubmit={handleSubmit}>
      {/* Honeypot — hidden from humans; bots fill it and get silently dropped. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
      />

      {/* Inputs 2x2 */}
      <div className="grid grid-cols-2 gap-6 max-[767px]:grid-cols-1">
        <div>
          <label className={labelClass}>
            <User className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_name')}
          </label>
          <div className="relative group">
            <input type="text" name="name" autoComplete="name" placeholder={t('form_name_placeholder')} className={inputClass} />
            <div className={underlineClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            <Mail className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_email')}
          </label>
          <div className="relative group">
            <input type="email" name="email" autoComplete="email" placeholder={t('form_email_placeholder')} className={inputClass} />
            <div className={underlineClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            <Phone className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_phone')}
            <span className={optionalBadgeClass}>({t('form_optional')})</span>
          </label>
          <div className="relative group">
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder={t('form_phone_placeholder')}
              className={inputClass}
            />
            <div className={underlineClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            <Globe className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {t('form_country')}
            <span className={optionalBadgeClass}>({t('form_optional')})</span>
          </label>
          <div className="relative group">
            <input
              type="text"
              name="country"
              autoComplete="country-name"
              placeholder={t('form_country_placeholder')}
              className={inputClass}
            />
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
            name="message"
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
            <span className="block text-2xs text-surface-foreground/30 font-accent">{t('form_attachment_specs')}</span>
          </div>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
        </label>

        <div className="shrink-0">
          <Button061
            type="submit"
            disabled={status === 'sending'}
            className="footer-cta disabled:pointer-events-none disabled:opacity-60"
          >
            {status === 'sending' ? t('form_sending') : t('form_submit')}
          </Button061>
        </div>
      </div>
    </form>
  )
}

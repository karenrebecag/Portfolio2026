'use client'

import { useCallback, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { initSocialShare } from '@/lib/social-share'
import { usePageInit } from '@/lib/use-page-init'
import {
  IconClipboardLink,
  IconClipboardSuccess,
  IconFacebook,
  IconLinkedIn,
  IconMail,
  IconPinterest,
  IconReddit,
  IconTelegram,
  IconWhatsApp,
  IconX,
} from '@/components/social-share-icons'

type ShareType =
  | 'clipboard'
  | 'mail'
  | 'facebook'
  | 'pinterest'
  | 'whatsapp'
  | 'reddit'
  | 'linkedin'
  | 'x'
  | 'telegram'

const SHARE_BUTTONS: { type: ShareType; label: string; icon: ReactNode; clipboardSuccess?: boolean }[] = [
  { type: 'clipboard', label: 'Copy to Clipboard', icon: <IconClipboardLink />, clipboardSuccess: true },
  { type: 'mail', label: 'Share via Mail', icon: <IconMail /> },
  { type: 'facebook', label: 'Share on Facebook', icon: <IconFacebook /> },
  { type: 'pinterest', label: 'Share on Pinterest', icon: <IconPinterest /> },
  { type: 'whatsapp', label: 'Share on WhatsApp', icon: <IconWhatsApp /> },
  { type: 'reddit', label: 'Share on Reddit', icon: <IconReddit /> },
  { type: 'linkedin', label: 'Share on LinkedIn', icon: <IconLinkedIn /> },
  { type: 'x', label: 'Share on X', icon: <IconX /> },
  { type: 'telegram', label: 'Share on Telegram', icon: <IconTelegram /> },
]

interface SocialShareProps {
  title: string
  /** Omit to use current page URL on click */
  link?: string
  heading?: string
  className?: string
}

export function SocialShare({ title, link, heading, className }: SocialShareProps) {
  const t = useTranslations('project_detail')

  usePageInit(
    useCallback(() => {
      const raf = requestAnimationFrame(() => initSocialShare())
      return () => cancelAnimationFrame(raf)
    }, []),
  )

  return (
    <div className={['social-share-wrap', className].filter(Boolean).join(' ')}>
      {heading && (
        <p className="social-share__heading text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground mb-5 w-full text-left">
          {heading}
        </p>
      )}
      <div
        data-social-share=""
        data-social-share-title={title}
        data-social-share-toast={t('link_copied')}
        {...(link ? { 'data-social-share-link': link } : {})}
        className="social-share"
      >
        {SHARE_BUTTONS.map(({ type, label, icon, clipboardSuccess }) => (
          <button
            key={type}
            type="button"
            data-social-share-type={type}
            aria-label={label}
            className="social-share__button"
          >
            <i className="social-share__icon">{icon}</i>
            {clipboardSuccess && (
              <i className="social-share__icon is--success">
                <IconClipboardSuccess />
              </i>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
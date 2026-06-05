'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

export function LocaleToggle() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="locale-toggle font-accent">
      <Link
        href={pathname}
        locale="es"
        scroll={false}
        data-no-transition
        onClick={(e) => {
          if (locale === 'es') e.preventDefault()
        }}
        className={`locale-toggle__btn${locale === 'es' ? ' is--active' : ''}`}
      >
        ES
      </Link>
      <span className="locale-toggle__sep">/</span>
      <Link
        href={pathname}
        locale="en"
        scroll={false}
        data-no-transition
        onClick={(e) => {
          if (locale === 'en') e.preventDefault()
        }}
        className={`locale-toggle__btn${locale === 'en' ? ' is--active' : ''}`}
      >
        EN
      </Link>
    </div>
  )
}
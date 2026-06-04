'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

export function LocaleToggle() {
  const locale = useLocale()
  const pathname = usePathname()

  function getHref(target: string) {
    const stripped = pathname.replace(/^\/(en|es)\/?/, '/').replace(/\/+$/, '') || '/'
    return target === 'es' ? stripped : `/en${stripped}`
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, target: string) {
    if (target === locale) {
      e.preventDefault()
      return
    }
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000`
  }

  return (
    <div className="locale-toggle font-accent">
      <a
        href={getHref('es')}
        onClick={(e) => handleClick(e, 'es')}
        className={`locale-toggle__btn${locale === 'es' ? ' is--active' : ''}`}
      >
        ES
      </a>
      <span className="locale-toggle__sep">/</span>
      <a
        href={getHref('en')}
        onClick={(e) => handleClick(e, 'en')}
        className={`locale-toggle__btn${locale === 'en' ? ' is--active' : ''}`}
      >
        EN
      </a>
    </div>
  )
}

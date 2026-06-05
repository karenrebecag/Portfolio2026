import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type ArticleNavLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

export function isExternalArticleHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:')
}

/** Spanish default locale has no prefix; normalize legacy /es/... links from markdown. */
export function normalizeArticleHref(href: string): string {
  if (isExternalArticleHref(href)) return href
  if (href === '/es') return '/'
  if (href.startsWith('/es/')) return href.slice(3) || '/'
  return href
}

export function ArticleNavLink({ href, children, className }: ArticleNavLinkProps) {
  const resolvedHref = normalizeArticleHref(href)
  const external = isExternalArticleHref(resolvedHref)
  const classes = cn('article-nav-link', className)

  if (external) {
    return (
      <a href={resolvedHref} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    )
  }

  return (
    <Link href={resolvedHref} className={classes}>
      {children}
    </Link>
  )
}
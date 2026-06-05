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

export function ArticleNavLink({ href, children, className }: ArticleNavLinkProps) {
  const external = isExternalArticleHref(href)
  const classes = cn('article-nav-link', className)

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
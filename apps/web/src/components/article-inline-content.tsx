import React from 'react'
import { parseInline, type LexicalInlineNode } from '@/lib/markdown-to-lexical'
import { ArticleNavLink } from '@/components/ui/article-nav-link'

export function renderInlineNode(node: LexicalInlineNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    let el: React.ReactNode = node.text ?? ''
    const fmt = typeof node.format === 'number' ? node.format : 0
    if (fmt & 1) el = <strong key={`b${index}`}>{el}</strong>
    if (fmt & 2) el = <em key={`i${index}`}>{el}</em>
    if (fmt & 4) el = <s key={`s${index}`}>{el}</s>
    if (fmt & 8) el = <u key={`u${index}`}>{el}</u>
    if (fmt & 16) el = <code key={`c${index}`}>{el}</code>
    if (fmt & 32) el = <sub key={`sub${index}`}>{el}</sub>
    if (fmt & 64) el = <sup key={`sup${index}`}>{el}</sup>
    return el
  }

  if (node.type === 'highlight') {
    return <mark key={index} data-highlight>{node.text}</mark>
  }

  if (node.type === 'link' || node.type === 'autolink') {
    const href = node.fields?.url || (node.url as string) || '#'
    const label = node.children?.map((c) => c.text || '').join('') || href
    return (
      <ArticleNavLink key={index} href={href}>
        {label}
      </ArticleNavLink>
    )
  }

  const children = node.children?.map((child, i) => renderInlineNode(child, i))
  return children ? <React.Fragment key={index}>{children}</React.Fragment> : null
}

/** Renders markdown inline syntax (links, bold, highlights, bare URLs) with ArticleNavLink. */
export function ArticleInlineContent({ value }: { value: string }) {
  if (!value) return null
  const nodes = parseInline(value)
  return <>{nodes.map((node, i) => renderInlineNode(node, i))}</>
}
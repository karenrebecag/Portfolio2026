import React from 'react'
import type { Block } from '@/components/blocks/types'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { ArticleNavLink } from '@/components/ui/article-nav-link'

interface LexicalNode {
  type: string
  tag?: string
  text?: string
  format?: number | string
  children?: LexicalNode[]
  url?: string
  listType?: string
  value?: number
  language?: string
  direction?: string
  indent?: number
  version?: number
  fields?: { url?: string; newTab?: boolean; linkType?: string }
  [key: string]: unknown
}

function renderNode(node: LexicalNode, index: number, blocks?: Block[]): React.ReactNode {
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

  if (node.type === 'linebreak') return <br key={index} />
  if (node.type === 'horizontalrule') return <hr key={index} />

  // Block reference — render the corresponding block component
  if (node.type === 'block-ref' && blocks) {
    const blockIndex = parseInt(node.tag || '0', 10)
    const block = blocks[blockIndex]
    if (block) return <BlockRenderer key={index} blocks={[block]} />
    return null
  }

  const children = node.children?.map((child, i) => renderNode(child, i, blocks))

  switch (node.type) {
    case 'root':
      return <div key={index}>{children}</div>

    case 'paragraph':
      if (!children || children.length === 0) return <br key={index} />
      return <p key={index}>{children}</p>

    case 'heading': {
      const Tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h2'
      const headingText = node.children?.map((c) => c.text || '').join('') || ''
      const id = headingText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      return (
        <Tag key={index} id={id}>
          {children}
        </Tag>
      )
    }

    case 'list':
      if (node.listType === 'number') {
        return <ol key={index}>{children}</ol>
      }
      return <ul key={index}>{children}</ul>

    case 'listitem':
      return <li key={index}>{children}</li>

    case 'link':
    case 'autolink': {
      const href = node.fields?.url || (node.url as string) || '#'
      return (
        <ArticleNavLink key={index} href={href}>
          {children}
        </ArticleNavLink>
      )
    }

    case 'quote':
      return <blockquote key={index}>{children}</blockquote>

    case 'indent':
      return <div key={index} className="pl-6">{children}</div>

    default:
      return children ? <>{children}</> : null
  }
}

export function RichTextRenderer({
  content,
  blocks,
}: {
  content: { root?: LexicalNode } | null
  blocks?: Block[]
}) {
  if (!content?.root) return null
  return <div className="prose">{renderNode(content.root, 0, blocks)}</div>
}

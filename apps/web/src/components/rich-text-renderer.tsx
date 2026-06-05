import React from 'react'
import type { Block } from '@/components/blocks/types'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { renderInlineNode } from '@/components/article-inline-content'
import type { LexicalInlineNode } from '@/lib/markdown-to-lexical'

interface LexicalNode extends LexicalInlineNode {
  [key: string]: unknown
}

function renderNode(node: LexicalNode, index: number, blocks?: Block[]): React.ReactNode {
  if (node.type === 'text' || node.type === 'highlight' || node.type === 'link' || node.type === 'autolink') {
    return renderInlineNode(node, index)
  }

  if (node.type === 'linebreak') return <br key={index} />
  if (node.type === 'horizontalrule') return <hr key={index} />

  if (node.type === 'block-ref' && blocks) {
    const blockIndex = parseInt(node.tag || '0', 10)
    const block = blocks[blockIndex]
    if (block) return <BlockRenderer key={index} blocks={[block]} />
    return null
  }

  const children = node.children?.map((child, i) => renderNode(child as LexicalNode, i, blocks))

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
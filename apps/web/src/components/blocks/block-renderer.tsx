import dynamic from 'next/dynamic'
import type { Block } from './types'
import { TableRenderer } from './table-renderer'
import { CalloutRenderer } from './callout-renderer'
import { DividerRenderer } from './divider-renderer'
import { ImageBlockRenderer } from './image-block-renderer'
import { CodeBlockPlaceholder, MermaidBlockPlaceholder } from './block-placeholder'
import { DirectoryTreeRenderer } from './directory-tree-renderer'

const CodeBlockRenderer = dynamic(
  () => import('./code-block-renderer').then((mod) => mod.CodeBlockRenderer),
  { loading: () => <CodeBlockPlaceholder /> },
)

const MermaidRenderer = dynamic(
  () => import('./mermaid-renderer').then((mod) => mod.MermaidRenderer),
  { loading: () => <MermaidBlockPlaceholder /> },
)

function RenderBlock({ block }: { block: Block }) {
  switch (block.blockType) {
    case 'codeBlock':
      if ((block.language as string) === 'mermaid') {
        return (
          <MermaidRenderer
            code={block.code as string}
            title={block.title as string | undefined}
          />
        )
      }
      return (
        <CodeBlockRenderer
          code={block.code as string}
          language={block.language as string}
          title={block.title as string | undefined}
        />
      )
    case 'table':
      return (
        <TableRenderer
          headers={block.headers as { label: string; _order: number }[] | undefined}
          rows={block.rows as { _order: number; cells: { value: string; _order: number }[] }[] | undefined}
        />
      )
    case 'callout':
      return (
        <CalloutRenderer
          type={block.type as string}
          title={block.title as string | undefined}
          text={block.text as string}
        />
      )
    case 'divider':
      return <DividerRenderer style={block.style as string} />
    case 'imageBlock':
      return (
        <ImageBlockRenderer
          imageUrl={block.imageUrl as string | undefined}
          imageAlt={block.imageAlt as string | undefined}
          caption={block.caption as string | undefined}
          size={block.size as string | undefined}
        />
      )
    case 'directoryTree':
      return (
        <DirectoryTreeRenderer
          code={block.code as string}
          title={block.title as string | undefined}
        />
      )
    default:
      return null
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div data-blocks>
      {blocks.map((block, i) => (
        <RenderBlock key={block.id || i} block={block} />
      ))}
    </div>
  )
}
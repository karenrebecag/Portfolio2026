// Markdown -> Lexical + Block converter for case study articles.
// Supports: headings, paragraphs, **bold**, *italic*, `code`,
// ```code fences```, > [!type] callouts, | tables |, --- dividers,
// ![alt](url) images, - bullet lists

import type { Block } from '@/components/blocks/types'

interface LexicalNode {
  type: string
  tag?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  listType?: string
  direction?: string | null
  indent?: number
  version?: number
}

export interface ParsedContent {
  lexical: { root: LexicalNode }
  blocks: Block[]
}

function parseInline(text: string): LexicalNode[] {
  const nodes: LexicalNode[] = []
  // Combined pass: **bold**, *italic*, `code`
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g
  let lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      nodes.push({ type: 'text', text: text.slice(lastIndex, m.index), format: 0, direction: null, indent: 0, version: 1 })
    }
    if (m[2]) {
      // bold
      nodes.push({ type: 'text', text: m[2], format: 1, direction: null, indent: 0, version: 1 })
    } else if (m[3]) {
      // italic
      nodes.push({ type: 'text', text: m[3], format: 2, direction: null, indent: 0, version: 1 })
    } else if (m[4]) {
      // inline code
      nodes.push({ type: 'text', text: m[4], format: 16, direction: null, indent: 0, version: 1 })
    }
    lastIndex = m.index + m[0].length
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text', text: text.slice(lastIndex), format: 0, direction: null, indent: 0, version: 1 })
  }

  return nodes.length ? nodes : [{ type: 'text', text, format: 0, direction: null, indent: 0, version: 1 }]
}

function flushParagraph(paraText: string, children: LexicalNode[]) {
  if (!paraText.trim()) return ''
  const inline = parseInline(paraText.trim())
  children.push({
    type: 'paragraph',
    children: inline,
    direction: null,
    format: 0,
    indent: 0,
    version: 1,
  })
  return ''
}

function flushList(items: string[], children: LexicalNode[]) {
  if (!items.length) return
  children.push({
    type: 'list',
    listType: 'bullet',
    children: items.map((item) => ({
      type: 'listitem',
      children: parseInline(item),
      direction: null,
      format: 0,
      indent: 0,
      version: 1,
    })),
    direction: null,
    format: 0,
    indent: 0,
    version: 1,
  })
}

function parseTable(lines: string[]): Block {
  const parseRow = (line: string) =>
    line.split('|').slice(1, -1).map((c) => c.trim())

  const headerCells = parseRow(lines[0])
  const headers = headerCells.map((label, i) => ({ label, _order: i }))
  const rows = lines.slice(2).map((line, ri) => ({
    _order: ri,
    cells: parseRow(line).map((value, ci) => ({ value, _order: ci })),
  }))

  return { blockType: 'table', headers, rows }
}

export function markdownToLexical(md: string): { root: LexicalNode } {
  const { lexical } = parseMarkdown(md)
  return lexical
}

export function parseMarkdown(md: string): ParsedContent {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const children: LexicalNode[] = []
  const blocks: Block[] = []
  let paraText = ''
  let i = 0
  let listItems: string[] = []

  while (i < lines.length) {
    const rawLine = lines[i]
    const line = rawLine.trim()

    // Blank line
    if (!line) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      i++
      continue
    }

    // Code fence
    if (line.startsWith('```')) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      const langMatch = line.match(/^```(\w*)(.*)$/)
      const language = langMatch?.[1] || 'text'
      const title = langMatch?.[2]?.trim() || undefined
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```

      const code = codeLines.join('\n')
      // Insert a placeholder node so Lexical knows where the block goes
      const blockIndex = blocks.length
      blocks.push({ blockType: 'codeBlock', code, language, title, _order: blockIndex })
      children.push({
        type: 'block-ref',
        tag: String(blockIndex),
        direction: null,
        format: 0,
        indent: 0,
        version: 1,
      })
      continue
    }

    // Callout: > [!type] text
    const calloutMatch = line.match(/^>\s*\[!(info|warning|tip|caution)\]\s*(.+)$/i)
    if (calloutMatch) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      const blockIndex = blocks.length
      blocks.push({ blockType: 'callout', type: calloutMatch[1].toLowerCase(), text: calloutMatch[2], _order: blockIndex })
      children.push({ type: 'block-ref', tag: String(blockIndex), direction: null, format: 0, indent: 0, version: 1 })
      i++
      continue
    }

    // Table (starts with |)
    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().match(/^\|[\s-:|]+\|$/)) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      const tableLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      const blockIndex = blocks.length
      blocks.push({ ...parseTable(tableLines), _order: blockIndex })
      children.push({ type: 'block-ref', tag: String(blockIndex), direction: null, format: 0, indent: 0, version: 1 })
      continue
    }

    // Horizontal rule
    if (line.match(/^-{3,}$/) || line.match(/^\*{3,}$/)) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      const blockIndex = blocks.length
      blocks.push({ blockType: 'divider', style: 'line', _order: blockIndex })
      children.push({ type: 'block-ref', tag: String(blockIndex), direction: null, format: 0, indent: 0, version: 1 })
      i++
      continue
    }

    // Image: ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      const blockIndex = blocks.length
      blocks.push({ blockType: 'imageBlock', imageAlt: imgMatch[1], imageUrl: imgMatch[2], caption: imgMatch[1], _order: blockIndex })
      children.push({ type: 'block-ref', tag: String(blockIndex), direction: null, format: 0, indent: 0, version: 1 })
      i++
      continue
    }

    // Bullet list item
    if (line.match(/^[-*]\s+/)) {
      paraText = flushParagraph(paraText, children)
      listItems.push(line.replace(/^[-*]\s+/, ''))
      i++
      continue
    }

    // Headings (h3, h2, h1)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      paraText = flushParagraph(paraText, children)
      flushList(listItems, children)
      listItems = []
      const level = headingMatch[1].length
      const tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      children.push({
        type: 'heading',
        tag,
        children: parseInline(headingMatch[2]),
        direction: null,
        format: 0,
        indent: 0,
        version: 1,
      })
      i++
      continue
    }

    // Accumulate paragraph text
    paraText += (paraText ? ' ' : '') + line
    i++
  }

  flushParagraph(paraText, children)
  flushList(listItems, children)

  return {
    lexical: {
      root: {
        type: 'root',
        children,
        direction: null,
        format: 0,
        indent: 0,
        version: 1,
      },
    },
    blocks,
  }
}

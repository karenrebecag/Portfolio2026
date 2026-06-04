// Simple Markdown → Lexical converter for placeholder case studies.
// Supports: # h1, ## h2, paragraphs, **bold**, *italic*, blank lines.
// Keeps the output compatible with the existing RichTextRenderer and custom .prose styles.

interface LexicalNode {
  type: string
  tag?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  direction?: string | null
  formatFlag?: string
  indent?: number
  version?: number
}

function parseInline(text: string): LexicalNode[] {
  const nodes: LexicalNode[] = []
  // Support **bold** and *italic* (non-nested, simple)
  const boldRe = /\*\*(.+?)\*\*/g
  const italicRe = /\*(.+?)\*/g

  let remaining = text
  let lastIndex = 0

  // First pass: bold
  const boldMatches: { index: number; length: number; content: string }[] = []
  let m: RegExpExecArray | null
  while ((m = boldRe.exec(text)) !== null) {
    boldMatches.push({ index: m.index, length: m[0].length, content: m[1] })
  }

  if (boldMatches.length === 0) {
    // Try italic on whole
    let it: RegExpExecArray | null
    while ((it = italicRe.exec(text)) !== null) {
      if (it.index > lastIndex) {
        nodes.push({ type: 'text', text: text.slice(lastIndex, it.index), format: 0, direction: null, indent: 0, version: 1 })
      }
      nodes.push({ type: 'text', text: it[1], format: 2, direction: null, indent: 0, version: 1 })
      lastIndex = it.index + it[0].length
    }
    if (lastIndex < text.length) {
      nodes.push({ type: 'text', text: text.slice(lastIndex), format: 0, direction: null, indent: 0, version: 1 })
    }
    return nodes.length ? nodes : [{ type: 'text', text, format: 0, direction: null, indent: 0, version: 1 }]
  }

  // Handle bold + fallback italic inside non-bold
  boldMatches.forEach((bm, i) => {
    if (bm.index > lastIndex) {
      const segment = text.slice(lastIndex, bm.index)
      // italic inside the segment
      let sLast = 0
      let im: RegExpExecArray | null
      while ((im = italicRe.exec(segment)) !== null) {
        if (im.index > sLast) nodes.push({ type: 'text', text: segment.slice(sLast, im.index), format: 0, direction: null, indent: 0, version: 1 })
        nodes.push({ type: 'text', text: im[1], format: 2, direction: null, indent: 0, version: 1 })
        sLast = im.index + im[0].length
      }
      if (sLast < segment.length) {
        nodes.push({ type: 'text', text: segment.slice(sLast), format: 0, direction: null, indent: 0, version: 1 })
      }
    }
    nodes.push({ type: 'text', text: bm.content, format: 1, direction: null, indent: 0, version: 1 })
    lastIndex = bm.index + bm.length
  })

  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex)
    let tLast = 0
    let im: RegExpExecArray | null
    while ((im = italicRe.exec(tail)) !== null) {
      if (im.index > tLast) nodes.push({ type: 'text', text: tail.slice(tLast, im.index), format: 0, direction: null, indent: 0, version: 1 })
      nodes.push({ type: 'text', text: im[1], format: 2, direction: null, indent: 0, version: 1 })
      tLast = im.index + im[0].length
    }
    if (tLast < tail.length) {
      nodes.push({ type: 'text', text: tail.slice(tLast), format: 0, direction: null, indent: 0, version: 1 })
    }
  }

  return nodes
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

export function markdownToLexical(md: string): { root: LexicalNode } {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const children: LexicalNode[] = []
  let paraText = ''

  for (let rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      paraText = flushParagraph(paraText, children)
      continue
    }

    if (line.startsWith('## ')) {
      paraText = flushParagraph(paraText, children)
      const text = line.slice(3).trim()
      children.push({
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text, format: 0, direction: null, indent: 0, version: 1 }],
        direction: null,
        format: 0,
        indent: 0,
        version: 1,
      })
      continue
    }

    if (line.startsWith('# ')) {
      paraText = flushParagraph(paraText, children)
      const text = line.slice(2).trim()
      children.push({
        type: 'heading',
        tag: 'h1',
        children: [{ type: 'text', text, format: 0, direction: null, indent: 0, version: 1 }],
        direction: null,
        format: 0,
        indent: 0,
        version: 1,
      })
      continue
    }

    // Accumulate paragraph text (supports soft-wrapped lines in source)
    paraText += (paraText ? ' ' : '') + line
  }

  flushParagraph(paraText, children)

  return {
    root: {
      type: 'root',
      children,
      direction: null,
      format: 0,
      indent: 0,
      version: 1,
    },
  }
}

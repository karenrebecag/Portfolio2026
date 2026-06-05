import { ArticleInlineContent } from '@/components/article-inline-content'

interface TableHeader {
  label: string
  _order: number
}

interface TableCell {
  value: string
  _order: number
}

interface TableRow {
  _order: number
  cells: TableCell[]
}

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/

function ColorSwatch({ hex }: { hex: string }) {
  return (
    <span
      className="inline-block w-4 h-4 border border-border align-middle mr-1.5 shrink-0"
      style={{ backgroundColor: hex, borderRadius: '2px' }}
      title={hex}
    />
  )
}

function CellValue({ value }: { value: string }) {
  const trimmed = value.trim()
  if (HEX_RE.test(trimmed)) {
    return (
      <span className="inline-flex items-center gap-1">
        <ColorSwatch hex={trimmed} />
        <code className="text-xs font-accent">{value}</code>
      </span>
    )
  }
  return <ArticleInlineContent value={value} />
}

export function TableRenderer({
  headers = [],
  rows = [],
}: {
  headers?: TableHeader[]
  rows?: TableRow[]
}) {
  if (!headers.length && !rows.length) return null

  return (
    <div className="my-6 overflow-hidden border border-border" style={{ borderRadius: '2px' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          {headers.length > 0 && (
            <thead>
              <tr className="bg-muted">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground whitespace-nowrap border-b border-border"
                  >
                    <ArticleInlineContent value={h.label} />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-border last:border-0"
              >
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 align-middle">
                    <CellValue value={cell.value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

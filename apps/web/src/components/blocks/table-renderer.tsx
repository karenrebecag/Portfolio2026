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
      className="inline-block w-4 h-4 rounded-sm border border-zinc-300 dark:border-zinc-600 align-middle mr-1.5 shrink-0"
      style={{ backgroundColor: hex }}
      title={hex}
    />
  )
}

function CellValue({ value }: { value: string }) {
  if (HEX_RE.test(value.trim())) {
    return (
      <span className="inline-flex items-center gap-1">
        <ColorSwatch hex={value.trim()} />
        <code className="text-xs font-mono">{value}</code>
      </span>
    )
  }
  return <>{value}</>
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
    <div className="my-6 overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          {headers.length > 0 && (
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2.5 text-left text-xs font-semibold whitespace-nowrap border-b border-zinc-300 dark:border-zinc-700"
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-zinc-200 dark:border-zinc-700 last:border-0"
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

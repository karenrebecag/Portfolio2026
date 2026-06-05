'use client'

export type DirectoryTreeGroup = {
  category: 'base' | 'sections' | 'components' | 'modules' | 'entry' | 'docs'
  path: string
  files: string[]
}

export type DirectoryTreeData = {
  root?: string
  folders: DirectoryTreeGroup[]
  entries?: DirectoryTreeGroup[]
}

const CATEGORY_LABELS: Record<DirectoryTreeGroup['category'], string> = {
  base: 'Base',
  sections: 'Sections',
  components: 'Components',
  modules: 'Modules',
  entry: 'Entry points',
  docs: 'Docs',
}

function parseTreeData(raw: string): DirectoryTreeData | null {
  try {
    return JSON.parse(raw) as DirectoryTreeData
  } catch {
    return null
  }
}

function TreeGroup({ group }: { group: DirectoryTreeGroup }) {
  return (
    <div className={`dir-tree__group dir-tree__group--${group.category}`}>
      <div className="dir-tree__group-head">
        <span className="dir-tree__badge">{CATEGORY_LABELS[group.category]}</span>
        {group.path && <code className="dir-tree__path">{group.path}</code>}
      </div>
      <ul className="dir-tree__files">
        {group.files.map((file) => (
          <li key={file}>
            <span className="dir-tree__file">{file}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DirectoryTreeRenderer({ code, title }: { code: string; title?: string }) {
  const data = parseTreeData(code.trim())

  if (!data) {
    return (
      <figure className="not-prose my-4">
        {title && <figcaption className="text-xs text-muted-foreground mb-2 font-medium">{title}</figcaption>}
        <pre className="overflow-x-auto rounded-none border border-border bg-muted p-4 text-xs font-mono text-muted-foreground">
          {code}
        </pre>
      </figure>
    )
  }

  const groups = [...(data.folders ?? []), ...(data.entries ?? [])]

  return (
    <figure className="not-prose my-6 dir-tree">
      {title && (
        <figcaption className="text-xs text-muted-foreground mb-3 font-accent uppercase tracking-wide">
          {title}
        </figcaption>
      )}
      {data.root && <div className="dir-tree__root">{data.root}</div>}
      <div className="dir-tree__grid">
        {groups.map((group) => (
          <TreeGroup key={`${group.category}-${group.path}`} group={group} />
        ))}
      </div>
    </figure>
  )
}
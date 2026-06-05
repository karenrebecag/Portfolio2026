type JsonLdScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Renders one or more JSON-LD blocks for crawlers and LLMs. */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  const blocks = Array.isArray(data) ? data : [data]

  return (
    <>
      {blocks.map((block, index) => (
        <script
          // eslint-disable-next-line react/no-danger
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
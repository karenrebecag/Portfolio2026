const sizeClasses: Record<string, string> = {
  full: 'w-full',
  medium: 'max-w-lg mx-auto',
  small: 'max-w-sm mx-auto',
}

export function ImageBlockRenderer({
  imageUrl,
  imageAlt,
  caption,
  size = 'full',
}: {
  imageUrl?: string
  imageAlt?: string
  caption?: string
  size?: string
}) {
  return (
    <figure className={`my-6 ${sizeClasses[size] ?? sizeClasses.full}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt ?? caption ?? ''}
          className="w-full object-cover"
          style={{ borderRadius: '2px' }}
        />
      ) : (
        <div className="border border-border bg-muted flex items-center justify-center p-8 text-muted-foreground text-sm" style={{ borderRadius: '2px' }}>
          No image
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-[10px] font-accent uppercase tracking-widest text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

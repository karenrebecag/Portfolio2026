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
          className="rounded-lg w-full object-cover"
        />
      ) : (
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-8 text-zinc-500 text-sm">
          No image
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

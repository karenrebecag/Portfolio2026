type HeroParallaxBgProps = {
  src: string
  alt?: string
  objectPosition?: 'bottom' | 'top' | 'right' | 'right-bottom'
  priority?: boolean
}

const OBJECT_POSITION_CLASS = {
  bottom: 'object-bottom',
  top: 'object-top',
  right: 'object-right',
  'right-bottom': 'object-right-bottom',
} as const

export function HeroParallaxBg({
  src,
  alt = '',
  objectPosition = 'bottom',
  priority = false,
}: HeroParallaxBgProps) {
  return (
    <img
      data-parallax="target"
      src={src}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={`w-full h-full object-cover ${OBJECT_POSITION_CLASS[objectPosition]}`}
    />
  )
}
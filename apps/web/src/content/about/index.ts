import { aboutContentEn } from './en'
import { aboutContentEs } from './es'
import type { AboutContent } from './types'

export function getAboutContent(locale: string): AboutContent {
  return locale === 'es' ? aboutContentEs : aboutContentEn
}

export type { AboutContent, AboutExperienceItem, AboutVolunteeringItem, AboutAlbumItem, AboutStack } from './types'
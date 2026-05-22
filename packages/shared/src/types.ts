export type ProjectStatus = 'draft' | 'published' | 'archived'

export type ProjectCategory =
  | 'web'
  | 'mobile'
  | 'design_system'
  | 'branding'
  | 'illustration'
  | 'motion'
  | 'ux_research'

export interface Project {
  id: string
  title: string
  slug: string
  status: ProjectStatus
  featured: boolean
  category: ProjectCategory
  role: string
  year?: string
  tags?: { tag: string }[]
  summary: string
  description: unknown
  liveUrl?: string
  repoUrl?: string
  coverImage?: {
    url: string
    alt: string
  }
  gallery?: {
    image: { url: string; alt: string }
    caption?: string
  }[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

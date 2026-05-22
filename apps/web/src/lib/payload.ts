import type { Project } from '@karen-portfolio/shared'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3100/api'

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
}

export async function getPublishedProjects(): Promise<Project[]> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/projects?where[status][equals]=published&sort=-publishedAt&limit=100`,
    { next: { tags: ['projects'] } },
  )

  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`)

  const data: PayloadResponse<Project> = await res.json()
  return data.docs
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/projects?where[status][equals]=published&where[featured][equals]=true&sort=-publishedAt&limit=10`,
    { next: { tags: ['projects'] } },
  )

  if (!res.ok) throw new Error(`Failed to fetch featured projects: ${res.status}`)

  const data: PayloadResponse<Project> = await res.json()
  return data.docs
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { next: { tags: ['projects'] } },
  )

  if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)

  const data: PayloadResponse<Project> = await res.json()
  return data.docs[0] ?? null
}

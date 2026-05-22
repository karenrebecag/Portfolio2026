import type { Project } from '@karen-portfolio/shared'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3100/api'

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_API_URL}/projects?where[status][equals]=published&sort=-publishedAt&limit=100`,
      { next: { tags: ['projects'] } },
    )
    if (!res.ok) return []
    const text = await res.text()
    if (text.startsWith('<')) return []
    const data: PayloadResponse<Project> = JSON.parse(text)
    return data.docs
  } catch {
    return []
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_API_URL}/projects?where[status][equals]=published&where[featured][equals]=true&sort=-publishedAt&limit=10`,
      { next: { tags: ['projects'] } },
    )
    if (!res.ok) return []
    const text = await res.text()
    if (text.startsWith('<')) return []
    const data: PayloadResponse<Project> = JSON.parse(text)
    return data.docs
  } catch {
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_API_URL}/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
      { next: { tags: ['projects'] } },
    )
    if (!res.ok) return null
    const text = await res.text()
    if (text.startsWith('<')) return null
    const data: PayloadResponse<Project> = JSON.parse(text)
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

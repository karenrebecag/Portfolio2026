export type AboutExperienceItem = {
  period: string
  title: string
  subtitle?: string
  company: string
  location: string
  highlights: string[]
}

export type AboutVolunteeringItem = {
  period: string
  title: string
  company: string
  label: string
  text: string
}

export type AboutAlbumItem = {
  title: string
  type: string
  image: string
}

export type AboutStack = Record<string, string[]>

export type AboutContent = {
  experience: AboutExperienceItem[]
  volunteering: AboutVolunteeringItem[]
  education: string[]
  stack: AboutStack
  albums: AboutAlbumItem[]
}
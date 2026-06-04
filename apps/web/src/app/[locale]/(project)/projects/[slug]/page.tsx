import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PLACEHOLDER_PROJECTS } from '@/lib/constants'
import { RichTextRenderer } from '@/components/rich-text-renderer'
import { Container } from '@/components/ui/container'
import { Button061 } from '@/components/ui/button-061'
import { ContactSection } from '@/components/contact-section'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

function findProject(slug: string) {
  return PLACEHOLDER_PROJECTS.find((p) => p.slug === slug) || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)
  if (!project) return { title: 'Not found' }
  return { title: project.title, description: project.summary }
}

export async function generateStaticParams() {
  return PLACEHOLDER_PROJECTS.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)

  const project = findProject(slug)
  const t = await getTranslations('project_detail')

  if (!project) notFound()

  if (project.status === 'archived') {
    return (
      <Container className="px-4 lg:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">{t('archived_title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('archived_text')}</p>
        <Link href="/projects" className="mt-6 inline-block text-sm underline underline-offset-4">{t('view_projects')}</Link>
      </Container>
    )
  }

  const imgSrc = project.coverImage?.url || null

  return (
    <>
    <section data-theme-section="light" className="pt-32 pb-16">
      <Container className="px-4 lg:px-6">
        <Button061 href="/#projects" arrow="left">
          {t('back')}
        </Button061>

        <header className="mt-10">
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight leading-[1.05]">{project.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="capitalize">{project.category.replace('_', ' ')}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{project.role}</span>
            {project.year && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{project.year}</span>
              </>
            )}
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="mt-5 flex gap-2 flex-wrap">
              {project.tags.map((tag) => (
                <span key={tag.tag} className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground font-accent uppercase tracking-wide">{tag.tag}</span>
              ))}
            </div>
          )}
        </header>

        {imgSrc && (
          <div className="mt-10 overflow-hidden">
            <img src={imgSrc} alt={project.coverImage?.alt || ''} className="w-full" />
          </div>
        )}

        {project.summary && (
          <p className="mt-10 text-lg leading-relaxed text-foreground/80 max-w-[60ch]">{project.summary}</p>
        )}

        <div className="mt-8 h-px w-full bg-border" />

        <div className="mt-8">
          <span className="text-[10px] font-bold uppercase tracking-widest font-accent text-muted-foreground">Caso de estudio</span>
        </div>

        <div className="mt-6 max-w-[68ch] prose">
          <RichTextRenderer content={project.description as any} />
        </div>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-12 flex gap-4">
            {project.liveUrl && (
              <Button061 href={project.liveUrl} target="_blank" rel="noopener noreferrer">{t('live')}</Button061>
            )}
            {project.repoUrl && (
              <Button061 href={project.repoUrl} target="_blank" rel="noopener noreferrer" variant="secondary">{t('repo')}</Button061>
            )}
          </div>
        )}
      </Container>
    </section>

    <ContactSection />
    </>
  )
}

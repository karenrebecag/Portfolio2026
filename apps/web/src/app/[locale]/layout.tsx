import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter_Tight } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LenisProvider } from '@/components/lenis-provider'
import { ParallaxProvider } from '@/components/parallax-provider'
import { TransitionOverlay } from '@/components/transition-overlay'
import { TextRevealProvider } from '@/components/text-reveal'
import { ContentRevealProvider } from '@/components/content-reveal'
import { CustomCursor } from '@/components/custom-cursor'
import { RotatingTextProvider } from '@/components/rotating-text'
import { SectionThemeObserver } from '@/components/section-theme-observer'
import { MarqueeScrollInit } from '@/components/marquee-scroll-init'
import { PageTransition } from '@/components/page-transition'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import { SITE_URL, ogLocale, localizedPath } from '@/lib/seo'
import '../globals.css'

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
})

/** Display / headings: audit found 400, 600, 700 only (18 files → 3). */
const grift = localFont({
  src: [
    { path: '../../fonts/grift/Grift-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/grift/Grift-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/grift/Grift-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
})

/** Accent / labels: audit found 400 + 700 only. */
const interval = localFont({
  src: [
    { path: '../../fonts/interval/TBJInterval-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/interval/TBJInterval-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-accent',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdf9ed' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e0a' },
  ],
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const m = messages.metadata

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.title,
      template: `%s | Karen Ortiz`,
    },
    description: m.description,
    applicationName: 'Karen Rebeca Ortiz',
    authors: [{ name: 'Karen Rebeca Ortiz', url: SITE_URL }],
    creator: 'Karen Rebeca Ortiz',
    openGraph: {
      type: 'website',
      siteName: 'Karen Rebeca Ortiz',
      locale: ogLocale(locale),
      url: localizedPath(locale, '/'),
      title: m.title,
      description: m.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={cn(interTight.variable, grift.variable, interval.variable)} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t&&matchMedia('(prefers-color-scheme:dark)').matches)t='dark';if(t==='dark')document.documentElement.classList.add('dark');else if(t==='mono')document.documentElement.classList.add('mono')}catch(e){}})()`,
          }}
        />
      </head>
      <body data-section-theme="dark" data-theme-nav="dark" data-bg-nav="dark" className="min-h-screen antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <TransitionOverlay />
          <LenisProvider>
            <ParallaxProvider>
              <TextRevealProvider>
                <ContentRevealProvider>
                  <RotatingTextProvider>
                    <SectionThemeObserver>
                      <MarqueeScrollInit />
                      <PageTransition>{children}</PageTransition>
                    </SectionThemeObserver>
                  </RotatingTextProvider>
                </ContentRevealProvider>
              </TextRevealProvider>
            </ParallaxProvider>
          </LenisProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

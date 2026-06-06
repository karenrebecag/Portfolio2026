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
import { TextRevealProvider } from '@/components/text-reveal'
import { ContentRevealProvider } from '@/components/content-reveal'
import { CustomCursor } from '@/components/custom-cursor'
import { RotatingTextProvider } from '@/components/rotating-text'
import { SectionThemeObserver } from '@/components/section-theme-observer'
import { ThemeColorSync } from '@/components/theme-color-sync'
import { MarqueeScrollInit } from '@/components/marquee-scroll-init'
import { PageTransition } from '@/components/page-transition'
import { NavigationProvider } from '@/components/navigation-provider'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import { SITE_URL, ogLocale, localizedPath } from '@/lib/seo'
import {
  baseSiteKeywords,
  defaultOgImages,
  llmDiscoveryMeta,
  twitterCreator,
} from '@/lib/seo/metadata-helpers'
import { SITE_AUTHOR, SITE_OG_IMAGE } from '@/lib/seo/site-config'
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

/** SSR fallback for mobile browser chrome (client sync refines per section + theme). */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#11221f' },
    { media: '(prefers-color-scheme: dark)', color: '#070806' },
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
    keywords: baseSiteKeywords(),
    applicationName: 'Karen Rebeca Ortiz',
    authors: [{ name: SITE_AUTHOR.name, url: SITE_URL }],
    creator: SITE_AUTHOR.name,
    other: llmDiscoveryMeta(),
    openGraph: {
      type: 'website',
      siteName: 'Karen Rebeca Ortiz',
      locale: ogLocale(locale),
      url: localizedPath(locale, '/'),
      title: m.title,
      description: m.description,
      images: defaultOgImages(),
    },
    twitter: {
      card: 'summary_large_image',
      creator: twitterCreator(),
      title: m.title,
      description: m.description,
      images: [SITE_OG_IMAGE],
    },
    manifest: '/site.webmanifest',
    appleWebApp: {
      capable: true,
      title: 'Karen Ortiz',
      statusBarStyle: 'black',
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
        <meta name="theme-color" content="#11221f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t&&matchMedia('(prefers-color-scheme:dark)').matches)t='dark';if(t==='dark')document.documentElement.classList.add('dark');else if(t==='mono')document.documentElement.classList.add('mono');var s='dark',c={light:{dark:'#11221f',light:'#fdf9ed'},dark:{dark:'#070806',light:'#0c0e0a'},mono:{dark:'#14171d',light:'#e8e6e1'}},site=t==='dark'?'dark':t==='mono'?'mono':'light',color=c[site][s],m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',color);var a=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(a)a.setAttribute('content','black')}catch(e){}})()`,
          }}
        />
      </head>
      <body data-section-theme="dark" data-theme-nav="dark" data-bg-nav="dark" className="min-h-screen antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <ThemeColorSync />
          <CustomCursor />
          <LenisProvider>
            <NavigationProvider>
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
            </NavigationProvider>
          </LenisProvider>
          <Toaster />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}

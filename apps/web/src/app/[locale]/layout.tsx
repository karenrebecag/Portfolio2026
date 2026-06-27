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
import { ThemeLockProvider } from '@/components/theme-lock-provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/sonner'
import { IconButton } from '@/components/ui/icon-button'
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

/**
 * Mobile browser chrome color lives in a single manual <meta name="theme-color"> below,
 * kept in sync at runtime by update-theme-color-meta.ts. No themeColor here: media-based
 * tags match the OS preference (not the in-site theme) and silently override that sync.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
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
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t&&matchMedia('(prefers-color-scheme:dark)').matches)t='dark';if(location.pathname.indexOf('/proposals')>-1)t='dark';if(t==='dark')document.documentElement.classList.add('dark');else if(t==='mono')document.documentElement.classList.add('mono');var s='dark',c={light:{dark:'#11221f',light:'#fdf9ed'},dark:{dark:'#070806',light:'#0c0e0a'},mono:{dark:'#14171d',light:'#e8e6e1'}},site=t==='dark'?'dark':t==='mono'?'mono':'light',color=c[site][s],m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',color);var a=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(a)a.setAttribute('content','black')}catch(e){}})()`,
          }}
        />
      </head>
      <body data-section-theme="dark" data-theme-nav="dark" data-bg-nav="dark" className="min-h-screen antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <ThemeLockProvider>
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
          <div className="fixed bottom-6 right-6 z-[1100]">
            <IconButton
              href="https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.9 20.9H17.166V15.053C17.166 13.659 17.138 11.865 15.222 11.865C13.277 11.865 12.98 13.382 12.98 14.95V20.9H9.249V8.87699H12.833V10.516H12.881C13.2402 9.90278 13.7588 9.39838 14.3818 9.05643C15.0048 8.71447 15.7088 8.54775 16.419 8.57399C20.199 8.57399 20.898 11.062 20.898 14.3V20.9H20.9ZM5.036 7.23199C4.60732 7.23259 4.1881 7.10603 3.83137 6.86832C3.47463 6.63061 3.19641 6.29244 3.03191 5.89658C2.8674 5.50072 2.824 5.06497 2.9072 4.64444C2.99039 4.22392 3.19644 3.83751 3.49928 3.53411C3.80212 3.23071 4.18815 3.02395 4.60852 2.93998C5.02889 2.85601 5.46473 2.8986 5.86089 3.06237C6.25705 3.22615 6.59573 3.50374 6.8341 3.86003C7.07246 4.21633 7.1998 4.63532 7.2 5.06399C7.20039 5.34847 7.14472 5.63024 7.03615 5.89319C6.92759 6.15615 6.76827 6.39512 6.5673 6.59647C6.36633 6.79781 6.12764 6.95757 5.86489 7.06662C5.60214 7.17567 5.32048 7.23186 5.036 7.23199ZM6.906 20.9H3.165V8.87699H6.906V20.9Z"/>
                </svg>
              }
            />
          </div>
          </ThemeLockProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

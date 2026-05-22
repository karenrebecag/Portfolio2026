import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter_Tight } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { LenisProvider } from '@/components/lenis-provider'
import { ParallaxProvider } from '@/components/parallax-provider'
import { TransitionOverlay } from '@/components/transition-overlay'
import { TextRevealProvider } from '@/components/text-reveal'
import { ContentRevealProvider } from '@/components/content-reveal'
import { CustomCursor } from '@/components/custom-cursor'
import { RotatingTextProvider } from '@/components/rotating-text'
import { SectionThemeObserver } from '@/components/section-theme-observer'
import { PageTransition } from '@/components/page-transition'
import { Marquee } from '@/components/marquee'
import { routing } from '@/i18n/routing'
import '../globals.css'

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
})

const grift = localFont({
  src: [
    { path: '../../fonts/grift/Grift-Thin.woff2', weight: '100', style: 'normal' },
    { path: '../../fonts/grift/Grift-ThinItalic.woff2', weight: '100', style: 'italic' },
    { path: '../../fonts/grift/Grift-ExtraLight.woff2', weight: '200', style: 'normal' },
    { path: '../../fonts/grift/Grift-ExtraLightItalic.woff2', weight: '200', style: 'italic' },
    { path: '../../fonts/grift/Grift-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../fonts/grift/Grift-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: '../../fonts/grift/Grift-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/grift/Grift-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../../fonts/grift/Grift-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/grift/Grift-MediumItalic.woff2', weight: '500', style: 'italic' },
    { path: '../../fonts/grift/Grift-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/grift/Grift-SemiBoldItalic.woff2', weight: '600', style: 'italic' },
    { path: '../../fonts/grift/Grift-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/grift/Grift-BoldItalic.woff2', weight: '700', style: 'italic' },
    { path: '../../fonts/grift/Grift-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../../fonts/grift/Grift-ExtraBoldItalic.woff2', weight: '800', style: 'italic' },
    { path: '../../fonts/grift/Grift-Black.woff2', weight: '900', style: 'normal' },
    { path: '../../fonts/grift/Grift-BlackItalic.woff2', weight: '900', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const interval = localFont({
  src: [
    { path: '../../fonts/interval/TBJInterval-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../fonts/interval/TBJInterval-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/interval/TBJInterval-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-accent',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = (await import(`../../../messages/${locale}.json`)).default

  return {
    title: {
      default: messages.metadata.title,
      template: `%s | Karen Ortiz`,
    },
    description: messages.metadata.description,
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
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={cn(interTight.variable, grift.variable, interval.variable)} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <TransitionOverlay />
          <LenisProvider>
            <ParallaxProvider>
              <TextRevealProvider>
                <ContentRevealProvider>
                  <RotatingTextProvider>
                    <SectionThemeObserver>
                      <Marquee />
                      <Navbar />
                      <div data-main className="relative z-[2] flex min-h-screen flex-col bg-background text-foreground">
                        <main className="flex-1">
                          <PageTransition>{children}</PageTransition>
                        </main>
                        <Footer />
                      </div>
                    </SectionThemeObserver>
                  </RotatingTextProvider>
                </ContentRevealProvider>
              </TextRevealProvider>
            </ParallaxProvider>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

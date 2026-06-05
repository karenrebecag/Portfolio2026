import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/** Default locale uses no URL prefix; /es/* duplicates Spanish — redirect to canonical paths. */
function redirectDefaultLocalePrefix(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  if (pathname === '/es') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  if (pathname.startsWith('/es/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  return null
}

export default function middleware(request: NextRequest) {
  const redirect = redirectDefaultLocalePrefix(request)
  if (redirect) return redirect
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|stickers|gallery|albums|favicon.ico|robots.txt|sitemap.xml|opengraph-image|icon|apple-icon|.*\\.splinecode$).*)'],
}
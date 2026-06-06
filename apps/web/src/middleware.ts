import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PUBLIC_FILE = /\.[a-z0-9]+$/i

/** Public files in /public — skip locale middleware (and rewrite /en/file → /file). */
function servePublicFile(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  if (!PUBLIC_FILE.test(pathname)) return null

  const stripped = pathname.replace(/^\/(es|en)\//, '/')
  if (stripped !== pathname) {
    const url = request.nextUrl.clone()
    url.pathname = stripped
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

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
  const publicFile = servePublicFile(request)
  if (publicFile) return publicFile

  const redirect = redirectDefaultLocalePrefix(request)
  if (redirect) return redirect
  return intlMiddleware(request)
}

export const config = {
  // Skip locale middleware for static files in /public (manifest, icons, images, etc.)
  matcher: [
    '/',
    '/(es|en)/:path*',
    '/((?!api|_next|_vercel|opengraph-image|stickers|gallery|albums|.*\\..*).*)',
  ],
}
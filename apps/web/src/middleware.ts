import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PUBLIC_FILE = /\.[a-z0-9]+$/i

/**
 * Countries served Spanish (the default, prefix-less locale). Spanish-speaking
 * Latin America plus Spain. Everyone else (Brazil included — no PT build) gets
 * English. Edit this set to change the geo mapping.
 */
const SPANISH_COUNTRIES = new Set([
  'MX', 'GT', 'SV', 'HN', 'NI', 'CR', 'PA', 'CO', 'VE', 'EC',
  'PE', 'BO', 'CL', 'AR', 'PY', 'UY', 'DO', 'CU', 'PR', 'ES',
])

/** Search/answer crawlers must see the canonical URL they requested, never a geo redirect. */
const CRAWLER_UA =
  /bot|crawl|spider|slurp|googlebot|bingbot|duckduckbot|baiduspider|yandex|facebookexternalhit|embedly|quora|pinterest|whatsapp|telegram|applebot/i

/**
 * First-visit locale by IP geolocation (Vercel edge header). Spanish-speaking
 * countries stay on the prefix-less default; everyone else is sent to `/en`.
 * Manual choice (NEXT_LOCALE cookie, set by the locale toggle) always wins, and
 * crawlers are never redirected so both language trees stay indexable.
 */
function geoLocaleRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // English already lives under /en — the URL is explicit, leave it.
  if (pathname === '/en' || pathname.startsWith('/en/')) return null

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale === 'es') return null
  if (cookieLocale === 'en') return redirectToEn(request)

  const ua = request.headers.get('user-agent') ?? ''
  if (CRAWLER_UA.test(ua)) return null

  const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase()
  // Unknown geo (e.g. local dev) and Spanish-speaking countries keep the default.
  if (!country || SPANISH_COUNTRIES.has(country)) return null

  return redirectToEn(request)
}

function redirectToEn(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url, 307)
}

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

  const geoRedirect = geoLocaleRedirect(request)
  if (geoRedirect) return geoRedirect

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
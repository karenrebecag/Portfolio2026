import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|stickers|gallery|albums|favicon.ico|robots.txt|sitemap.xml|opengraph-image|icon|apple-icon|.*\\.splinecode$).*)'],
}

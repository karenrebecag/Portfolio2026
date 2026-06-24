import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  // Locale is chosen by IP geolocation in middleware.ts, not by Accept-Language.
  // The toggle still writes NEXT_LOCALE, which the middleware honors as manual choice.
  localeDetection: false,
})

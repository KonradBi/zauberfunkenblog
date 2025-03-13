import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: defaultLocale,
  
  // Redirect to default locale if no locale is found
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. /logo.png)
  // - api routes
  // - _next paths (e.g. /_next/static/...)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

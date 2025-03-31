import { NextRequest, NextResponse } from 'next/server';

// Unterstützte Sprachen
const locales = ['de', 'en'];

// Länder, in denen Deutsch die Standardsprache ist
const germanSpeakingCountries = ['DE', 'AT', 'CH', 'LI'];

export function middleware(request: NextRequest) {
  // Aktueller Pfad
  const pathname = request.nextUrl.pathname;
  
  // Prüfen, ob bereits ein Locale im Pfad vorhanden ist
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Wenn kein Locale vorhanden, bestimme bevorzugte Sprache
  let locale = 'de'; // Deutsche Standardeinstellung

  // Akzeptierte Sprachen aus dem Header holen
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    console.log('Accept-Language header:', acceptLanguage);
    
    // Englisch als bevorzugte Sprache identifizieren
    if (acceptLanguage.toLowerCase().startsWith('en') || 
        acceptLanguage.includes(',en') || 
        (!acceptLanguage.includes('de') && !acceptLanguage.includes('de-'))) {
      locale = 'en';
    }
  }

  // Neue URL erstellen mit dem ermittelten Locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  request.nextUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });

  console.log(`Redirecting to ${newUrl.toString()}`);
  
  return NextResponse.redirect(newUrl);
}

// Führe Middleware für alle Seiten aus außer für bestimmte Pfade
export const config = {
  matcher: [
    // Alle Pfade außer API-Routen und statische Dateien
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

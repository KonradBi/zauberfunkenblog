'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
// Wir verwenden diese Komponenten aktuell nicht, daher auskommentiert
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe } from 'lucide-react';

interface NavbarProps {
  dictionary: {
    common: {
      navigation: {
        experiences: string;
        hotels: string;
        restaurants: string;
        podcast: string;
        sustainable: string;
        about: string;
        switchLanguage: string;
      };
      languageSwitch: string; // Hinzugefügt für die Sprachumschaltung
    };
  };
  locale: Locale;
}

export function Navbar({ dictionary, locale }: NavbarProps) {
  const pathname = usePathname();
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  
  // Funktion um den aktuellen Pfad für die alternative Sprache zu generieren
  const getAlternateLocaleHref = () => {
    // Entferne das aktuelle Locale vom Pfad
    const path = pathname.replace(`/${locale}`, '');
    // Füge das alternate Locale hinzu
    return `/${alternateLocale}${path}`;
  };
  
  const navItems = [
    { 
      name: dictionary.common.navigation.experiences, 
      href: `/${locale}/erlebnisse` 
    },
    { 
      name: dictionary.common.navigation.hotels, 
      href: `/${locale}/hotels` 
    },
    { 
      name: dictionary.common.navigation.restaurants, 
      href: `/${locale}/restaurants` 
    },
    { 
      name: dictionary.common.navigation.podcast, 
      href: `/${locale}/podcast` 
    },
    { 
      name: dictionary.common.navigation.sustainable, 
      href: `/${locale}/nachhaltiges-reisen` 
    },
    { 
      name: dictionary.common.navigation.about, 
      href: `/${locale}/ueber-uns` 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl tracking-wider font-playfair" style={{ fontWeight: 800 }}>ZAUBERFUNKEN</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            href={getAlternateLocaleHref()}
            className="text-sm font-medium transition-colors hover:text-primary hidden md:flex items-center gap-1"
          >
            <Globe className="h-4 w-4" />
            {dictionary.common.languageSwitch}
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link 
                  href={getAlternateLocaleHref()}
                  className="text-sm font-medium transition-colors hover:text-primary mt-4 flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  {dictionary.common.languageSwitch}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

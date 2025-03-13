import Link from 'next/link';
import { Locale } from '@/i18n/config';

interface FooterProps {
  dictionary: any;
  locale: Locale;
}

export function Footer({ dictionary, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl tracking-wider font-playfair" style={{ fontWeight: 800 }}>ZAUBERFUNKEN</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {dictionary.footer.copyright.replace('{year}', currentYear)}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href={`/${locale}/datenschutz`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {dictionary.footer.privacy}
          </Link>
          <Link 
            href={`/${locale}/impressum`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {dictionary.footer.imprint}
          </Link>
        </div>
      </div>
    </footer>
  );
}

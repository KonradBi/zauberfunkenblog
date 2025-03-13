import Link from 'next/link';
import { defaultLocale } from '@/i18n/config';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Seite nicht gefunden</h1>
      <p className="text-muted-foreground mb-8">
        Die gesuchte Seite existiert leider nicht.
      </p>
      <Link 
        href={`/${defaultLocale}`}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}

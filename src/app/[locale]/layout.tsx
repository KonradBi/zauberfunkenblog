import { ReactNode } from 'react';
import { Locale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar dictionary={dictionary} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer dictionary={dictionary} locale={locale} />
    </div>
  );
}

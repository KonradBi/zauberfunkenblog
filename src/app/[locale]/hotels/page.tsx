import { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';

interface HotelsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params;
  const dictionary = await getDictionary(locale);
  
  const title = locale === 'de' ? 'Hotels - Zauberfunken Blog' : 'Hotels - Zauberfunken Blog';
  const description = locale === 'de' 
    ? 'Entdecke außergewöhnliche Hotels auf der ganzen Welt' 
    : 'Discover exceptional hotels around the world';
  
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/hotels`,
      languages: {
        'de': '/de/hotels',
        'en': '/en/hotels',
      },
    },
  };
}

export default async function HotelsPage({ params }: HotelsPageProps) {
  // In Next.js, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  console.log(`Fetching hotel posts for locale: ${locale}`);
  
  // Fetch posts from the "Hotels" category in the current language
  // Fallback to empty array if category doesn't exist
  // Erhöhe die Anzahl der abgerufenen Beiträge auf 50, um sicherzustellen, dass alle angezeigt werden
  // Korrigierte Parameter-Reihenfolge: slug, locale, perPage, page
  const posts = await getPostsByCategorySlug('hotels', locale, 50) || [];
  
  // Debug-Log, um zu sehen, wie viele Beiträge abgerufen wurden
  console.log(`Retrieved ${posts.length} hotel posts for locale ${locale}`);
  
  // Debug-Log, um die IDs, Titel und Slug der abgerufenen Beiträge zu sehen
  posts.forEach(post => {
    console.log(`Post ID: ${post.id}, Title: ${post.title.rendered}, Slug: ${post.slug}, Translation ID: ${post.acf?.translation_id || post.meta?.translation_id || 'none'}`);
  });
  
  return (
    <CategoryPage
      title={dictionary.common.navigation.hotels || "Hotels"}
      subtitle={dictionary.common.latestPosts || "Neueste Beiträge"}
      backgroundImage="/images/herohotel.jpg"
      posts={posts}
      locale={locale}
    />
  );
}

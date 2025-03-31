import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';

interface RestaurantsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({ params }: { params: RestaurantsPageProps['params'] }): Promise<Metadata> {
  const { locale } = await params;
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  const dictionary = await getDictionary(locale);
  
  const metadata: Metadata = {
    title: dictionary.common.navigation.restaurants || 'Restaurants',
    description: locale === 'de' 
      ? 'Entdecke besondere Restaurants und kulinarische Erlebnisse für deine Reisen.'
      : 'Discover special restaurants and culinary experiences for your travels.',
    alternates: {
      canonical: `https://zauberfunken.com/${locale}/restaurants`,
      languages: {
        [locale]: `https://zauberfunken.com/${locale}/restaurants`,
        [alternateLocale]: `https://zauberfunken.com/${alternateLocale}/restaurants`,
      },
    },
  };
  
  return metadata;
}

export default async function RestaurantsPage({ params }: RestaurantsPageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  
  // Fetch posts from the "Restaurants" category
  // Fallback to empty array if category doesn't exist
  // Erhöhe die Anzahl der abgerufenen Beiträge auf 50, um sicherzustellen, dass alle angezeigt werden
  const posts = await getPostsByCategorySlug('restaurants', 1, 50, locale) || [];
  
  // Debug-Log, um zu sehen, wie viele Beiträge abgerufen wurden
  console.log(`Retrieved ${posts.length} restaurant posts for locale ${locale}`);
  
  // Für jeden Post, hole die Übersetzung, falls vorhanden
  const postsWithTranslations = await Promise.all(posts.map(async (post) => {
    if (post.meta?.translation_id) {
      const translation = await getPostTranslation(post.meta.translation_id, alternateLocale);
      return { post, translation };
    }
    return { post, translation: null };
  }));
  
  return (
    <CategoryPage
      title={dictionary.common.navigation.restaurants || "Restaurants"}
      subtitle={dictionary.common.latestPosts || "Neueste Beiträge"}
      backgroundImage="/images/herorestaurants.jpg"
      posts={posts}
      postsTranslations={postsWithTranslations.map(p => p.translation)}
      locale={locale}
    />
  );
}

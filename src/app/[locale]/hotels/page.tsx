import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';

interface HotelsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function HotelsPage({ params }: HotelsPageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  // Fetch posts from the "Hotels" category
  // Fallback to empty array if category doesn't exist
  // Erhöhe die Anzahl der abgerufenen Beiträge auf 50, um sicherzustellen, dass alle angezeigt werden
  const posts = await getPostsByCategorySlug('hotels', 1, 50, locale) || [];
  
  // Debug-Log, um zu sehen, wie viele Beiträge abgerufen wurden
  console.log(`Retrieved ${posts.length} hotel posts for locale ${locale}`);
  
  // Debug-Log, um die IDs und Titel der abgerufenen Beiträge zu sehen
  posts.forEach(post => {
    console.log(`Post ID: ${post.id}, Title: ${post.title.rendered}`);
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

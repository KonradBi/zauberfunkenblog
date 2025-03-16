import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';

interface ExperiencesPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function ExperiencesPage({ params }: ExperiencesPageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  // Fetch posts from the "Erlebnisse" category
  // Fallback to empty array if category doesn't exist
  // Erhöhe die Anzahl der abgerufenen Beiträge auf 50, um sicherzustellen, dass alle angezeigt werden
  const posts = await getPostsByCategorySlug('erlebnisse', 1, 50, locale) || [];
  
  // Debug-Log, um zu sehen, wie viele Beiträge abgerufen wurden
  console.log(`Retrieved ${posts.length} experience posts for locale ${locale}`);
  
  // Debug-Log, um die IDs und Titel der abgerufenen Beiträge zu sehen
  posts.forEach(post => {
    console.log(`Post ID: ${post.id}, Title: ${post.title.rendered}`);
  });
  
  return (
    <CategoryPage
      title={dictionary.common.navigation.experiences || "Erlebnisse"}
      subtitle={dictionary.common.latestPosts || "Neueste Beiträge"}
      backgroundImage="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80"
      posts={posts}
      locale={locale}
    />
  );
}

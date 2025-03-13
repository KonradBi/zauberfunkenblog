import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';

interface RestaurantsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function RestaurantsPage({ params }: RestaurantsPageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  // Fetch posts from the "Restaurants" category
  const posts = await getPostsByCategorySlug('restaurants', 1, 12, locale);
  
  return (
    <CategoryPage
      title={dictionary.common.navigation.restaurants}
      subtitle={dictionary.common.latestPosts}
      backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
      posts={posts}
      locale={locale}
    />
  );
}

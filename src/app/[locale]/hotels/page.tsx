import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';

interface HotelsPageProps {
  params: {
    locale: Locale;
  };
}

export default async function HotelsPage({ params: { locale } }: HotelsPageProps) {
  const dictionary = await getDictionary(locale);
  
  // Fetch posts from the "Hotels" category
  const posts = await getPostsByCategorySlug('hotels', 1, 12, locale);
  
  return (
    <CategoryPage
      title={dictionary.common.navigation.hotels}
      subtitle={dictionary.common.latestPosts}
      backgroundImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
      posts={posts}
      locale={locale}
    />
  );
}

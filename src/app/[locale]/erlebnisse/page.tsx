import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug } from '@/lib/wordpress-api';
import { StyledCategoryPage } from '@/components/styled-category-page';

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
  const posts = await getPostsByCategorySlug('erlebnisse', 1, 12, locale) || [];
  
  return (
    <StyledCategoryPage
      title={dictionary.common.navigation.experiences || "Erlebnisse"}
      subtitle={dictionary.common.latestPosts || "Neueste Beiträge"}
      backgroundImage="https://images.unsplash.com/photo-1682687220742-aba19b51f11a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
      posts={posts}
      locale={locale}
    />
  );
}

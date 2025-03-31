import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';

interface PageProps {
  params: {
    locale: 'de' | 'en';
  };
}

export async function generateMetadata({ params }: { params: PageProps['params'] }): Promise<Metadata> {
  const { locale } = params;
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  
  const metadata: Metadata = {
    title: locale === 'de' ? 'Restaurants' : 'Restaurants',
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

export default async function RestaurantsPage({ params: { locale } }: PageProps) {
  const posts = await getPostsByCategorySlug('restaurants', locale, 50);
  const postsTranslations = await Promise.all(
    posts.map(async (post) => {
      const translationId = post.acf?.translation_id || post.meta?.translation_id;
      if (!translationId) return null;
      return getPostTranslation(translationId, locale === 'de' ? 'en' : 'de');
    })
  );

  return (
    <CategoryPage
      title={locale === 'de' ? 'Restaurants' : 'Restaurants'}
      subtitle={locale === 'de' ? 'Unsere Restaurant-Empfehlungen' : 'Our Restaurant Recommendations'}
      backgroundImage="/images/restaurants-header.jpg"
      posts={posts}
      postsTranslations={postsTranslations}
      locale={locale}
    />
  );
}

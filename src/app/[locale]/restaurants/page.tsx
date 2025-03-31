import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';
import { PageProps } from '../erlebnisse/page';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'de' ? 'Restaurants' : 'Restaurants',
    description: locale === 'de' 
      ? 'Entdecke besondere Restaurants und kulinarische Erlebnisse.'
      : 'Discover unique restaurants and culinary experiences.',
    alternates: {
      canonical: `/${locale}/restaurants`,
      languages: {
        'de': '/de/restaurants',
        'en': '/en/restaurants'
      }
    }
  };
}

export default async function RestaurantsPage({ params }: PageProps) {
  const { locale } = params;
  const posts = await getPostsByCategorySlug('restaurants', locale as 'de' | 'en', 50);
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
      locale={locale as 'de' | 'en'}
    />
  );
}

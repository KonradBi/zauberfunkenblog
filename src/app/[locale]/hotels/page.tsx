import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: locale === 'de' ? 'Hotels' : 'Hotels',
    description: locale === 'de' 
      ? 'Entdecke besondere Hotels und Unterkünfte für deine Reisen.'
      : 'Discover unique hotels and accommodations for your travels.',
    alternates: {
      canonical: `/${locale}/hotels`,
      languages: {
        'de': '/de/hotels',
        'en': '/en/hotels'
      }
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function HotelsPage({ params }: any) {
  const locale = params.locale;
  const posts = await getPostsByCategorySlug('hotels', locale as 'de' | 'en', 50);
  const postsTranslations = await Promise.all(
    posts.map(async (post) => {
      const translationId = post.acf?.translation_id || post.meta?.translation_id;
      if (!translationId) return null;
      return getPostTranslation(translationId, locale === 'de' ? 'en' : 'de');
    })
  );

  return (
    <CategoryPage
      title={locale === 'de' ? 'Hotels' : 'Hotels'}
      subtitle={locale === 'de' ? 'Unsere Hotel-Empfehlungen' : 'Our Hotel Recommendations'}
      backgroundImage="/images/hotels-header.jpg"
      posts={posts}
      postsTranslations={postsTranslations}
      locale={locale as 'de' | 'en'}
    />
  );
}

import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';

interface PageProps {
  params: {
    locale: 'de' | 'en';
  };
}

// Generate metadata for this page
export async function generateMetadata({ params }: { params: PageProps['params'] }): Promise<Metadata> {
  const { locale } = params;
  
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

export default async function HotelsPage({ params: { locale } }: PageProps) {
  const posts = await getPostsByCategorySlug('hotels', locale, 50);
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
      locale={locale}
    />
  );
}

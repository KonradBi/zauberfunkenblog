import { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';

interface PageProps {
  params: {
    locale: 'de' | 'en';
  };
}

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params;
  const dictionary = await getDictionary(locale);
  
  const title = locale === 'de' ? 'Hotels - Zauberfunken Blog' : 'Hotels - Zauberfunken Blog';
  const description = locale === 'de' 
    ? 'Entdecke außergewöhnliche Hotels auf der ganzen Welt' 
    : 'Discover exceptional hotels around the world';
  
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/hotels`,
      languages: {
        'de': '/de/hotels',
        'en': '/en/hotels',
      },
    },
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

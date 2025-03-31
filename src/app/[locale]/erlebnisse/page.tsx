import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: locale === 'de' ? 'Erlebnisse' : 'Experiences',
    description: locale === 'de' 
      ? 'Entdecke besondere Erlebnisse und Aktivitäten für deine Reisen.'
      : 'Discover unique experiences and activities for your travels.',
    alternates: {
      canonical: `/${locale}/erlebnisse`,
      languages: {
        'de': '/de/erlebnisse',
        'en': '/en/erlebnisse'
      }
    }
  };
}

export default async function ErlebnissePage({ params }: any) {
  const locale = params.locale;
  const posts = await getPostsByCategorySlug('erlebnisse', locale as 'de' | 'en', 50);
  const postsTranslations = await Promise.all(
    posts.map(async (post) => {
      const translationId = post.acf?.translation_id || post.meta?.translation_id;
      if (!translationId) return null;
      return getPostTranslation(translationId, locale === 'de' ? 'en' : 'de');
    })
  );

  return (
    <CategoryPage
      title={locale === 'de' ? 'Erlebnisse' : 'Experiences'}
      subtitle={locale === 'de' ? 'Unsere Erlebnis-Empfehlungen' : 'Our Experience Recommendations'}
      backgroundImage="/images/erlebnisse-header.jpg"
      posts={posts}
      postsTranslations={postsTranslations}
      locale={locale as 'de' | 'en'}
    />
  );
}

import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPostsByCategorySlug, getPostTranslation } from '@/lib/wordpress-api';
import { CategoryPage } from '@/components/category-page';
import { Metadata } from 'next';

interface ErlebnissePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({ params }: { params: ErlebnissePageProps['params'] }): Promise<Metadata> {
  const { locale } = await params;
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  const dictionary = await getDictionary(locale);
  
  const metadata: Metadata = {
    title: dictionary.common.navigation.experiences || 'Erlebnisse',
    description: locale === 'de' 
      ? 'Entdecke unvergessliche Reiseerlebnisse und Abenteuer auf der ganzen Welt.'
      : 'Discover unforgettable travel experiences and adventures around the world.',
    alternates: {
      canonical: `https://zauberfunken.com/${locale}/erlebnisse`,
      languages: {
        [locale]: `https://zauberfunken.com/${locale}/erlebnisse`,
        [alternateLocale]: `https://zauberfunken.com/${alternateLocale}/erlebnisse`,
      },
    },
  };
  
  return metadata;
}

export default async function ErlebnissePage({ params }: ErlebnissePageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  
  // Fetch posts from the "Erlebnisse" category
  // Fallback to empty array if category doesn't exist
  // Erhöhe die Anzahl der abgerufenen Beiträge auf 50, um sicherzustellen, dass alle angezeigt werden
  const posts = await getPostsByCategorySlug('erlebnisse', 1, 50, locale) || [];
  
  // Debug-Log, um zu sehen, wie viele Beiträge abgerufen wurden
  console.log(`Retrieved ${posts.length} erlebnisse posts for locale ${locale}`);
  
  // Für jeden Post, hole die Übersetzung, falls vorhanden
  const postsWithTranslations = await Promise.all(posts.map(async (post) => {
    if (post.meta?.translation_id) {
      const translation = await getPostTranslation(post.meta.translation_id, alternateLocale);
      return { post, translation };
    }
    return { post, translation: null };
  }));
  
  return (
    <CategoryPage
      title={dictionary.common.navigation.experiences || "Erlebnisse"}
      subtitle={dictionary.common.latestPosts || "Neueste Beiträge"}
      backgroundImage="/images/heroerlebnisse.jpg"
      posts={posts}
      postsTranslations={postsWithTranslations.map(p => p.translation)}
      locale={locale}
    />
  );
}

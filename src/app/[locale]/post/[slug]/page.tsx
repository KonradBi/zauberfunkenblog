import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { getPostBySlug, getPostTranslation } from '@/lib/wordpress-api';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/i18n/dictionaries';
import { Metadata } from 'next';

interface PageProps {
  params: {
    locale: 'de' | 'en';
    slug: string;
  };
}

// Generiere Metadaten inklusive hreflang-Tags
export async function generateMetadata({ params }: { params: PageProps['params'] }): Promise<Metadata> {
  const { locale, slug } = params;
  const post = await getPostBySlug(slug, locale);
  
  if (!post) {
    return {
      title: '404 - Not Found',
    };
  }
  
  // Hole Translation ID
  const translationId = post.meta?.translation_id;
  
  // Falls eine Translation ID existiert, suche nach der alternativen Sprachversion
  const alternateLocale = locale === 'de' ? 'en' : 'de';
  const alternatePost = translationId ? await getPostTranslation(translationId, alternateLocale) : null;
  
  const metadata: Metadata = {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    alternates: {
      canonical: `https://zauberfunken.com/${locale}/post/${slug}`,
      languages: {},
    },
  };
  
  // Füge hreflang-Tags hinzu, wenn es Übersetzungen gibt
  if (metadata.alternates?.languages && alternatePost) {
    // Aktuelle Sprache
    metadata.alternates.languages[locale] = `https://zauberfunken.com/${locale}/post/${slug}`;
    
    // Alternative Sprache
    metadata.alternates.languages[alternateLocale] = `https://zauberfunken.com/${alternateLocale}/post/${alternatePost.slug}`;
  }
  
  return metadata;
}

export default async function PostPage({ params: { locale, slug } }: PageProps) {
  const post = await getPostBySlug(slug, locale);
  
  if (!post) {
    notFound();
  }

  // Get the translation ID from either ACF or meta fields
  const translationId = post.acf?.translation_id || post.meta?.translation_id;
  let translatedPost = null;
  
  if (translationId) {
    translatedPost = await getPostTranslation(translationId, locale === 'de' ? 'en' : 'de');
  }

  // Format the date
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'de' ? 'de-DE' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
  
  // Get the categories
  const categories = post._embedded?.['wp:term']?.[0] || [];
  
  return (
    <article className="container py-12 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-muted-foreground hover:text-primary">
          ← {locale === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
        </Link>
        
        {/* Sprachauswahl-Link, falls Übersetzung verfügbar */}
        {translatedPost && (
          <Link 
            href={`/${locale === 'de' ? 'en' : 'de'}/post/${translatedPost.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="m5 8 6 6 6-6"/>
            </svg>
            {locale === 'de' ? 'Read in English' : 'Auf Deutsch lesen'}
          </Link>
        )}
      </div>
      
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" 
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          <time dateTime={post.date}>{formattedDate}</time>
          <span>•</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: { id: number; slug: string; name: string }) => (
              <Link 
                key={category.id}
                href={`/${locale}/${category.slug}`}
                className="hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
        <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-lg">
          <Image
            src={post._embedded['wp:featuredmedia'][0].source_url}
            alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
      
      <div className="mt-12 pt-8 border-t">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Link href={`/${locale}`}>
            <Button variant="outline">
              ← {locale === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
            </Button>
          </Link>
          
          {/* Sprachauswahl-Button am Ende, falls Übersetzung verfügbar */}
          {translatedPost && (
            <Link href={`/${locale === 'de' ? 'en' : 'de'}/post/${translatedPost.slug}`}>
              <Button>
                {locale === 'de' ? 'Read in English' : 'Auf Deutsch lesen'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

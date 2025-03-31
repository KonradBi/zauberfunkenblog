import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WordPressPost } from '@/lib/wordpress-api';

interface PostProps {
  post: WordPressPost;
  translation: WordPressPost | null;
  locale: string;
}

export function Post({ post, translation, locale }: PostProps) {
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'de' ? 'de-DE' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <div className="flex items-center justify-between">
            <time className="text-muted-foreground" dateTime={post.date}>
              {formattedDate}
            </time>
            
            {translation && (
              <Link 
                href={`/${locale === 'de' ? 'en' : 'de'}/post/${translation.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="m5 8 6 6 6-6"/>
                </svg>
                {locale === 'de' ? 'Read in English' : 'Auf Deutsch lesen'}
              </Link>
            )}
          </div>
        </header>

        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
          <div className="relative aspect-[16/9] mb-8 rounded-xl overflow-hidden">
            <Image
              src={post._embedded['wp:featuredmedia'][0].source_url}
              alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        
        <footer className="mt-8 pt-8 border-t">
          <div className="flex justify-end">
            {translation && (
              <Link href={`/${locale === 'de' ? 'en' : 'de'}/post/${translation.slug}`}>
                <Button>
                  {locale === 'de' ? 'Read in English' : 'Auf Deutsch lesen'}
                </Button>
              </Link>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
} 
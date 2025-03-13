import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { getPostBySlug } from '@/lib/wordpress-api';
import { Button } from '@/components/ui/button';

interface PostPageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export default async function PostPage({ params: { locale, slug } }: PostPageProps) {
  const post = await getPostBySlug(slug, locale);
  
  if (!post) {
    notFound();
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
      <div className="mb-8">
        <Link href={`/${locale}`} className="text-muted-foreground hover:text-primary">
          ← {locale === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
        </Link>
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
        <div className="flex justify-between items-center">
          <Link href={`/${locale}`}>
            <Button variant="outline">
              ← {locale === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
            </Button>
          </Link>
          
          {/* Share buttons could be added here */}
        </div>
      </div>
    </article>
  );
}

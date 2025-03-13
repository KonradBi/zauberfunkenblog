import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { WordPressPost } from '@/lib/wordpress-api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Dictionary {
  common: {
    readMore: string;
    [key: string]: string | Record<string, string>;
  };
  [key: string]: unknown;
}

interface PostGridProps {
  posts: WordPressPost[];
  locale: Locale;
  dictionary: Dictionary;
}

export function PostGrid({ posts, locale, dictionary }: PostGridProps) {
  // Stellen sicher, dass posts ein Array ist
  const postArray = Array.isArray(posts) ? posts : [];
  
  if (postArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postArray.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="aspect-video relative">
            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
              <Image
                src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2">
              {post.title.rendered}
            </CardTitle>
            <CardDescription>
              {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="line-clamp-3 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/${locale}/post/${post.slug}`}>
                {dictionary.common.readMore}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

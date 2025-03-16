'use client';

import { MotionCard } from './motion-wrapper';
import { PostCard } from './post-card';
import { WordPressPost } from '@/lib/wordpress-api';
import Link from 'next/link';
import { Button } from './ui/button';

interface PostsGridProps {
  posts: WordPressPost[];
  locale: string;
  dictionary: {
    readMore: string;
    latestPosts: string;
    noPosts: string;
    allPosts: string;
  };
}

export default function PostsGrid({ posts, locale, dictionary }: PostsGridProps) {
  const regularPosts = posts.slice(1, 5); // Nimm maximal 4 Posts für die 2x2 Grid

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{dictionary.latestPosts}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {regularPosts.length > 0 ? regularPosts.map((post, index) => (
          <MotionCard key={post.id} index={index}>
            <PostCard
              post={post}
              locale={locale}
              dictionary={{
                readMore: dictionary.readMore
              }}
            />
          </MotionCard>
        )) : posts.length === 0 ? (
          <div className="col-span-2 text-center py-10">
            <p className="text-muted-foreground">{dictionary.noPosts || 'Keine Beiträge gefunden'}</p>
          </div>
        ) : null}
      </div>
      
      <div className="flex justify-center mt-12">
        <Button variant="outline" asChild className="hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
          <Link href={`/${locale}/erlebnisse`}>
            {dictionary.allPosts}
          </Link>
        </Button>
      </div>
    </div>
  );
} 
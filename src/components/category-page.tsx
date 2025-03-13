import React from 'react';
import { WordPressPost } from '@/lib/wordpress-api';
import { ParallaxHeader } from './parallax-header';
import { PostCard } from './post-card';

interface CategoryPageProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  posts: WordPressPost[];
  locale: string;
}

export function CategoryPage({ 
  title, 
  subtitle, 
  backgroundImage, 
  posts,
  locale 
}: CategoryPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <ParallaxHeader
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        buttons={<div />}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              locale={locale}
              readMoreText="Weiterlesen"
            />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold">
              Keine Beiträge gefunden
            </h2>
            <p className="text-gray-600 mt-2">
              Schau später noch einmal vorbei für neue Inhalte.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

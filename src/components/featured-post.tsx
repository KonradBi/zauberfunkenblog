'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WordPressPost } from '@/lib/wordpress-api';
import { Button } from './ui/button';

interface FeaturedPostProps {
  post: WordPressPost | null;
  locale: string;
  dictionary: {
    featuredPost: string;
    readMore: string;
  };
}

// Funktion, die basierend auf der Kategorie ein passendes Icon zurückgibt
const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('hotel') || lowerCategory.includes('unterkunft')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  } else if (lowerCategory.includes('restaurant') || lowerCategory.includes('café') || lowerCategory.includes('essen')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  } else if (lowerCategory.includes('erlebnis') || lowerCategory.includes('experience') || lowerCategory.includes('aktivität')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  } else if (lowerCategory.includes('nachhaltig') || lowerCategory.includes('sustainable') || lowerCategory.includes('eco')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else {
    // Standard-Icon für alle anderen Kategorien
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    );
  }
};

export default function FeaturedPost({ post, locale, dictionary }: FeaturedPostProps) {
  if (!post) return null;

  return (
    <div className="rounded-xl overflow-hidden shadow-xl h-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Inhalt auf der linken Seite */}
        <div className="p-6 md:p-8 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {dictionary.featuredPost}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold line-clamp-2 text-primary-900">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </h2>
            
            <p className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            
            {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105">
                  {getCategoryIcon(post._embedded?.['wp:term']?.[0]?.[0]?.name)}
                  {post._embedded?.['wp:term']?.[0]?.[0]?.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <div 
              className="text-sm text-gray-600 line-clamp-3 mb-6"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            
            <Button asChild variant="outline" className="w-fit hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
              <Link href={`/${locale}/post/${post.slug}`}>
                {dictionary.readMore}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Bild auf der rechten Seite */}
        <div className="relative order-first md:order-last">
          {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
            <Image
              src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
              className="object-cover object-bottom"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full min-h-[300px] bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Kein Bild verfügbar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
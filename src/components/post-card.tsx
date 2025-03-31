'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { WordPressPost } from '@/lib/wordpress-api';

// Funktion, die basierend auf der Kategorie ein passendes Icon zurückgibt
const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('hotel') || lowerCategory.includes('unterkunft')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  } else if (lowerCategory.includes('restaurant') || lowerCategory.includes('essen') || lowerCategory.includes('food')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (lowerCategory.includes('erlebnis') || lowerCategory.includes('experience') || lowerCategory.includes('abenteuer')) {
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

interface PostCardProps {
  post: WordPressPost;
  locale: string;
  dictionary: {
    readMore: string;
  };
  translation?: WordPressPost | null;
}

export function PostCard({ post, locale, dictionary, translation }: PostCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform hover:translate-y-[-5px]">
      <div className="relative aspect-[16/9] overflow-hidden">
        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
          <Image
            src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
            alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Kein Bild verfügbar</span>
          </div>
        )}
        
        {/* Kategorie-Badge */}
        {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105">
              {getCategoryIcon(post._embedded?.['wp:term']?.[0]?.[0]?.name)}
              {post._embedded?.['wp:term']?.[0]?.[0]?.name}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {translation && (
            <Link 
              href={`/${locale === 'de' ? 'en' : 'de'}/post/${translation.slug}`}
              className="text-xs text-primary hover:text-primary-dark transition-colors"
            >
              {locale === 'de' ? 'Read in English' : 'Auf Deutsch lesen'}
            </Link>
          )}
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-primary-900">
          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>
        <div 
          className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <Button asChild variant="outline" className="w-fit mt-auto hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
          <Link href={`/${locale}/post/${post.slug}`}>
            {dictionary.readMore}
          </Link>
        </Button>
      </div>
    </div>
  );
}

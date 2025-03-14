import React from 'react';
import { WordPressPost } from '@/lib/wordpress-api';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/i18n/config';

interface BlogPreviewGridProps {
  posts: WordPressPost[] | null | undefined;
  locale: Locale;
  title: string;
}

export function BlogPreviewGrid({ posts: postsInput, locale, title }: BlogPreviewGridProps) {
  // Ensure posts is always an array
  const posts = postsInput || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-4xl font-bold mb-6 text-center">
          {title}
        </h2>
        <div className="h-1 w-24 bg-primary mx-auto mb-12"></div>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative h-[500px] rounded-xl overflow-hidden group"
            >
              {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                <Image
                  src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                  alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold border-transparent bg-primary text-primary-foreground">
                      {post._embedded?.['wp:term']?.[0]?.[0]?.name}
                    </span>
                  </div>
                )}
                
                <div className="mb-2 text-white/80 text-sm">
                  {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                
                <h3 className="text-2xl font-bold mb-4">
                  <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </h3>
                
                <div 
                  className="text-white/90 mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                
                <Link 
                  href={`/${locale}/post/${post.slug}`}
                  className="inline-flex items-center text-primary hover:text-primary/90 font-medium transition-colors"
                >
                  {locale === 'de' ? 'Weiterlesen' : 'Read more'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">
            {locale === 'de' ? 'Keine Beiträge gefunden' : 'No posts found'}
          </h2>
          <p className="text-gray-600 mt-2">
            {locale === 'de' 
              ? 'Schau später noch einmal vorbei für neue Inhalte.' 
              : 'Check back later for new content.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
} 
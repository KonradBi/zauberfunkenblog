'use client';

import React from 'react';
import { WordPressPost } from '@/lib/wordpress-api';
import { ParallaxHeader } from './parallax-header';
import { PostCard } from './post-card';
import { motion } from 'framer-motion';
import { Locale } from '@/i18n/config';
import { MotionCard } from './motion-wrapper';

interface CategoryPageProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  posts: WordPressPost[] | null | undefined;
  postsTranslations?: (WordPressPost | null)[] | null | undefined;
  locale: Locale;
}

export function CategoryPage({ 
  title, 
  subtitle, 
  backgroundImage, 
  posts: postsInput,
  postsTranslations,
  locale 
}: CategoryPageProps) {
  // Ensure posts is always an array
  const posts = postsInput || [];
  const translations = postsTranslations || [];
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <ParallaxHeader
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        buttons={<div />}
      />
      
      <main className="container mx-auto px-4 py-16 -mt-24 relative z-10 pt-32">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-2 text-primary-900">{title}</h2>
          <p className="text-gray-600 mb-6 text-lg">
            {locale === 'de' 
              ? `Entdecken Sie unsere Sammlung von Artikeln über ${title}` 
              : `Discover our collection of articles about ${title}`
            }
          </p>
          <div className="h-1 w-20 bg-primary mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <MotionCard key={post.id} index={index}>
              <PostCard
                post={post}
                locale={locale}
                dictionary={{
                  readMore: locale === 'de' ? "Weiterlesen" : "Read more"
                }}
                translation={translations[index] || null}
              />
            </MotionCard>
          ))}
        </div>
        
        {posts.length === 0 && (
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
      </main>
    </div>
  );
}

import React from 'react';
import { WordPressPost } from '@/lib/wordpress-api';
import { ParallaxHeader } from './parallax-header';
import { BlogPreviewGrid } from './blog-preview-grid';
import { Locale } from '@/i18n/config';

interface StyledCategoryPageProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  posts: WordPressPost[] | null | undefined;
  locale: Locale;
}

export function StyledCategoryPage({ 
  title, 
  subtitle, 
  backgroundImage, 
  posts,
  locale 
}: StyledCategoryPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ParallaxHeader
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        buttons={<div />}
      />
      
      <BlogPreviewGrid 
        posts={posts} 
        locale={locale} 
        title={locale === 'de' ? `Unsere ${title}` : `Our ${title}`} 
      />
    </div>
  );
} 
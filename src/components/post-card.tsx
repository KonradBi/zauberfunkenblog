'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { WordPressPost } from '@/lib/wordpress-api';

interface PostCardProps {
  post: WordPressPost;
  locale: string;
  readMoreText: string;
}

export function PostCard({ post, locale, readMoreText }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col bg-white border-none rounded-lg transition-all duration-300" style={{
        background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
        boxShadow: isHovered 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
          {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
            <>
              <motion.div
                animate={{
                  scale: isHovered ? 1.08 : 1,
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                  alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </motion.div>
              
              {/* Overlay-Effekt beim Hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Kategorie-Badge */}
              {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold border-transparent bg-primary text-primary-foreground">
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Kein Bild verfügbar</span>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2 pt-2">
          <CardDescription className="text-xs">
            {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
          <CardTitle className="line-clamp-2 text-xl text-primary-900">
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pb-4 pt-0 flex-grow">
          <div 
            className="line-clamp-2 text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button asChild variant="outline" className="w-full hover:bg-primary hover:text-white transition-all duration-300">
            <Link href={`/${locale}/post/${post.slug}`}>
              {readMoreText}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

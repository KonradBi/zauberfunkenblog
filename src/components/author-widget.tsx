'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthorWidgetProps {
  authorName: string;
  authorImage: string;
  authorBio: string;
  locale: string;
  dictionary: {
    learnMore: string;
  };
}

export function AuthorWidget({ authorName, authorImage, authorBio, locale, dictionary }: AuthorWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 top-24 z-50">
      <div className="relative">
        {/* Autor-Avatar (immer sichtbar) */}
        <motion.button
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer relative z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image 
            src={authorImage} 
            alt={authorName}
            fill
            className="object-cover"
          />
        </motion.button>

        {/* Expandierbarer Info-Bereich */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, width: 0, height: 0 }}
              animate={{ opacity: 1, y: 0, width: 'auto', height: 'auto' }}
              exit={{ opacity: 0, y: 10, width: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-5 w-72 border border-gray-200"
            >
              <h4 className="font-medium text-xl mb-3 text-primary">{authorName}</h4>
              
              <p className="text-sm text-gray-700 mb-3 font-medium">{authorBio}</p>
              
              <Link 
                href={`/${locale}/ueber-uns`}
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                {dictionary.learnMore}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

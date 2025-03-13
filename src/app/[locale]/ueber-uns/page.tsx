'use client';

import React from 'react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import Image from 'next/image';
import { ParallaxHeader } from '@/components/parallax-header';
import { motion } from 'framer-motion';
import { LuHeart } from 'react-icons/lu';

interface AboutUsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default function AboutUsPage({ params }: AboutUsPageProps) {
  // In client components, we need to use React.use() to unwrap the params Promise
  // We need to cast params to a Promise to use React.use()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrappedParams = React.use(params as any) as { locale: Locale };
  const locale = unwrappedParams.locale;
  const dictionary = getDictionary(locale);

  const placeholderText = {
    title: locale === 'de' ? 'Über uns' : 'About Us',
    subtitle: locale === 'de' ? 'Eine Familie auf Reisen' : 'A Family on the Road',
    description: locale === 'de' ?
      '[Platzhalter für persönliche Beschreibung der Familie und ihrer Reiseerlebnisse]' :
      '[Placeholder for personal description of the family and their travel experiences]'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ParallaxHeader
        title={dictionary.common.navigation.about}
        subtitle={placeholderText.subtitle}
        backgroundImage="https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80"
        buttons={<div />}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Intro Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <LuHeart className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold mb-6">
            {locale === 'de' ? 'Der Zauber des Reisens' : 'The Magic of Travel'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {locale === 'de' ? 
              'Als Rouven und Sue haben wir uns vor Jahren in das Abenteuer Familie gestürzt. Heute teilen wir unsere Erfahrungen und Erlebnisse, damit andere Familien ihre eigenen Wege finden können.' : 
              'As Rouven and Sue, we dove into the family adventure years ago. Today, we share our experiences so other families can find their own paths.'}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative aspect-[16/9] rounded-xl overflow-hidden mb-12"
          >
            <Image
              src="https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80"
              alt="Familie auf Reisen"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="prose prose-lg dark:prose-invert mx-auto"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {placeholderText.description}
            </p>
          </motion.div>
        </div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <LuHeart className="w-12 h-12 text-rose-500" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic">
            {locale === 'de' ? 
              '[Platzhalter für ein persönliches Zitat oder eine inspirierende Botschaft]' : 
              '[Placeholder for a personal quote or inspiring message]'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

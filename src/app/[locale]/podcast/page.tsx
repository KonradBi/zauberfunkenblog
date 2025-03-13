'use client';

import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { ParallaxHeader } from '@/components/parallax-header';
import { motion } from 'framer-motion';

import Image from 'next/image';

interface PodcastPageProps {
  params: {
    locale: Locale;
  };
}

interface PodcastPreview {
  title: string;
  description: string;
  image: string;
}

export default function PodcastPage({ params: { locale } }: PodcastPageProps) {
  const dictionary = getDictionary(locale);

  const upcomingEpisodes: PodcastPreview[] = [
    {
      title: locale === 'de' ? 'Reisen mit Kindern' : 'Traveling with Children',
      description: locale === 'de' ?
        'Praktische Tipps und Erfahrungen von Familien, die die Welt gemeinsam entdecken.' :
        'Practical tips and experiences from families discovering the world together.',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80'
    },
    {
      title: locale === 'de' ? 'Reisegeschichten aus erster Hand' : 'Travel Stories First Hand',
      description: locale === 'de' ?
        'Spannende Interviews mit erfahrenen Reisenden, die ihre einzigartigen Geschichten teilen.' :
        'Exciting interviews with experienced travelers sharing their unique stories.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80'
    },
    {
      title: locale === 'de' ? 'Geheimtipps & Abenteuer' : 'Hidden Gems & Adventures',
      description: locale === 'de' ?
        'Entdecke besondere Orte und außergewöhnliche Erlebnisse abseits der ausgetretenen Pfade.' :
        'Discover special places and extraordinary experiences off the beaten path.',
      image: 'https://images.unsplash.com/photo-1682686580003-22d3d65399a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ParallaxHeader
        title={dictionary.common.navigation.podcast}
        subtitle={locale === 'de' ? 
          'Geschichten, die das Reisen schreibt' : 
          'Stories that travel creates'}
        backgroundImage="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80"
        buttons={<div />}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Intro Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-light tracking-wide mb-6">
            {locale === 'de' ? 'Neue Episoden erscheinen in Kürze' : 'New Episodes Coming Soon'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {locale === 'de' ? 
              'Tauche ein in fesselnde Gespräche über das Reisen mit der Familie, entdecke inspirierende Geschichten und erhalte wertvolle Tipps von erfahrenen Reisenden.' : 
              'Dive into captivating conversations about family travel, discover inspiring stories, and get valuable tips from experienced travelers.'}
          </p>
        </motion.div>

        {/* Episode Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {upcomingEpisodes.map((episode, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="relative rounded-xl overflow-hidden group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={episode.image}
                  alt={episode.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-3">{episode.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{episode.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            {locale === 'de' ? 'Bleib auf dem Laufenden' : 'Stay Updated'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {locale === 'de' ?
              'Sei der Erste, der von neuen Episoden erfährt. Wir informieren dich, sobald es losgeht.' :
              'Be the first to know about new episodes. We\'ll let you know when we launch.'}
          </p>
          <div className="flex gap-4 justify-center">
            <input
              type="email"
              placeholder={locale === 'de' ? 'Deine E-Mail-Adresse' : 'Your email address'}
              className="px-6 py-3 border-b border-gray-300 w-full max-w-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:border-gray-500"
            />
            <button className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
              {locale === 'de' ? 'Anmelden' : 'Subscribe'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

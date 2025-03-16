'use client';

import React from 'react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { ParallaxHeader } from '@/components/parallax-header';
import { motion } from 'framer-motion';
import { FaMicrophone, FaHeadphones, FaPodcast } from 'react-icons/fa';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PodcastPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

interface PodcastPreview {
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
}

export default function PodcastPage({ params }: PodcastPageProps) {
  // In client components, we need to use React.use() to unwrap the params Promise
  // We need to cast params to a Promise to use React.use()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrappedParams = React.use(params as any) as { locale: Locale };
  const locale = unwrappedParams.locale;
  const dictionary = getDictionary(locale);

  const upcomingEpisodes: PodcastPreview[] = [
    {
      title: locale === 'de' ? 'Reisen mit Kindern' : 'Traveling with Children',
      description: locale === 'de' ?
        'Praktische Tipps und Erfahrungen von Familien, die die Welt gemeinsam entdecken.' :
        'Practical tips and experiences from families discovering the world together.',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80',
      icon: FaHeadphones
    },
    {
      title: locale === 'de' ? 'Reisegeschichten aus erster Hand' : 'Travel Stories First Hand',
      description: locale === 'de' ?
        'Spannende Interviews mit erfahrenen Reisenden, die ihre einzigartigen Geschichten teilen.' :
        'Exciting interviews with experienced travelers sharing their unique stories.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80',
      icon: FaMicrophone
    },
    {
      title: locale === 'de' ? 'Geheimtipps & Abenteuer' : 'Hidden Gems & Adventures',
      description: locale === 'de' ?
        'Entdecke besondere Orte und außergewöhnliche Erlebnisse abseits der ausgetretenen Pfade.' :
        'Discover special places and extraordinary experiences off the beaten path.',
      image: 'https://images.unsplash.com/photo-1682686580003-22d3d65399a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80',
      icon: FaPodcast
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <ParallaxHeader
        title={dictionary.common.navigation.podcast}
        subtitle={locale === 'de' ? 
          'Geschichten, die das Reisen schreibt' : 
          'Stories that travel creates'}
        backgroundImage="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80"
        buttons={<div />}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 -mt-24 relative z-10 pt-32">
        {/* Intro Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-900">
              {locale === 'de' ? 'Neue Episoden erscheinen in Kürze' : 'New Episodes Coming Soon'}
            </h2>
            <p className="text-lg text-gray-600">
              {locale === 'de' ? 
                'Tauche ein in fesselnde Gespräche über das Reisen mit der Familie, entdecke inspirierende Geschichten und erhalte wertvolle Tipps von erfahrenen Reisenden.' : 
                'Dive into captivating conversations about family travel, discover inspiring stories, and get valuable tips from experienced travelers.'}
            </p>
          </div>
        </motion.div>

        {/* Episode Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {upcomingEpisodes.map((episode, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform" style={{
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
              }}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={episode.image}
                    alt={episode.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105">
                      <episode.icon className="h-3 w-3 text-primary" />
                      {locale === 'de' ? 'Podcast' : 'Podcast'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
                  <h3 className="text-xl font-bold mb-3 text-primary-900">{episode.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{episode.description}</p>
                  <Button variant="outline" className="w-fit mt-auto hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                    {locale === 'de' ? 'Bald verfügbar' : 'Coming Soon'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/15 to-primary/5 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-4xl mx-auto"
        >
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-3">
              {locale === 'de' ? 'Newsletter' : 'Newsletter'}
            </span>
            <h3 className="text-2xl font-bold mb-4 text-primary-900">
              {locale === 'de' ? 'Bleib auf dem Laufenden' : 'Stay Updated'}
            </h3>
            <p className="text-gray-600 mb-6">
              {locale === 'de' ?
                'Sei der Erste, der von neuen Episoden erfährt. Wir informieren dich, sobald es losgeht.' :
                'Be the first to know about new episodes. We\'ll let you know when we launch.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-white p-2 rounded-lg shadow-md">
            <input
              type="email"
              placeholder={locale === 'de' ? 'Deine E-Mail-Adresse' : 'Your email address'}
              className="flex-grow px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
              required
            />
            <Button type="submit" className="whitespace-nowrap shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
              {locale === 'de' ? 'Anmelden' : 'Subscribe'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            {locale === 'de' ? 'Wir respektieren deine Privatsphäre. Abmeldung jederzeit möglich.' : 'We respect your privacy. Unsubscribe at any time.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

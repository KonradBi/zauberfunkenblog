'use client';

import * as React from 'react';

import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import Image from 'next/image';
import { ParallaxHeader } from '@/components/parallax-header';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaGlobeEurope, FaBicycle, FaTrain } from 'react-icons/fa';
import { MdLocalDining, MdHotel } from 'react-icons/md';

interface SustainableTravelPageProps {
  params: {
    locale: Locale;
  };
}

export default function SustainableTravelPage({ params }: SustainableTravelPageProps) {
  // In client components, we need to use React.use() to unwrap the params Promise
  // We need to cast params to a Promise to use React.use()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrappedParams = React.use(params as any) as { locale: Locale };
  const locale = unwrappedParams.locale;
  const dictionary = getDictionary(locale);
  
  // CO₂ Calculator state
  const [transportMode, setTransportMode] = useState<'train' | 'plane' | 'car' | 'bicycle'>('train');
  const [distance, setDistance] = useState(500);
  const [travelers, setTravelers] = useState(2);
  const [showDetails, setShowDetails] = useState(false);
  
  // CO₂ emissions per km per person for different transport modes (in kg)
  const emissionFactors = {
    train: 0.041,
    plane: 0.255,
    car: 0.171,
    bicycle: 0.0
  };
  
  // Calculate CO₂ emissions
  const calculateEmissions = (mode: 'train' | 'plane' | 'car' | 'bicycle', dist: number, trav: number) => {
    const emissions = emissionFactors[mode] * dist * trav;
    return parseFloat(emissions.toFixed(1));
  };
  
  // Calculate savings compared to flight
  const calculateSavings = (mode: 'train' | 'plane' | 'car' | 'bicycle', dist: number, trav: number) => {
    const currentEmissions = emissionFactors[mode] * dist * trav;
    const flightEmissions = emissionFactors.plane * dist * trav;
    const savingsPercent = ((flightEmissions - currentEmissions) / flightEmissions) * 100;
    return Math.round(savingsPercent);
  };
  
  // Calculate tree equivalent
  const calculateTrees = (mode: 'train' | 'plane' | 'car' | 'bicycle', dist: number, trav: number) => {
    // Average tree absorbs about 22kg CO₂ per year
    const treeAbsorptionPerYear = 22;
    const emissions = emissionFactors[mode] * dist * trav;
    const trees = emissions / treeAbsorptionPerYear;
    return parseFloat(trees.toFixed(1));
  };

  const stats = [
    { 
      icon: FaTrain, 
      value: '70%', 
      label: locale === 'de' ? 'CO₂-Einsparung mit Zug statt Flug' : 'CO₂ saved by train vs. flight',
      highlight: locale === 'de' ? 'Eine Zugfahrt von Berlin nach Paris spart 130kg CO₂' : 'A train journey from Berlin to Paris saves 130kg CO₂'
    },
    { 
      icon: FaGlobeEurope, 
      value: '80%', 
      label: locale === 'de' ? 'Europareisen mit Bahn' : 'European trips by train',
      highlight: locale === 'de' ? 'Entspanntes Reisen mit Panorama-Ausblick' : 'Relaxed travel with panoramic views'
    },
  ];

  const principles = [
    {
      icon: FaBicycle,
      title: locale === 'de' ? 'Aktiv & Gesund Unterwegs' : 'Active & Healthy Travel',
      description: locale === 'de' ? 'Mit Fahrrad oder zu Fuß die Umgebung erkunden' : 'Explore the surroundings by bike or on foot',
      benefits: locale === 'de' ? [
        'Bewegung in frischer Luft',
        'Flexibilität bei der Routenwahl',
        'Kein CO₂-Ausstoß',
        'Authentische Eindrücke',
        'Kostengünstig'
      ] : [
        'Exercise in fresh air',
        'Flexible route choices',
        'No CO₂ emissions',
        'Authentic impressions',
        'Cost-effective'
      ]
    },
    {
      icon: MdLocalDining,
      title: locale === 'de' ? 'Regionale Küche' : 'Local Cuisine',
      description: locale === 'de' ? 'Saisonale Spezialitäten entdecken' : 'Discover seasonal specialties',
      benefits: locale === 'de' ? [
        'Unterstützung lokaler Produzenten',
        'Frische Zutaten',
        'Weniger Transportwege',
        'Authentische Geschmäcker',
        'Traditionelle Rezepte'
      ] : [
        'Support local producers',
        'Fresh ingredients',
        'Reduced transportation',
        'Authentic flavors',
        'Traditional recipes'
      ]
    },
    {
      icon: MdHotel,
      title: locale === 'de' ? 'Nachhaltige Unterkünfte' : 'Eco-Friendly Stays',
      description: locale === 'de' ? 'Umweltbewusst übernachten' : 'Environmentally conscious accommodation',
      benefits: locale === 'de' ? [
        'Energieeffiziente Gebäude',
        'Regionale Produkte',
        'Abfallvermeidung',
        'Wassersparende Maßnahmen',
        'Lokale Arbeitsplätze'
      ] : [
        'Energy-efficient buildings',
        'Regional products',
        'Waste reduction',
        'Water-saving measures',
        'Local employment'
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ParallaxHeader
        title={dictionary.common.navigation.sustainable}
        subtitle={locale === 'de' ? 'Verantwortungsvoll reisen, nachhaltig genießen' : 'Travel responsibly, enjoy sustainably'}
        backgroundImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80"
        buttons={<div />}
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative h-[200px] rounded-xl overflow-hidden group"
            >
              <Image
                src={index === 0 ? 
                  'https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80' : 
                  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80'}
                alt={stat.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-white/90" />
                </div>
                <div className="text-5xl font-bold mb-2 text-center">{stat.value}</div>
                <div className="text-lg mb-2 text-center text-white/90">{stat.label}</div>
                <div className="text-sm text-center text-white/80 italic">{stat.highlight}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative h-[500px] rounded-xl overflow-hidden group"
            >
              <Image
                src={index === 0 ? 
                  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80' :
                  index === 1 ?
                  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80' :
                  'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80'}
                alt={principle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="flex items-center mb-4">
                  <principle.icon className="w-8 h-8 text-white/90" />
                  <h3 className="text-2xl font-bold ml-3">{principle.title}</h3>
                </div>
                <p className="text-white/90 mb-6">{principle.description}</p>
                <ul className="space-y-3">
                  {principle.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 mr-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Content */}
        <div className="max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="relative h-[300px] md:h-[500px]">
                <Image
                  src="/images/vietnamzauberfunken.jpg"
                  alt={locale === 'de' ? 'Zauberfunken in Vietnam' : 'Zauberfunken in Vietnam'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </div>
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-10 md:p-12 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-8 text-white">
                  {locale === 'de' ? 'Unser Ansatz' : 'Our Approach'}
                </h2>
                <p className="text-white/90 text-xl leading-relaxed mb-6">
                  {locale === 'de' 
                    ? 'Nachhaltiges Reisen ist für uns kein Verzicht, sondern ein Gewinn an Authentizität und Tiefe. Wir haben festgestellt, dass gerade die langsameren, bewussteren Reisen die schönsten Erinnerungen schaffen.'
                    : 'For us, sustainable travel is not about sacrifice, but about gaining authenticity and depth. We\'ve found that slower, more mindful journeys create the most beautiful memories.'}
                </p>
                <p className="text-white/90 text-xl leading-relaxed">
                  {locale === 'de' 
                    ? 'Ob wir mit dem Zug durch Europa reisen, auf lokalen Märkten einkaufen oder in familiengeführten Unterkünften übernachten – die Verbindung zu Orten und Menschen wird intensiver, wenn wir bewusst reisen.'
                    : 'Whether we\'re traveling through Europe by train, shopping at local markets, or staying in family-run accommodations – our connection to places and people becomes more intense when we travel mindfully.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CO₂ Calculator */}
        <div className="max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl overflow-hidden bg-gradient-to-br from-teal-900 to-blue-900 p-8 md:p-10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8 text-center text-white">
                {locale === 'de' ? 'CO₂-Rechner für deine Reise' : 'CO₂ Calculator for your Trip'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {locale === 'de' ? 'Transportmittel' : 'Transportation'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setTransportMode('train')}
                        className={`transport-btn flex items-center justify-center ${transportMode === 'train' ? 'bg-teal-600' : 'bg-white/5'} hover:bg-teal-500 text-white rounded-lg p-3 transition-colors w-full`}
                      >
                        <FaTrain className="mr-2" />
                        {locale === 'de' ? 'Zug' : 'Train'}
                      </button>
                      <button 
                        onClick={() => setTransportMode('plane')}
                        className={`transport-btn flex items-center justify-center ${transportMode === 'plane' ? 'bg-teal-600' : 'bg-white/5'} hover:bg-teal-500 text-white rounded-lg p-3 transition-colors w-full`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                        {locale === 'de' ? 'Flugzeug' : 'Plane'}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setTransportMode('car')}
                        className={`transport-btn flex items-center justify-center ${transportMode === 'car' ? 'bg-teal-600' : 'bg-white/5'} hover:bg-teal-500 text-white rounded-lg p-3 transition-colors w-full`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Zm-8.962 3.712a.75.75 0 0 1 0 1.061l-1.591 1.591a.75.75 0 1 1-1.061-1.06l1.591-1.592a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                        {locale === 'de' ? 'Auto' : 'Car'}
                      </button>
                      <button 
                        onClick={() => setTransportMode('bicycle')}
                        className={`transport-btn flex items-center justify-center ${transportMode === 'bicycle' ? 'bg-teal-600' : 'bg-white/5'} hover:bg-teal-500 text-white rounded-lg p-3 transition-colors w-full`}
                      >
                        <FaBicycle className="mr-2" />
                        {locale === 'de' ? 'Fahrrad' : 'Bicycle'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {locale === 'de' ? 'Entfernung' : 'Distance'}
                  </h3>
                  
                  <div className="mb-6">
                    <label className="block text-white/80 text-sm mb-2">
                      {locale === 'de' ? 'Strecke in Kilometern' : 'Distance in kilometers'}
                    </label>
                    <input 
                      type="range" 
                      min="50" 
                      max="2000" 
                      value={distance}
                      onChange={(e) => setDistance(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-white/60 text-sm mt-1">
                      <span>50km</span>
                      <span className="text-white font-medium">{distance}km</span>
                      <span>2000km</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      {locale === 'de' ? 'Anzahl der Reisenden' : 'Number of travelers'}
                    </label>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="bg-white/5 hover:bg-white/10 text-white rounded-lg w-10 h-10 flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="text-white text-xl font-medium">{travelers}</span>
                      <button 
                        onClick={() => setTravelers(Math.min(10, travelers + 1))}
                        className="bg-white/5 hover:bg-white/10 text-white rounded-lg w-10 h-10 flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-white/80 mb-1">{locale === 'de' ? 'CO₂-Ausstoß' : 'CO₂ Emissions'}</div>
                    <div className="text-3xl font-bold text-white">{calculateEmissions(transportMode, distance, travelers)} <span className="text-lg font-normal">kg</span></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white/80 mb-1">{locale === 'de' ? 'Einsparung vs. Flug' : 'Savings vs. Flight'}</div>
                    <div className="text-3xl font-bold text-teal-400">{calculateSavings(transportMode, distance, travelers)}% <span className="text-lg font-normal text-teal-400/80">CO₂</span></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white/80 mb-1">{locale === 'de' ? 'Entspricht' : 'Equivalent to'}</div>
                    <div className="text-3xl font-bold text-white">{calculateTrees(transportMode, distance, travelers)} <span className="text-lg font-normal">{locale === 'de' ? 'Bäume' : 'trees'}</span></div>
                  </div>
                </div>

                {showDetails && (
                  <div className="mt-6 p-4 bg-white/5 rounded-lg text-sm text-white/80">
                    <h4 className="font-medium text-white mb-2">{locale === 'de' ? 'Berechnungsdetails' : 'Calculation details'}</h4>
                    <p>{locale === 'de' ? 'Emissionsfaktoren pro Person pro km:' : 'Emission factors per person per km:'}</p>
                    <ul className="list-disc list-inside mt-1 mb-2">
                      <li>{locale === 'de' ? 'Zug' : 'Train'}: {emissionFactors.train} kg</li>
                      <li>{locale === 'de' ? 'Flugzeug' : 'Plane'}: {emissionFactors.plane} kg</li>
                      <li>{locale === 'de' ? 'Auto' : 'Car'}: {emissionFactors.car} kg</li>
                      <li>{locale === 'de' ? 'Fahrrad' : 'Bicycle'}: {emissionFactors.bicycle} kg</li>
                    </ul>
                    <p>
                      {locale === 'de' 
                        ? `Die Gesamtemissionen werden berechnet als: Emissionsfaktor × Distanz × Anzahl der Reisenden.` 
                        : `Total emissions are calculated as: emission factor × distance × number of travelers.`}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <motion.button
                  onClick={() => setShowDetails(!showDetails)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-teal-900/20"
                >
                  {locale === 'de' 
                    ? (showDetails ? 'Details ausblenden' : 'Details anzeigen') 
                    : (showDetails ? 'Hide Details' : 'Show Details')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

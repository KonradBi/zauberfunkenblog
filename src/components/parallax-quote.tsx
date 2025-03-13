'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxQuoteProps {
  quote: string;
  author?: string;
  backgroundImage: string;
  locale: string; // Behalten für zukünftige Lokalisierungsfunktionen
}

export function ParallaxQuote({ quote, author, backgroundImage }: ParallaxQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Transformationen für verschiedene Ebenen
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.7]);
  
  // Transformationen für das Zitat
  const quoteY = useTransform(scrollYProgress, [0, 0.5, 1], ['50px', '0px', '-50px']);
  const quoteOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const quoteScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.8, 1.1, 0.9]);
  
  // Transformationen für die Anführungszeichen
  const quoteMarkScale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.7, 1.2, 0.7]);
  const quoteMarkRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  
  // Transformationen für den Autor
  const authorY = useTransform(scrollYProgress, [0.3, 0.5, 0.7], ['20px', '0px', '-20px']);
  const authorOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  
  // Dynamische Farbverläufe
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ['0deg', '30deg']);

  return (
    <div 
      ref={containerRef}
      className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center perspective-[1000px]"
    >
      {/* Hintergrundbild mit Parallax-Effekt */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: bgY,
          scale: bgScale,
          backgroundImage: `url("${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Farbverlauf-Overlay mit dynamischer Änderung */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{
          opacity: overlayOpacity,
          background: `linear-gradient(${gradientPosition}, rgba(0,0,0,0.7), rgba(20,20,20,0.5), rgba(40,40,40,0.3))`,
        }}
      />
      
      {/* Inhalt-Container */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center">
        {/* Anführungszeichen mit eigenem Effekt */}
        <motion.div
          className="mb-4 text-white/80"
          style={{
            scale: quoteMarkScale,
            rotate: quoteMarkRotate,
          }}
        >
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </motion.div>
        
        {/* Zitat mit eigenem Effekt */}
        <motion.p 
          className="text-2xl md:text-4xl font-light italic mb-8 quote text-white drop-shadow-lg"
          style={{
            y: quoteY,
            opacity: quoteOpacity,
            scale: quoteScale,
            transformStyle: 'preserve-3d',
            transformPerspective: '1000px',
          }}
        >
          {quote}
        </motion.p>
        
        {/* Autor mit eigenem Effekt */}
        {author && (
          <motion.p 
            className="text-lg md:text-xl font-medium quote text-white/90"
            style={{
              y: authorY,
              opacity: authorOpacity,
            }}
          >
            — {author}
          </motion.p>
        )}
      </div>
      
      {/* Zusätzlicher Tiefeneffekt */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 h-32 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
          y: useTransform(scrollYProgress, [0, 1], ['0%', '50%']),
        }}
      />
    </div>
  );
}

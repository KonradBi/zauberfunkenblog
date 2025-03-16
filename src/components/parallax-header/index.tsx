'use client';

import React, { useEffect, useRef, useState } from 'react';
// Die Animationen wurden in die globals.css verschoben

interface ParallaxHeaderProps {
  title: string;
  subtitle: string;
  buttons: React.ReactNode;
  backgroundImage: string;
}

export function ParallaxHeader({ 
  title,
  subtitle,
  buttons,
  backgroundImage,
}: ParallaxHeaderProps) {
  const [offset, setOffset] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        // Calculate how far we've scrolled
        const scrollY = window.scrollY;
        // Apply parallax effect
        setOffset(scrollY * 0.5);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={headerRef} className="relative w-full h-[90vh] overflow-hidden">
      {/* Background image with parallax effect */}
      <div 
        className="absolute inset-0 w-full h-[calc(100%+200px)] bg-cover bg-center animate-fade-in"
        style={{
          transform: `translateY(-${offset}px)`,
          backgroundImage: `url(${backgroundImage})`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div 
            className="max-w-4xl mx-auto space-y-8 text-center"
            style={{
              transform: `translateY(${offset * 0.2}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/90 drop-shadow-xl animate-fade-in-up leading-tight">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-[700px] mx-auto drop-shadow-md animate-fade-in-up animation-delay-300 font-light leading-relaxed">
                {subtitle}
              </p>
            </div>
            <div className="pt-8 animate-fade-in-up animation-delay-600">
              {buttons}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}


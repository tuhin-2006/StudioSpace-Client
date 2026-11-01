'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Video, Camera, Mic } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  badge: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'Production Workspaces',
    icon: Camera,
    title: 'Book World-Class',
    highlight: 'Creative Studios',
    subtitle:
      'From 2-wall cycloramas to sound-isolated voice booths and virtual LED volumes. Discover and reserve professional creative spaces on your own schedule.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=85',
    badge: 'Trending: Brooklyn Cyc Lofts',
  },
  {
    id: 2,
    tag: 'Cinema & Broadcast',
    icon: Video,
    title: 'Sound Stages for',
    highlight: 'Film & Commercials',
    subtitle:
      'Engineered with 3-phase camlock power, pre-lit acoustic grids, silent HVAC, and drive-in vehicle bays for uncompromising cinematic storytelling.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85',
    badge: 'Featured: 4K Broadcast Stages',
  },
  {
    id: 3,
    tag: 'Audio Engineering',
    icon: Mic,
    title: 'Acoustic Sanctuaries &',
    highlight: 'Dolby Atmos Suites',
    subtitle:
      'Pristine tracking live rooms, tube microphone arrays, and analog mixing consoles tuned by world-class acoustic architects for producers and musicians.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1800&q=85',
    badge: 'Pro Audio: Shure SM7B Lounges',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div
      className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] overflow-hidden bg-slate-950 text-white select-none"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image Slides with Smooth Crossfade */}
      {slides.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center" />
          {/* Multi-layered cinematic overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Category Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-300">
            <Icon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{slide.tag}</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span className="text-white/80">{slide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            {slide.title} <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed">
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Studios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Host Your Space</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Left / Right Nav Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all rounded-full ${
              index === current ? 'w-8 h-2 bg-indigo-500 shadow-md shadow-indigo-500/50' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Film, Mic, Music, Palette, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Photo Studio',
    label: 'Photo Studios',
    icon: Camera,
    description: 'Daylight cyclorama walls, strobe lighting packages, and fashion editorial lofts.',
    count: '24+ Spaces',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-500',
    borderColor: 'group-hover:border-amber-500/40',
  },
  {
    name: 'Sound Stage',
    label: 'Sound Stages',
    icon: Film,
    description: 'Pre-lit cinema grids, soundproofed acoustic volumes, and camera packages.',
    count: '16+ Stages',
    color: 'from-blue-500/20 to-indigo-500/10 text-blue-500',
    borderColor: 'group-hover:border-blue-500/40',
  },
  {
    name: 'Podcast Room',
    label: 'Podcast Lounges',
    icon: Mic,
    description: 'Multi-cam 4K broadcast setups, Shure SM7B mics, and custom acoustic slat walls.',
    count: '32+ Lounges',
    color: 'from-purple-500/20 to-pink-500/10 text-purple-500',
    borderColor: 'group-hover:border-purple-500/40',
  },
  {
    name: 'Music Suite',
    label: 'Music Suites',
    icon: Music,
    description: 'Dolby Atmos monitoring, analog outboard preamps, and vocal tracking booths.',
    count: '19+ Suites',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500',
    borderColor: 'group-hover:border-emerald-500/40',
  },
  {
    name: 'Art Workshop',
    label: 'Art Workshops',
    icon: Palette,
    description: 'Pottery wheels, canvas lofts, clean air scrubbers, and sculptor ateliers.',
    count: '12+ Workshops',
    color: 'from-rose-500/20 to-pink-500/10 text-rose-500',
    borderColor: 'group-hover:border-rose-500/40',
  },
];

export function CategoryCards() {
  return (
    <section className="py-16 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              Curated Spaces
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Browse by Studio Category
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Filter by production discipline to find spaces customized with specialized equipment and acoustics.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.name)}`}
                className={`group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${cat.borderColor}`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400 dark:text-slate-500">{cat.count}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

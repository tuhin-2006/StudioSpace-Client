'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import { apiFetch } from '@/lib/api';
import { StudioCard } from './StudioCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FeaturedStudiosSection() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        // Fetch dynamically from MongoDB with limit(6) and rating_desc/featured
        const res = await apiFetch('/studios?limit=6&sort=rating_desc');
        if (res.success && res.studios) {
          setStudios(res.studios);
        }
      } catch (err) {
        console.error('Failed to load featured studios:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editor&apos;s Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Studio Spaces
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Top-rated production suites and studio environments dynamically pulled from our creator network.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            <span>Explore All Workspaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : studios.length > 0 ? (
          /* Dynamic Grid of 6 Featured Studios */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No featured studios loaded yet</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Seed the database via `/api/seed` or add a new workspace to see dynamic studios here.
            </p>
            <Link
              href="/add-studio"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
            >
              List First Studio
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

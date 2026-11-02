'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Studio } from '@/types';
import { apiFetch } from '@/lib/api';
import { StudioCard } from '@/components/StudioCard';
import { Search, SlidersHorizontal, Sparkles, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Photo Studio',
  'Sound Stage',
  'Podcast Room',
  'Music Suite',
  'Art Workshop',
];

function StudiosContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Keep query params in sync if user arrived via direct link
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchStudios() {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }
        if (sortOption) {
          params.append('sort', sortOption);
        }

        const res = await apiFetch(`/studios?${params.toString()}`);
        if (res.success && res.studios) {
          setStudios(res.studios);
        }
      } catch (err) {
        console.error('Failed to load studios:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchStudios();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, sortOption]);

  const resetFilters = () => {
    startTransition(() => {
      setSelectedCategory('All');
      setSearchTerm('');
      setSortOption('newest');
    });
  };

  return (
    <div className="py-14 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Creative Workspaces Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore Production Studios
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2.5 leading-relaxed">
            Filter by cyclorama dimensions, sound isolation ratings, or 4K podcast broadcast rigs across our vetted creator network.
          </p>
        </div>

        {/* Live Region for Screen Reader Announcements */}
        <div aria-live="polite" className="visually-hidden">
          {loading ? 'Updating studios directory...' : `Showing ${studios.length} creative studios`}
        </div>

        {/* Filter Controls Bar */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* Top Row: Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            {/* Search Input with Explicit Label */}
            <div className="relative w-full sm:max-w-md">
              <label htmlFor="studio-search-input" className="visually-hidden">
                Search studios by name, neighborhood, or equipment
              </label>
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id="studio-search-input"
                type="text"
                placeholder="Search by studio name, city, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
              />
            </div>

            {/* Sort Dropdown with Explicit Label */}
            <div className="flex items-center gap-2.5 justify-end">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <label htmlFor="studio-sort-select" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Sort By:
              </label>
              <select
                id="studio-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 min-h-[44px]"
              >
                <option value="newest">Newest First</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Filter Pills */}
          <div
            role="group"
            aria-label="Filter studios by category"
            className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-none"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[40px] flex items-center ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <p>
            Showing <strong className="text-slate-900 dark:text-white font-black">{studios.length}</strong> creative workspace{studios.length === 1 ? '' : 's'}
          </p>
          {(selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline min-h-[36px]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading studios directory">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : studios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          /* Empty State Display (Requirement #6) */
          <div className="text-center p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center">
              <Search className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Studios Match Your Search</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any workspaces matching &quot;{searchTerm || selectedCategory}&quot;. Try adjusting your keywords or browse all categories.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all min-h-[44px]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center" aria-label="Loading studios directory">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StudiosContent />
    </Suspense>
  );
}

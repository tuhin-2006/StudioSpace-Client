'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudioCard } from '@/components/StudioCard';
import { apiFetch } from '@/lib/api';
import { Heart, Compass } from 'lucide-react';

function WishlistContent() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/wishlist');
      if (res.success && res.studios) {
        setStudios(res.studios);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleToggle = (studioId: string, isSaved: boolean) => {
    if (!isSaved) {
      setStudios((prev) => prev.filter((s) => s._id !== studioId));
    }
  };

  return (
    <div className="py-14 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/60 text-xs font-bold text-pink-600 dark:text-pink-400 mb-2">
            <Heart className="w-3.5 h-3.5 fill-pink-500" aria-hidden="true" />
            <span>Saved Workspaces</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Workspaces and production stages you&apos;ve bookmarked for upcoming creative productions.
          </p>
        </div>

        {/* Live announcement region */}
        <div aria-live="polite" className="visually-hidden">
          {loading ? 'Loading wishlist items...' : `${studios.length} items in wishlist`}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse" aria-label="Loading wishlist items">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] bg-white dark:bg-slate-900 rounded-3xl" />
            ))}
          </div>
        ) : studios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                initialSaved={true}
                onWishlistToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 sm:p-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Click the heart icon on any creative workspace to bookmark it to your personal production wishlist!
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all min-h-[44px]"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Explore Workspaces</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}

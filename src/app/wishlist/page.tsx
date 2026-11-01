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
    <div className="py-12 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-xs font-bold text-pink-600 dark:text-pink-400 mb-2">
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>Saved Workspaces</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Workspaces and production stages you&apos;ve bookmarked for upcoming creative productions.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
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
          <div className="text-center p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 mx-auto flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Click the heart icon on any creative workspace to save it to your personal production wishlist!
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <Compass className="w-4 h-4" />
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

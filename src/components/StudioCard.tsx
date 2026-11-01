'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import { Star, MapPin, Users, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface StudioCardProps {
  studio: Studio;
  initialSaved?: boolean;
  onWishlistToggle?: (studioId: string, isSaved: boolean) => void;
}

export function StudioCard({ studio, initialSaved = false, onWishlistToggle }: StudioCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please log in to save workspaces to your wishlist.');
      return;
    }

    try {
      setSaving(true);
      const res = await apiFetch('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ studioId: studio._id }),
      });

      if (res.success) {
        setIsSaved(res.isSaved);
        toast.success(res.message);
        if (onWishlistToggle) {
          onWishlistToggle(studio._id, res.isSaved);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
      {/* Studio Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.imageUrl}
          alt={studio.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay on Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm">
            {studio.category}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={saving}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-transform active:scale-90"
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-white hover:text-rose-400'
            }`}
          />
        </button>

        {/* Hourly Rate Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3">
          <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-extrabold text-sm flex items-baseline gap-1">
            <span className="text-emerald-400 text-base">${studio.hourlyRate}</span>
            <span className="text-xs text-slate-300 font-normal">/ hr</span>
          </div>
        </div>

        {/* Rating Badge (Bottom Right) */}
        <div className="absolute bottom-3 right-3">
          <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{studio.rating ? studio.rating.toFixed(1) : '4.9'}</span>
            <span className="text-slate-400 font-normal text-[10px]">({studio.reviewsCount || 12})</span>
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {studio.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{studio.location}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Up to {studio.maxCapacity} guests</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {studio.overview}
          </p>
        </div>

        {/* Bottom CTA Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Deposit: <span className="font-semibold text-slate-700 dark:text-slate-300">${studio.securityDeposit || 0}</span>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

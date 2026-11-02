'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import { Star, MapPin, Users, Heart, Sparkles } from 'lucide-react';
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

  // Preview up to 2 key amenities
  const previewAmenities = studio.amenities?.slice(0, 2) || [];

  return (
    <article className="group flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
      {/* Studio Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.imageUrl}
          alt={`Studio workspace: ${studio.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/10">
            {studio.category}
          </span>
        </div>

        {/* Accessible Wishlist Heart Button (WCAG 2.5.8 Target Size >= 44x44px) */}
        <button
          onClick={handleToggleWishlist}
          disabled={saving}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${studio.title} from wishlist` : `Save ${studio.title} to wishlist`}
          className="absolute top-2.5 right-2.5 min-w-[44px] min-h-[44px] rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md text-white transition-all flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-white hover:text-rose-400'
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Hourly Rate Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white font-extrabold text-sm flex items-baseline gap-1 border border-white/10">
            <span className="text-emerald-400 text-base">${studio.hourlyRate}</span>
            <span className="text-xs text-slate-300 font-normal">/ hr</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3">
          <div
            className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 border border-white/10"
            aria-label={`Rated ${studio.rating ? studio.rating.toFixed(1) : '4.9'} out of 5 stars based on ${studio.reviewsCount || 12} reviews`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span>{studio.rating ? studio.rating.toFixed(1) : '4.9'}</span>
            <span className="text-slate-400 font-normal text-[11px]">({studio.reviewsCount || 12})</span>
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {studio.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{studio.location}</span>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
            <span>Up to {studio.maxCapacity} guests</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {studio.overview}
          </p>

          {/* Quick Equipment / Amenities Tags */}
          {previewAmenities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {previewAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" aria-hidden="true" />
                  <span className="truncate max-w-[150px]">{amenity}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA Row with Explicit Accessibility Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Deposit:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              ${studio.securityDeposit || 0}
            </span>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="px-4 py-2 min-h-[44px] flex items-center justify-center rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
          >
            <span>View Details</span>
            <span className="visually-hidden">for {studio.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

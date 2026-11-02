'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Studio } from '@/types';
import { apiFetch } from '@/lib/api';
import { BookingModal } from '@/components/BookingModal';
import {
  Star,
  MapPin,
  Users,
  CheckCircle,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

function StudioDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const studioId = params?.id as string;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadStudio() {
      try {
        setLoading(true);
        const res = await apiFetch(`/studios/${studioId}`);
        if (res.success && res.studio) {
          setStudio(res.studio);
        } else {
          router.push('/404');
        }
      } catch (err) {
        console.error('Failed to load studio details:', err);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    }

    if (studioId) {
      loadStudio();
    }
  }, [studioId, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse" aria-label="Loading studio details">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          </div>
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!studio) return null;

  const gallery = studio.galleryImages?.length > 0 ? studio.galleryImages : [studio.imageUrl];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Workspace link copied to clipboard!');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.info('Please log in to save workspaces.');
      return;
    }
    try {
      const res = await apiFetch('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ studioId: studio._id }),
      });
      if (res.success) {
        setIsSaved(res.isSaved);
        toast.success(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Wishlist update failed');
    }
  };

  return (
    <div className="py-12 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Title & Location Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              <span>{studio.category}</span>
              <span aria-hidden="true">•</span>
              <span
                className="flex items-center gap-1"
                aria-label={`Rated ${studio.rating ? studio.rating.toFixed(1) : '4.9'} out of 5 stars`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span>{studio.rating ? studio.rating.toFixed(1) : '4.9'}</span>
                <span className="text-slate-400 font-normal">({studio.reviewsCount || 12} reviews)</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {studio.title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
              <span>{studio.address || studio.location}</span>
            </div>
          </div>

          {/* Quick Actions (Share, Wishlist) */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Share workspace link"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Gallery Carousel / Viewer */}
        <section aria-label="Studio Photo Gallery" className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl aspect-[16/9] md:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery[activeImageIndex]}
            alt={`${studio.title} - Photo ${activeImageIndex + 1} of ${gallery.length}`}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Carousel Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center hover:scale-105"
                aria-label="Previous gallery image"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center hover:scale-105"
                aria-label="Next gallery image"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Thumbnail dots with Accessible Tablist */}
          {gallery.length > 1 && (
            <div
              role="tablist"
              aria-label="Studio images"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10"
            >
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === activeImageIndex}
                  onClick={() => setActiveImageIndex(idx)}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center p-0 bg-transparent border-0 focus:outline-none"
                  aria-label={`View Image ${idx + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all ${
                      idx === activeImageIndex ? 'bg-indigo-400 w-6 h-2' : 'bg-white/50 hover:bg-white w-2 h-2'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Highlights Bar */}
            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Capacity
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                  {studio.maxCapacity} Guests
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Security Deposit
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  ${studio.securityDeposit || 0}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Discipline
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  {studio.category}
                </span>
              </div>
            </div>

            {/* Overview */}
            <section aria-labelledby="overview-heading" className="space-y-4">
              <h2 id="overview-heading" className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Workspace Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {studio.overview}
              </p>
            </section>

            {/* Amenities List */}
            <section aria-labelledby="amenities-heading" className="space-y-4">
              <h2 id="amenities-heading" className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Studio Amenities & Production Gear
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {studio.amenities?.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Host Details Card */}
            <section aria-labelledby="host-heading" className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 id="host-heading" className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Studio Host & Verified Facility Manager
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 ring-2 ring-indigo-500/20 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      studio.hostAvatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={studio.hostName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{studio.hostName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Host on StudioSpace • Verified ID • Response time &lt; 15 mins
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Contact: {studio.hostEmail}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Booking Sidebar Column (4 cols) */}
          <div className="lg:col-span-4">
            <aside aria-label="Instant Reservation" className="sticky top-24 p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
              {/* Hourly Pricing Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-4xl font-black text-slate-900 dark:text-white">${studio.hourlyRate}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-bold">/ shoot hour</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  Live Availability
                </div>
              </div>

              {/* Booking Highlights */}
              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Security Deposit</span>
                  <span className="font-bold text-slate-900 dark:text-white">${studio.securityDeposit || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max Creator Team</span>
                  <span className="font-bold text-slate-900 dark:text-white">{studio.maxCapacity} people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="font-bold text-slate-900 dark:text-white">{studio.location}</span>
                </div>
              </div>

              {/* CTA Booking Button launching Booking Modal */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Book Workspace Now</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 leading-relaxed">
                You will not be billed until your reservation time slot is validated and confirmed by the automated collision guard.
              </p>
            </aside>
          </div>
        </div>
      </div>

      {/* Booking Modal Dialog */}
      <BookingModal
        studio={studio}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

export default function StudioDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center" aria-label="Loading studio workspace">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StudioDetailsContent />
    </React.Suspense>
  );
}

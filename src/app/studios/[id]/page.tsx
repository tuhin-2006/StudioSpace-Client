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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          </div>
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
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
    <div className="py-10 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title & Location Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <span>{studio.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {studio.rating ? studio.rating.toFixed(1) : '4.9'} ({studio.reviewsCount || 12} reviews)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {studio.title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{studio.address || studio.location}</span>
            </div>
          </div>

          {/* Quick Actions (Share, Wishlist) */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              title="Share workspace link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              title="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Gallery Carousel / Viewer */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl aspect-[16/9] md:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery[activeImageIndex]}
            alt={studio.title}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Carousel Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnail dots */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeImageIndex ? 'bg-indigo-400 w-6' : 'bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Thumbnail ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Highlights Bar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Capacity
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  {studio.maxCapacity} Guests
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Security Deposit
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  ${studio.securityDeposit || 0}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Category
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {studio.category}
                </span>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Overview</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Amenities List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Studio Amenities & Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studio.amenities?.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Details Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Studio Host</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 ring-2 ring-indigo-500/20 flex-shrink-0">
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
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{studio.hostName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Host on StudioSpace • Verified Identity • Fast Response Time (&lt; 15 mins)
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Contact: {studio.hostEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Booking Sidebar Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              {/* Hourly Pricing Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">${studio.hourlyRate}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ shoot hour</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  Live Availability
                </div>
              </div>

              {/* Booking Highlights */}
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Workspace Now</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 leading-tight">
                You will not be billed until your reservation time slot is validated and confirmed by the automated collision guard.
              </p>
            </div>
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
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StudioDetailsContent />
    </React.Suspense>
  );
}

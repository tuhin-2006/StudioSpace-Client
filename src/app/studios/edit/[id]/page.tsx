'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  Save,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  Check,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const CATEGORY_OPTIONS = [
  'Photo Studio',
  'Sound Stage',
  'Film Stage',
  'Podcast Room',
  'Podcast Lounge',
  'Music Suite',
  'Music Studio',
  'Art Workshop',
];

const AVAILABLE_AMENITIES = [
  '2-Wall Seamless Cyclorama',
  'Profoto / Godox Lighting Strobes',
  'Cinema Camera Packages (ARRI / RED)',
  'Overhead Pipe Rigging Grid',
  'Soundproof Acoustic Shell (NC-25)',
  '4x Shure SM7B Microphones',
  'Rodecaster Pro II Console',
  'Dolby Atmos 7.1.4 Audio Rig',
  'Neve & Tube-Tech Analog Preamps',
  'Shimpo Ceramic Pottery Wheels',
  '1Gbps Symmetrical Fiber Wi-Fi',
  'Private Client Lounge & Green Room',
  'Hair & Makeup Vanity Stations',
  'Silent Variable HVAC System',
  'Drive-In Vehicle Cargo Bay',
];

function EditStudioForm() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const studioId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('100');
  const [maxCapacity, setMaxCapacity] = useState('10');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [hostEmail, setHostEmail] = useState('');
  const [hostName, setHostName] = useState('');

  useEffect(() => {
    async function loadStudio() {
      try {
        setLoading(true);
        const res = await apiFetch(`/studios/${studioId}`);
        if (res.success && res.studio) {
          const s = res.studio;

          // Check if current user is owner or admin
          if (user && s.hostEmail.toLowerCase() !== user.email.toLowerCase() && user.role !== 'admin') {
            toast.error('You do not have permission to edit this listing.');
            router.push('/my-listings');
            return;
          }

          setTitle(s.title || '');
          setCategory(s.category || 'Photo Studio');
          setHourlyRate(String(s.hourlyRate || ''));
          setSecurityDeposit(String(s.securityDeposit || '0'));
          setMaxCapacity(String(s.maxCapacity || '1'));
          setLocation(s.location || '');
          setAddress(s.address || '');
          setImageUrl(s.imageUrl || '');
          setOverview(s.overview || '');
          setSelectedAmenities(s.amenities || []);
          setHostEmail(s.hostEmail || '');
          setHostName(s.hostName || '');
        }
      } catch (err) {
        console.error('Failed to load studio for edit:', err);
        toast.error('Failed to retrieve studio listing');
        router.push('/my-listings');
      } finally {
        setLoading(false);
      }
    }

    if (studioId) {
      loadStudio();
    }
  }, [studioId, user, router]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await apiFetch(`/studios/${studioId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit || 0),
          maxCapacity: Number(maxCapacity),
          location,
          address,
          imageUrl,
          amenities: selectedAmenities,
          overview,
        }),
      });

      if (res.success) {
        toast.success(res.message || 'Studio workspace updated successfully!');
        router.push('/my-listings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update studio workspace');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6" aria-label="Loading studio details for editing">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="py-14 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to My Studio Listings</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">ID: {studioId}</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Update Studio Listing
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Modify workspace amenities, hourly rates, location details, or technical equipment descriptions.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-9">
          {/* Read-Only Host Credentials */}
          <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Host Identity (Read-Only)
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {hostName} <span className="text-slate-500 font-normal">({hostEmail})</span>
              </p>
            </div>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto">
              Non-editable
            </span>
          </div>

          {/* Section: Basic Details */}
          <fieldset className="space-y-5">
            <legend className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
              Workspace Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div className="md:col-span-2">
                <label
                  htmlFor="edit-title"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Studio Workspace Title *
                </label>
                <input
                  id="edit-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-category"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Category *
                </label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-capacity"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Max Capacity *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="edit-capacity"
                    type="number"
                    min="1"
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Section: Rates */}
          <fieldset className="space-y-5">
            <legend className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
              Pricing & Security
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div>
                <label
                  htmlFor="edit-rate"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Hourly Rate ($ / hr) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="edit-rate"
                    type="number"
                    min="1"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-deposit"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Refundable Security Deposit ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="edit-deposit"
                    type="number"
                    min="0"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Section: Location */}
          <fieldset className="space-y-5">
            <legend className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
              Location
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div>
                <label
                  htmlFor="edit-location"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  City / Neighborhood *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="edit-location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-address"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Street Address *
                </label>
                <input
                  id="edit-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                />
              </div>
            </div>
          </fieldset>

          {/* Section: Imagery */}
          <fieldset className="space-y-5">
            <legend className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
              Studio Image
            </legend>

            <div className="pt-1">
              <label
                htmlFor="edit-image-url"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Image URL *
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="edit-image-url"
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                />
              </div>
            </div>

            {imageUrl && (
              <div className="relative aspect-[16/9] w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Studio space preview" className="w-full h-full object-cover" />
              </div>
            )}
          </fieldset>

          {/* Section: Amenities */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
              Amenities & Equipment
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all min-h-[44px] ${
                      checked
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Section: Overview */}
          <div className="space-y-2">
            <label
              htmlFor="edit-overview"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Overview & Specifications *
            </label>
            <textarea
              id="edit-overview"
              rows={5}
              required
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Link
              href="/my-listings"
              className="px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-9 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center gap-2 min-h-[48px]"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{submitting ? 'Updating...' : 'Save & Update Studio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <ProtectedRoute>
      <React.Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center" aria-label="Loading edit form">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          </div>
        }
      >
        <EditStudioForm />
      </React.Suspense>
    </ProtectedRoute>
  );
}

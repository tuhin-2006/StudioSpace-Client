'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  PlusCircle,
  Sparkles,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  Check,
  Lock,
} from 'lucide-react';

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

function AddStudioForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('100');
  const [maxCapacity, setMaxCapacity] = useState('10');
  const [location, setLocation] = useState('Brooklyn, NY');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '1Gbps Symmetrical Fiber Wi-Fi',
    'Private Client Lounge & Green Room',
  ]);
  const [loading, setLoading] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !hourlyRate || !maxCapacity || !location || !address || !imageUrl || !overview) {
      toast.error('Please fill in all required studio workspace details.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/studios', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit || 0),
          maxCapacity: Number(maxCapacity),
          location,
          address,
          imageUrl,
          galleryImages: [imageUrl],
          amenities: selectedAmenities,
          overview,
        }),
      });

      if (res.success) {
        toast.success(res.message || 'Studio workspace listed successfully!');
        router.push('/my-listings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create studio workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Host Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Add New Studio Workspace
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            List your creative facility to connect with vetted filmmakers, photographers, and audio engineers.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          {/* Read-Only Host Information (Enforced from requirement) */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Verified Host Credentials (Read-Only)
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {user?.name} <span className="text-slate-500 font-normal">({user?.email})</span>
              </p>
            </div>
            <span className="text-xs bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-full">Active Host</span>
          </div>

          {/* Section: Basic Details */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Workspace Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Studio Workspace Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., The Apex 2-Wall White Cyclorama & Daylight Loft"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Max Guest Capacity *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="15"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Rates & Security
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Hourly Rate ($ / hr) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="85"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Refundable Security Deposit ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    min="0"
                    placeholder="150"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Location & Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  City / Neighborhood (e.g. Brooklyn, NY) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Brooklyn, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Street Address & Suite *
                </label>
                <input
                  type="text"
                  required
                  placeholder="424 Broadway, Floor 4, Suite B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Media & Photos */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Studio Imagery
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Studio Image URL *
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Paste an Unsplash or ImgBB image URL for high-resolution gallery presentation.
              </p>
            </div>

            {imageUrl && (
              <div className="relative aspect-[16/9] w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-bold">
                  Image Preview
                </span>
              </div>
            )}
          </div>

          {/* Section: Amenities Checkboxes */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Studio Amenities & Equipment Checklist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      checked
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Overview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Detailed Overview & Technical Specs *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Describe ceiling height, power distribution, soundproofing, light exposure, access rules, and equipment..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{loading ? 'Publishing Studio...' : 'Publish Studio Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioForm />
    </ProtectedRoute>
  );
}

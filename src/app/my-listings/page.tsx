'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DeleteModal } from '@/components/DeleteModal';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  LayoutGrid,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Star,
  Users,
} from 'lucide-react';

function MyListingsContent() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/studios/user/my-listings');
      if (res.success && res.studios) {
        setStudios(res.studios);
      }
    } catch (err) {
      console.error('Failed to fetch user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      const res = await apiFetch(`/studios/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        toast.success(res.message || 'Studio workspace deleted successfully.');
        setStudios((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete studio');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="py-14 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Host Management Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              My Studio Listings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Manage your listed production spaces, update hourly rates, and track your creative workspaces.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-center min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Add New Studio</span>
          </Link>
        </div>

        {/* Listings Table / Cards */}
        {loading ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-pulse" aria-label="Loading studio listings">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : studios.length > 0 ? (
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <caption className="visually-hidden">List of studio workspaces owned by active host</caption>
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  <tr>
                    <th scope="col" className="px-6 py-4">Studio Workspace</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Rate & Deposit</th>
                    <th scope="col" className="px-6 py-4">Capacity</th>
                    <th scope="col" className="px-6 py-4">Rating</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studios.map((studio) => (
                    <tr key={studio._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={studio.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <Link
                              href={`/studios/${studio._id}`}
                              className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                            >
                              {studio.title}
                            </Link>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                              <span className="truncate max-w-xs">{studio.location}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                          {studio.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">${studio.hourlyRate}/hr</span>
                          <span className="text-slate-400 ml-1.5">(Dep: ${studio.securityDeposit || 0})</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          <span>{studio.maxCapacity} Guests</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                          <span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/studios/${studio._id}`}
                            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                            aria-label={`View public details for ${studio.title}`}
                          >
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </Link>

                          {/* Update Button (navigates to /studios/edit/[id]) */}
                          <Link
                            href={`/studios/edit/${studio._id}`}
                            className="p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                            aria-label={`Edit ${studio.title}`}
                          >
                            <Edit className="w-4 h-4" aria-hidden="true" />
                          </Link>

                          {/* Delete Button (launches custom confirmation modal) */}
                          <button
                            onClick={() => setDeleteTarget(studio)}
                            className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                            aria-label={`Delete ${studio.title}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State Display (Requirement #6) */
          <div className="text-center p-16 sm:p-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center">
              <LayoutGrid className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Studio Listings Yet</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                You haven&apos;t published any production workspaces. List your photo cyclorama, sound stage, or podcast lounge today!
              </p>
            </div>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>List Your First Studio</span>
            </Link>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Deletion */}
      <DeleteModal
        isOpen={!!deleteTarget}
        title="Delete Studio Workspace"
        itemName={deleteTarget?.title || ''}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListingsContent />
    </ProtectedRoute>
  );
}

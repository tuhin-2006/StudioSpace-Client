'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiFetch } from '@/lib/api';
import { generateBookingInvoice } from '@/lib/generateInvoice';
import { toast } from 'sonner';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Download,
  XCircle,
  ExternalLink,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock4,
} from 'lucide-react';

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/bookings/my-bookings');
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      const res = await apiFetch(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });

      if (res.success) {
        toast.success(res.message || 'Studio booking cancelled successfully.');
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  // Status badges using both iconography AND text (WCAG 1.4.1 Non-color reliance)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock4 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pending Host Approval</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="py-14 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Production Schedule</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              My Studio Bookings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Track studio reservation status, download tax-ready PDF invoices, and manage upcoming shoot sessions.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-center min-h-[44px]"
          >
            <span>Book Another Studio</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4 animate-pulse" aria-label="Loading bookings schedule">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Studio Info */}
                <div className="flex items-center gap-5 flex-grow">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={booking.studioImage} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {booking.studioCategory}
                      </span>
                      <span aria-hidden="true">•</span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="font-bold text-base sm:text-xl text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                    >
                      {booking.studioTitle}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                        <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        {booking.bookingDate}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                        <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        {booking.startTime} - {booking.endTime} ({booking.totalHours} hr{booking.totalHours > 1 ? 's' : ''})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        Host: {booking.hostEmail}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Actions */}
                <div className="flex flex-wrap items-center justify-between lg:justify-end w-full lg:w-auto gap-5 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Grand Total</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ${booking.totalPrice}
                    </span>
                    <span className="text-[11px] text-slate-400 block">Incl. ${booking.securityDeposit || 0} deposit</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* PDF Invoice Download */}
                    <button
                      onClick={() => generateBookingInvoice(booking)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm min-h-[44px]"
                      aria-label={`Download PDF Invoice for booking at ${booking.studioTitle}`}
                    >
                      <Download className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                      <span>Invoice PDF</span>
                    </button>

                    {/* View Studio Details */}
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="p-3 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={`View public details for ${booking.studioTitle}`}
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </Link>

                    {/* Cancel Action (Only for Pending slots) */}
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors disabled:opacity-50 min-h-[44px]"
                        aria-label={`Cancel pending reservation for ${booking.studioTitle}`}
                      >
                        <XCircle className="w-4 h-4" aria-hidden="true" />
                        <span>{cancellingId === booking._id ? 'Cancelling...' : 'Cancel Slot'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State Display (Requirement #6) */
          <div className="text-center p-16 sm:p-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center">
              <CalendarCheck className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Studio Bookings Found</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                You haven&apos;t reserved any production studio sessions yet. Browse available spaces and reserve your next creative shoot!
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all min-h-[44px]"
            >
              <span>Explore Studio Spaces</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}

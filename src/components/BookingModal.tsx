'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Studio } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { X, Calendar, Clock, Phone, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ studio, isOpen, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState('2026-11-05');
  const [minDate, setMinDate] = useState('2026-11-05');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [userPhone, setUserPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [collisionError, setCollisionError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    setBookingDate(today);
  }, []);

  // Keyboard accessibility: Escape to close modal, body scroll lock
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Calculate hours & pricing
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
  const calculatedHours = Math.max(1, Math.ceil(totalMinutes / 60));
  const subtotal = studio.hourlyRate * calculatedHours;
  const deposit = studio.securityDeposit || 0;
  const grandTotal = subtotal + deposit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollisionError(null);

    if (!user) {
      toast.error('Please sign in to reserve studio time.');
      router.push(`/login?redirect=/studios/${studio._id}`);
      return;
    }

    if (totalMinutes <= 0) {
      toast.error('End time must be later than start time.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
          userPhone,
          specialRequests,
        }),
      });

      if (res.success) {
        toast.success(res.message || 'Workspace reservation submitted successfully!');
        onClose();
        router.push('/my-bookings');
      }
    } catch (error: any) {
      // Challenge 2 collision detection feedback
      const errMsg = error.message || 'Booking submission failed.';
      setCollisionError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        aria-describedby="booking-dialog-desc"
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Reserve Workspace
            </span>
            <h2 id="booking-dialog-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">
              {studio.title}
            </h2>
            <p id="booking-dialog-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ${studio.hourlyRate}/hr • Verified Host: {studio.hostName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-grow">
          {/* Collision Error Alert (Challenge 2) */}
          {collisionError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold">Schedule Collision Detected</p>
                <p className="mt-0.5 leading-relaxed">{collisionError}</p>
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label
              htmlFor="booking-date"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Production Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id="booking-date"
                ref={firstInputRef}
                type="date"
                min={minDate}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="booking-start-time"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Start Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="booking-start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-end-time"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                End Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="booking-end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* User Contact Phone */}
          <div>
            <label
              htmlFor="booking-phone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Production Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                id="booking-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white min-h-[44px]"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label
              htmlFor="booking-requests"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Special Setup Requests / Gear Needs
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <textarea
                id="booking-requests"
                rows={2}
                placeholder="E.g., Require 3x C-Stands, motorized cyclorama backdrops, or audio isolation checks..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Price Breakdown Calculation (Live Region for screen readers) */}
          <div
            aria-live="polite"
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs"
          >
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>
                Shoot Duration ({calculatedHours} hr{calculatedHours > 1 ? 's' : ''} @ ${studio.hourlyRate}/hr)
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">${subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold text-slate-900 dark:text-white">${deposit}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Estimated Total Due</span>
              <span className="text-indigo-600 dark:text-indigo-400 text-base font-black">${grandTotal}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center gap-2 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>{submitting ? 'Confirming Slot...' : 'Confirm Reservation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

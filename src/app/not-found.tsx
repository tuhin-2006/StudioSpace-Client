'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Creative Studio 404 Illustration / Icon Badge */}
        <div className="relative mx-auto w-28 h-28">
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
            <Camera className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black border-2 border-white dark:border-slate-800 shadow-md">
            404 ERROR
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Studio Slot Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The workspace or stage address you are attempting to reach has either wrapped production, moved to a new facility, or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Studios</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

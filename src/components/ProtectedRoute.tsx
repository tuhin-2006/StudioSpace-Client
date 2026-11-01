'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Aperture } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Aperture className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 animate-ping opacity-25" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Verifying StudioSpace Session</p>
          <p className="text-xs text-slate-400 mt-0.5">Restoring encrypted creator credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

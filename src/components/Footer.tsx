'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Aperture, Send } from 'lucide-react';
import { toast } from 'sonner';

// Custom modern social SVG icons
function XLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to StudioSpace creative briefings!');
    setEmail('');
  };

  return (
    <footer role="contentinfo" className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 min-h-[44px]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Aperture className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Studio<span className="text-indigo-400">Space</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier peer-to-peer creative marketplace connecting cinematographers, photographers, podcasters, and musicians
              with private, state-of-the-art production studios and creative workspaces worldwide.
            </p>

            {/* Social Links with accessible 44x44px targets */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Follow StudioSpace on X"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Follow StudioSpace on Instagram"
              >
                <InstagramLogo className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Subscribe to StudioSpace on YouTube"
              >
                <YoutubeLogo className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Connect with StudioSpace on LinkedIn"
              >
                <LinkedinLogo className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/studios" className="hover:text-white transition-colors block py-1">
                  All Workspaces
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors block py-1">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className="hover:text-white transition-colors block py-1">
                  List Your Studio
                </Link>
              </li>
              <li>
                <Link href="/#about-us" className="hover:text-white transition-colors block py-1">
                  Host Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white mb-4">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/studios?category=Photo%20Studio" className="hover:text-white transition-colors block py-1">
                  Photo Cyc Walls
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Sound%20Stage" className="hover:text-white transition-colors block py-1">
                  Cinema Sound Stages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Podcast%20Room" className="hover:text-white transition-colors block py-1">
                  Podcast Lounges
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Music%20Suite" className="hover:text-white transition-colors block py-1">
                  Music Suites
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Art%20Workshop" className="hover:text-white transition-colors block py-1">
                  Art Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Input with Accessible Label & AutoComplete */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white mb-4">Stay Inspired</h3>
            <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
              Receive weekly creator spotlight drops, space discounts, and studio production equipment tips.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label htmlFor="newsletter-email" className="visually-hidden">
                Email address for creative briefings
              </label>
              <div className="relative">
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-3.5 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors min-w-[44px]"
                  aria-label="Subscribe to StudioSpace newsletter"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright & Terms Notice */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 StudioSpace Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-slate-400 transition-colors">
              Security Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

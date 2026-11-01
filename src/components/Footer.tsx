'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Aperture, Send } from 'lucide-react';
import { toast } from 'sonner';

// Custom modern social SVG icons
function XLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Aperture className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Studio<span className="text-indigo-400">Space</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier high-performance marketplace connecting creators, cinematographers, podcasters, and musicians
              with private, state-of-the-art production studios and creative workspaces worldwide.
            </p>
            {/* Social Links with NEW X Logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Follow us on X"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Follow us on Instagram"
              >
                <InstagramLogo className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Subscribe on YouTube"
              >
                <YoutubeLogo className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Connect on LinkedIn"
              >
                <LinkedinLogo className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/studios" className="hover:text-white transition-colors">
                  All Workspaces
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className="hover:text-white transition-colors">
                  List Your Studio
                </Link>
              </li>
              <li>
                <Link href="/#about-us" className="hover:text-white transition-colors">
                  Host Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/studios?category=Photo%20Studio" className="hover:text-white transition-colors">
                  Photo Cyc Walls
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Sound%20Stage" className="hover:text-white transition-colors">
                  Cinema Sound Stages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Podcast%20Room" className="hover:text-white transition-colors">
                  Broadcast Podcast Lounges
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Music%20Suite" className="hover:text-white transition-colors">
                  Dolby Atmos Music Suites
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Art%20Workshop" className="hover:text-white transition-colors">
                  Ceramic & Art Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">Stay Inspired</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Receive weekly creator spotlight drops, space discounts, and studio production equipment tips.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors"
                  aria-label="Submit newsletter"
                >
                  <Send className="w-3.5 h-3.5" />
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

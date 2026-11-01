'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import {
  Aperture,
  Menu,
  X,
  PlusCircle,
  LayoutGrid,
  CalendarCheck,
  Heart,
  LogOut,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Studios', href: '/studios' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About Us', href: '/#about-us' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Aperture / Spotlight */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Aperture className="w-6 h-6 animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              Studio<span className="text-indigo-600 dark:text-indigo-400">Space</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm"
                  title={user.name}
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white ring-2 ring-indigo-500/20">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Authenticated Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/add-studio"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-500" />
                        Add New Studio
                      </Link>
                      <Link
                        href="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <LayoutGrid className="w-4 h-4 text-violet-500" />
                        My Studio Listings
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-emerald-500" />
                        My Bookings
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-pink-500" />
                        Saved Wishlist
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1">
              <div className="px-3 py-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Link
                href="/add-studio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <PlusCircle className="w-4 h-4 text-indigo-500" />
                Add New Studio
              </Link>
              <Link
                href="/my-listings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutGrid className="w-4 h-4 text-violet-500" />
                My Studio Listings
              </Link>
              <Link
                href="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                My Bookings
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Heart className="w-4 h-4 text-pink-500" />
                Saved Wishlist
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

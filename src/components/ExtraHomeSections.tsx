'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Clock,
  Zap,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Camera,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function HowBookingWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Discover Spaces',
      description:
        'Browse curated creative spaces by category, equipment inventory, cyclorama dimensions, or acoustic specs.',
      icon: Compass,
      color: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      step: '02',
      title: 'Select Shoot Hours',
      description:
        'Inspect dynamic live availability. Choose your exact setup, shoot, and breakdown times without hidden overtime fees.',
      icon: Clock,
      color: 'bg-violet-500/10 text-violet-500',
    },
    {
      step: '03',
      title: 'Book Instantly',
      description:
        'Reserve your studio with transparent upfront pricing, automated collision guards, and instant calendar sync.',
      icon: Zap,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      step: '04',
      title: 'Create & Produce',
      description:
        'Check into the studio with automated entry codes, connect directly with your host, and capture your masterpiece.',
      icon: Sparkles,
      color: 'bg-pink-500/10 text-pink-500',
    },
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            Seamless Workflow
          </div>
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How Studio Booking Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            A frictionless 4-step process designed for fast-moving independent creators and commercial production teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-inner`}>
                      <Icon className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 font-mono" aria-hidden="true">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10" aria-hidden="true">
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HostGuaranteeSection() {
  const assurances = [
    {
      title: '$1,000,000 Liability Protection',
      description: 'Comprehensive property damage protection covering studio infrastructure, gear, and set builds.',
      icon: ShieldCheck,
    },
    {
      title: 'Verified Creator Identities',
      description: 'Every creator passes phone, government ID, and past production history verification checks.',
      icon: UserCheck,
    },
    {
      title: 'Equipment Safety Standards',
      description: 'Itemized gear check-in checklists ensuring your strobes, cinema lights, and microphones stay safe.',
      icon: Camera,
    },
    {
      title: '24/7 Dedicated Support',
      description: 'Direct priority phone and chat support for lockouts, schedule extensions, and emergency resolution.',
      icon: Headphones,
    },
  ];

  return (
    <section id="about-us" aria-labelledby="host-guarantee-heading" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-emerald-400 border border-white/10">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>StudioSpace Shield</span>
            </div>

            <h2 id="host-guarantee-heading" className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Host Guarantee & Creator Protection
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We understand creative spaces are delicate, high-value assets. StudioSpace provides ironclad security,
              verified credentials, and automated insurance so hosts can share their spaces with complete confidence.
            </p>

            <div className="pt-2">
              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all min-h-[44px]"
              >
                <span>Become a Studio Host</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/40 backdrop-blur-md transition-all hover:bg-white/[0.08]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import { Zap, Star, ShoppingBag, ArrowRight } from 'lucide-react';

export default function LimitedVaultOffer() {
  const { addToCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) {
    // Render static placeholder matching size to prevent hydration layout shifts
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[400px] w-full rounded-[32px] bg-theme-card/10 border border-theme-border animate-pulse" />
      </div>
    );
  }

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative glass-panel rounded-[32px] overflow-hidden border border-accent-color/20 shadow-[0_0_50px_rgba(251,191,36,0.1)]">
        {/* Mesh background effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-brand/5 via-accent-color/5 to-transparent" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-color/10 rounded-full blur-[80px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
          {/* Visual Image */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-theme-border bg-black/25">
            <span className="absolute top-4 left-4 z-10 bg-brand text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full glow-effect animate-pulse">
              FLASH VAULT RELEASE
            </span>
            <img
              src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
              alt="Aetheris Carbon Smart Watch"
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 inset-x-4 glass-panel rounded-xl p-3 border border-white/10 flex justify-between items-center">
              <span className="text-[10px] text-zinc-300 font-medium">Bespoke Forged Casing</span>
              <span className="text-[10px] text-amber-400 font-bold">ECG / SPO2 Cert</span>
            </div>
          </div>

          {/* Offer Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-widest text-amber-500">
                <Zap className="h-3 w-3 fill-current" />
                <span>Limited Vault Offer</span>
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-theme-text">
                Aetheris Carbon Smart Watch <span className="bg-gradient-to-r from-brand to-accent-color bg-clip-text text-transparent glow-text">(Elite Run)</span>
              </h2>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Encased in high-tensile forged carbon fibers. Equipped with custom OLED biometric systems, real-time sync telemetry, and standard multi-vendor logistics integration. Handcrafted limited release of 150 items.
              </p>
            </div>

            {/* Ratings & Price */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold">
                <Star className="h-4 w-4 fill-current animate-pulse-glow" />
                <span>4.9</span>
                <span className="text-theme-muted">/ 5.0 (420 logs)</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-brand">$329</span>
                <span className="text-sm text-theme-muted line-through">$399</span>
                <span className="text-[10px] bg-brand/10 text-brand font-bold border border-brand/20 px-2.5 py-0.5 rounded-md">SAVE 17%</span>
              </div>
            </div>

            {/* Scarcity meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-theme-muted">
                <span>Vault Availability</span>
                <span className="text-amber-500 font-bold">Only 3 pieces left!</span>
              </div>
              <div className="w-full bg-theme-border/30 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-brand to-accent-color h-full w-[97%] rounded-full animate-pulse-glow" />
              </div>
            </div>

            {/* Timer and CTA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-4 border-t border-theme-border/50">
              {/* Countdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted block">Offer Expires In</span>
                <div className="flex space-x-2 font-mono">
                  {[
                    { label: 'hr', val: timeLeft.hours },
                    { label: 'min', val: timeLeft.minutes },
                    { label: 'sec', val: timeLeft.seconds }
                  ].map((t, index) => (
                    <div key={index} className="flex items-baseline gap-0.5 bg-black/30 border border-theme-border rounded-lg px-2.5 py-1 text-sm font-bold text-theme-text min-w-[50px] justify-center">
                      <span>{String(t.val).padStart(2, '0')}</span>
                      <span className="text-[9px] text-theme-muted font-sans font-normal uppercase">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart('prod-watch-1', 1)}
                  className="flex-grow inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold py-3.5 px-4 shadow-lg shadow-brand/20 hover:shadow-brand/40 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Claim Offer</span>
                </button>
                <Link
                  href="/vault-offers"
                  className="inline-flex items-center justify-center rounded-xl border border-theme-border bg-theme-card/30 hover:bg-brand/10 text-theme-text hover:text-white px-5 text-xs font-bold transition-all gap-1.5"
                >
                  <span>Enter Vault</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useStore } from '../../store/useStore';
import { Zap, Star, ShoppingBag, ArrowLeft, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VaultOffersPage() {
  const { products, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 23, seconds: 12 });

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

  // Filter for products with ID prefix 'prod-vault-'
  const vaultProducts = useMemo(() => {
    return products.filter(p => p.id.startsWith('prod-vault-'));
  }, [products]);

  // If page hasn't mounted yet, render standard luxury loading spinner
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-theme-muted">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Decrypting Vault Ledger...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-theme-bg-from min-h-screen relative overflow-hidden pb-16">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent-color/5 rounded-full blur-[120px] -z-10" />

        {/* Header Hero Section */}
        <section className="max-w-7xl mx-auto px-4 pt-10 pb-8 sm:px-6 lg:px-8 border-b border-theme-border/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Restricted Cryptographic Run</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-theme-text leading-tight">
                Aetheris Limited <span className="bg-gradient-to-r from-brand to-accent-color bg-clip-text text-transparent glow-text">Vault Releases</span>
              </h1>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Unlock high-fidelity mechanical accessories, soundstage auditory modules, and design Living items. Commissioned exclusively for active session token holders. Availability expires upon ledger lockdown.
              </p>
            </div>

            {/* Countdown Header Card */}
            <div className="glass-panel p-5 rounded-3xl border border-amber-500/20 shadow-[0_0_30px_rgba(251,191,36,0.05)] shrink-0 space-y-2 min-w-[280px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted block">Vault Lockdown Timer</span>
              <div className="flex space-x-2 font-mono">
                {[
                  { label: 'hr', val: timeLeft.hours },
                  { label: 'min', val: timeLeft.minutes },
                  { label: 'sec', val: timeLeft.seconds }
                ].map((t, index) => (
                  <div key={index} className="flex-1 flex items-baseline gap-0.5 bg-black/40 border border-theme-border rounded-xl py-2 px-3 justify-center min-w-[64px]">
                    <span className="text-lg font-extrabold text-theme-text">{String(t.val).padStart(2, '0')}</span>
                    <span className="text-[9px] text-theme-muted font-sans font-normal uppercase">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-1.5 text-[9px] text-green-400 font-semibold pt-1">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span>Secure Sync Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {vaultProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vaultProducts.map((prod) => {
                // Calculate percentage off
                const savings = prod.compare_at_price ? Math.round(((prod.compare_at_price - prod.price) / prod.compare_at_price) * 100) : 0;
                
                return (
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    key={prod.id}
                    className="glass-panel rounded-[32px] p-4 border border-theme-border hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/5 flex flex-col h-full relative group transition-all duration-300"
                  >
                    {/* Discount Tag */}
                    {savings > 0 && (
                      <span className="absolute top-6 left-6 z-10 bg-brand text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full glow-effect">
                        SAVE {savings}%
                      </span>
                    )}

                    {/* Image Container */}
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-black/20">
                      <Link href={`/products/${prod.id}`} className="block h-full w-full">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </Link>
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-white font-semibold uppercase px-2.5 py-0.5 rounded-full">
                        {prod.category}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-theme-muted">
                          <span>Studio: <strong>{prod.seller_name}</strong></span>
                          <span className="flex items-center text-amber-500">
                            <Star className="h-3 w-3 fill-current mr-0.5" />
                            {prod.average_rating}
                          </span>
                        </div>

                        <Link href={`/products/${prod.id}`} className="font-display text-sm font-bold text-theme-text hover:text-brand line-clamp-1 truncate block transition-colors">
                          {prod.title}
                        </Link>
                        
                        <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Scarcity / Vault Status */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-semibold text-theme-muted">
                          <span>Vault Stock Remaining</span>
                          <span className="text-amber-500 font-bold">Only {prod.inventory} left!</span>
                        </div>
                        <div className="w-full bg-theme-border/25 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-brand to-accent-color h-full rounded-full animate-pulse-glow"
                            style={{ width: `${(prod.inventory / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Price & Action button */}
                      <div className="flex items-center justify-between border-t border-theme-border/40 pt-3 mt-1 shrink-0">
                        <div className="flex flex-col">
                          {prod.compare_at_price && (
                            <span className="text-[10px] text-theme-muted line-through">${prod.compare_at_price}</span>
                          )}
                          <span className="text-base font-extrabold text-brand">${prod.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart(prod.id, 1)}
                          disabled={prod.inventory === 0}
                          className={`inline-flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                            prod.inventory === 0
                              ? 'bg-theme-card/10 text-theme-muted border border-theme-border cursor-not-allowed'
                              : 'bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/10 hover:shadow-brand/20'
                          }`}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>{prod.inventory === 0 ? 'Out of Stock' : 'Claim Offer'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-16 text-center border border-theme-border flex flex-col items-center justify-center max-w-lg mx-auto">
              <Zap className="h-12 w-12 text-theme-muted/30 mb-4" />
              <h3 className="font-display text-lg font-bold text-theme-text">Vault Ledger Empty</h3>
              <p className="text-xs text-theme-muted mt-2">
                All promotional items have been locked down. Check back during standard ledger resets.
              </p>
              <Link
                href="/products"
                className="rounded-xl bg-brand hover:bg-brand-hover text-white px-6 py-2.5 text-xs font-semibold mt-6 transition-all"
              >
                Explore Regular Catalog
              </Link>
            </div>
          )}
        </section>

        {/* Footnote information */}
        <section className="max-w-3xl mx-auto px-4 mt-20 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-theme-muted/50 border-t border-theme-border/40 pt-4 w-full justify-center">
            <ShieldCheck className="h-4 w-4 text-green-500/50" />
            <span>All offers strictly restricted to active session timers. Blockchain ledger verified.</span>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

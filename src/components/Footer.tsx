'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Send, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const addNotification = useStore(state => state.addNotification);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      addNotification(
        'Newsletter Activated',
        'You have subscribed to the Aetheris intelligence digest.',
        'success'
      );
    }
  };

  return (
    <footer className="w-full border-t border-theme-border bg-theme-bg-from/50 backdrop-blur-lg mt-auto pb-20 md:pb-8">
      
      {/* Brand Value Banners */}
      <div className="border-b border-theme-border py-8 bg-black/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-theme-text">Secured Logistics</h4>
              <p className="text-xs text-theme-muted">Insured courier dispatch globally</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-theme-text">Artisan Audited</h4>
              <p className="text-xs text-theme-muted">100% verified merchant credentials</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-theme-text">Hassle-free Shifts</h4>
              <p className="text-xs text-theme-muted">30-day premium return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-theme-text">Vanguard Rating</h4>
              <p className="text-xs text-theme-muted">4.8 average buyer satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand Meta */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent-color text-white glow-effect">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider text-theme-text">
              AETHERIS<span className="text-brand">.</span>
            </span>
          </Link>
          <p className="text-xs text-theme-muted leading-relaxed">
            Aetheris Horizon is the premier decentralized digital salon curating bespoke mechanical accessories, luxury acoustic gear, and modern interior innovations from the world\'s finest artisan studios.
          </p>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:col-span-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text">Curations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=Acoustics%20%26%20Time" className="text-theme-muted hover:text-brand transition-colors">
                  Acoustics & Time
                </Link>
              </li>
              <li>
                <Link href="/products?category=Vanguard%20Living" className="text-theme-muted hover:text-brand transition-colors">
                  Vanguard Living
                </Link>
              </li>
              <li>
                <Link href="/products?category=Mobility%20%26%20Gear" className="text-theme-muted hover:text-brand transition-colors">
                  Mobility & Gear
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/seller" className="text-brand font-bold flex items-center space-x-1 hover:text-white transition-colors group">
                  <span>Seller Studio</span>
                  <span className="inline-block px-1.5 py-0.5 rounded-md bg-brand/20 text-[8px] uppercase tracking-wider group-hover:bg-brand/40">Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-theme-muted hover:text-brand transition-colors">
                  Admin Access
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-theme-muted hover:text-brand transition-colors">
                  Explore Catalog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Subscription Newsletter */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text">Intelligence Digest</h4>
          <p className="text-xs text-theme-muted">
            Subscribe to receive premium private collection alerts and elite artisan interviews directly in your terminal.
          </p>
          
          {subscribed ? (
            <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-xs text-brand font-semibold glow-effect">
              Subscription Secure. Welcome to Aetheris.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="relative flex">
              <input
                type="email"
                required
                placeholder="Secure email link..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-card/30 py-2.5 pl-4 pr-12 text-xs outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Legal & Tech Stack */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 border-t border-theme-border flex flex-col md:flex-row items-center justify-between text-[10px] text-theme-muted/50 space-y-2 md:space-y-0">
        <div>
          © {new Date().getFullYear()} Aetheris Horizon Inc. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <span>Next.js 15 App Router</span>
          <span>Tailwind CSS v4</span>
          <span>Supabase DB API</span>
        </div>
      </div>

    </footer>
  );
}

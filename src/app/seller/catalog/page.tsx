'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { Store, Paintbrush, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SellerCatalogView from '../../../components/SellerCatalogView';

export default function StandaloneSellerCatalog() {
  const router = useRouter();
  const { 
    currentSeller, 
    isAuthenticated,
    isInitialized,
    logout,
    activeTheme,
    setTheme
  } = useStore();

  const cycleTheme = () => {
    const themes: ('light' | 'dark')[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(activeTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      window.location.href = '/seller/login';
    }
  }, [mounted, isInitialized, isAuthenticated]);

  return (
    <div className="min-h-screen bg-theme-bg-from text-theme-text transition-colors duration-500 flex flex-col">
      {/* Seller Top Bar */}
      <header className="border-b border-theme-border bg-theme-card/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link 
            href="/seller" 
            className="p-2 hover:bg-white/5 rounded-xl border border-theme-border/50 text-theme-muted hover:text-theme-text transition-all duration-300 inline-flex items-center justify-center"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-brand" />
            <span className="font-semibold tracking-wider text-theme-text">STUDIO DASHBOARD</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={cycleTheme}
            className="group relative rounded-xl border border-theme-border bg-theme-card/30 p-2.5 text-theme-text hover:border-brand hover:bg-brand/10 transition-all duration-300"
            title="Cycle Accent Palette"
          >
            <Paintbrush className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </button>
          
          <button 
            onClick={() => { logout(); router.push('/seller/login'); }}
            className="text-xs font-semibold text-brand hover:text-brand-hover border border-brand/30 px-3 py-1.5 rounded bg-brand/10 hover:bg-brand/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!isInitialized ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="text-xs font-semibold text-theme-muted uppercase tracking-widest">Initializing Catalog Preview...</p>
            </div>
          </div>
        ) : !currentSeller || currentSeller.status !== 'approved' ? (
          <div className="max-w-xl mx-auto py-16 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand">
              <Store className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-2xl font-bold text-theme-text">Authorized Studio Required</h1>
              <p className="text-sm text-theme-muted">
                You must have an approved seller studio application to access this catalog preview workspace.
              </p>
              <div className="pt-4">
                <Link 
                  href="/seller" 
                  className="rounded-xl bg-brand hover:bg-brand-hover text-white px-5 py-2.5 text-xs font-semibold transition-colors shadow-lg shadow-brand/10"
                >
                  Return to Studio Portal
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Block */}
            <div className="pb-4">
              <span className="text-xs font-bold text-brand uppercase tracking-widest bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full inline-block">
                {currentSeller.studio_name} Storefront Preview
              </span>
              <h1 className="font-display text-3xl font-extrabold text-theme-text mt-1">Live Catalog Sandbox</h1>
              <p className="text-xs text-theme-muted mt-1">Simulate design filtration, details navigation, and cart additions.</p>
            </div>

            {/* Catalog Collection render */}
            <SellerCatalogView sellerId={currentSeller.id} />
          </div>
        )}
      </main>
    </div>
  );
}

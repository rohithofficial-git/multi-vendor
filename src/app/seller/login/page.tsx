'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  ArrowRight, 
  Mail,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function SellerLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentRole, initialize, sellers, requestSellerAccess } = useStore();

  const [email, setEmail] = useState('');
  const [studioName, setStudioName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already authenticated as seller
  useEffect(() => {
    if (isAuthenticated && currentRole === 'seller') {
      window.location.href = '/seller';
    }
  }, [isAuthenticated, currentRole]);

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');

    // Check if this seller email is already approved
    const existingSeller = sellers.find(s => 
      s.description?.includes(email) || s.studio_name.toLowerCase().includes(email.split('@')[0].toLowerCase())
    );

    if (existingSeller && existingSeller.status === 'pending') {
      setPendingVerification(true);
      setError('Your account is pending admin verification.');
      setLoading(false);
      return;
    } 

    if (existingSeller && existingSeller.status === 'suspended') {
      setError('Your account has been suspended.');
      setLoading(false);
      return;
    }

    // Auto-approve new sellers for preview convenience (handled in useStore)
    try {
      const success = await login(email, 'seller');
      if (success) {
        window.location.href = '/seller';
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(`Crash: ${err?.message || String(err)}`);
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    if (!studioName.trim()) { setError('Please enter a studio name'); return; }
    setLoading(true);
    await requestSellerAccess(email, studioName);
    setVerificationRequested(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-theme-bg-from text-theme-text transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand text-white shadow-2xl shadow-brand/25 mb-4">
            <Activity className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            Seller Portal
          </h1>
          <p className="text-sm text-theme-muted mt-1">SaaS Dashboard Access</p>
        </div>

        <div className="rounded-3xl border border-theme-border bg-theme-card/60 p-6 space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-3 border-b border-theme-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-border bg-brand/10 text-brand">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-text">
                Studio Workspace
              </h2>
              <p className="text-[10px] text-theme-muted">
                Sign in to manage your storefront & analytics
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!pendingVerification ? (
            <form onSubmit={handleSellerLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-theme-muted tracking-wider">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted/50" />
                  <input
                    type="email"
                    required
                    placeholder="studio@yourstore.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 pl-10 pr-4 py-3 text-sm text-theme-text placeholder-theme-muted/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand text-white py-3 text-sm font-bold hover:bg-brand-hover transition-colors disabled:opacity-50 shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Enter Studio'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-3">
                <Clock className="h-8 w-8 text-amber-500 mx-auto" />
                <h3 className="text-sm font-bold text-amber-600">Verification Required</h3>
                <p className="text-xs text-theme-muted leading-relaxed">
                  Your seller account for <strong className="text-theme-text">{email}</strong> needs admin verification before you can access the studio workspace.
                </p>
              </div>

              {!verificationRequested ? (
                <div className="space-y-3">
                  {!studioName.trim() && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-theme-muted tracking-wider">Studio Name</label>
                      <input
                        type="text"
                        placeholder="Enter your studio name"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        className="w-full rounded-xl border border-theme-border bg-theme-bg-from/50 px-4 py-3 text-sm text-theme-text placeholder-theme-muted/50 outline-none focus:border-amber-500 transition-all"
                      />
                    </div>
                  )}
                  <button
                    onClick={handleRequestVerification}
                    disabled={loading}
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-3 text-sm font-bold transition-colors disabled:opacity-50 shadow-lg shadow-amber-500/20"
                  >
                    {loading ? 'Submitting...' : 'Request Verification from Admin'}
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-600">Verification Request Sent</span>
                  </div>
                  <p className="text-[11px] text-theme-muted">
                    Admin has been notified. Your account ID: <span className="font-mono text-theme-text">{email.split('@')[0].toUpperCase()}-{Date.now().toString(36).slice(-4).toUpperCase()}</span>
                  </p>
                  <p className="text-[10px] text-theme-muted/70 mt-2">Once approved, return here and sign in again.</p>
                </div>
              )}

              <button
                onClick={() => { setPendingVerification(false); setVerificationRequested(false); setError(''); }}
                className="w-full rounded-xl border border-theme-border text-theme-muted py-2.5 text-xs font-semibold hover:bg-theme-border/50 hover:text-theme-text transition-colors"
              >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ArrowRight, 
  Mail,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentRole, initialize } = useStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentRole === 'buyer') {
      router.push('/');
    }
  }, [isAuthenticated, currentRole, router]);

  const handleBuyerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');
    const success = await login(email, 'buyer');
    if (success) {
      router.push('/');
    } else {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1440 30%, #24243e 60%, #0f0c29 100%)'
    }}>
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-purple-600 shadow-2xl shadow-brand/25 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            ELITEhub<span className="text-brand">.</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Buyer Portal</p>
        </div>

        <div className="rounded-2xl border border-white/10 p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
          
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-blue-500/10 border-blue-500/20 text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Buyer Login
              </h2>
              <p className="text-[10px] text-gray-500">
                Enter your email to continue shopping
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleBuyerLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/25 transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand to-purple-600 text-white py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
             <Link href="/" className="text-xs text-brand hover:text-white transition-colors">
               Return to Marketplace
             </Link>
          </div>
        </div>

        {/* Footer badge */}
        <p className="text-center text-[10px] text-gray-600 mt-6">
          Secured by ELITEhub • Multi-Vendor Marketplace Platform
        </p>
      </div>
    </div>
  );
}

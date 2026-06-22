'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';
import {
  User,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  ShoppingBag,
  Store,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentRole, initialize } = useStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Unified Redirect depending on role
  useEffect(() => {
    if (isAuthenticated) {
      if (currentRole === 'admin') {
        router.push('/admin');
      } else if (currentRole === 'seller') {
        router.push('/seller');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, currentRole, router]);

  // Determine detected role from email input in real-time (for Sign In mode)
  const getDetectedRole = () => {
    if (isSignUp) return null;
    const e = email.trim().toLowerCase();
    if (!e) return null;
    if (e === 'own@elitehub.com') return 'admin';
    if (e.startsWith('seller') || e.includes('seller')) return 'seller';
    if (e.includes('admin')) return 'admin';
    if (e.includes('buyer') || e.includes('test')) return 'buyer';
    return null;
  };

  const detectedRole = getDetectedRole();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !name.trim()) { setError('Please enter your name'); return; }
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    setLoading(true);
    setError('');

    if (isSignUp) {
      // In Sign Up mode: we register a new custom user under the selected role
      // Create user details in memory / localStorage
      let customUsers: any[] = [];
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('aetheris_custom_users');
        customUsers = stored ? JSON.parse(stored) : [];
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = customUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (existingUser) {
        setError('This email is already registered. Please sign in instead.');
        setLoading(false);
        return;
      }

      const newCustomUser = {
        email: normalizedEmail,
        password: password,
        role: signUpRole,
        name: name.trim(),
      };

      customUsers.push(newCustomUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aetheris_custom_users', JSON.stringify(customUsers));
      }

      // Automatically log them in with the selected role
      const success = await login(email, password, signUpRole);
      if (!success) {
        setError('Failed to create session. Please try again.');
        setLoading(false);
      }
    } else {
      // In Sign In mode: Call unified login
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }
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
          <p className="text-sm text-gray-400 mt-1">Unified Secure Gateway</p>
        </div>

        <div className="rounded-2xl border border-white/10 p-6 space-y-5 shadow-2xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp 
                  ? 'bg-brand text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp 
                  ? 'bg-brand text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-blue-500/10 border-blue-500/20 text-blue-400">
              {isSignUp ? <UserPlus className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-[10px] text-gray-500">
                {isSignUp ? 'Join the multi-vendor premium marketplace' : 'Access your personalized dashboard workspace'}
              </p>
            </div>
          </div>

          {/* Real-time role detection badge (only in Sign In mode) */}
          {detectedRole && (
            <div className="flex items-center justify-between p-2.5 rounded-xl border bg-brand/10 border-brand/20 text-brand text-[11px] font-bold animate-pulse">
              <span className="flex items-center gap-1.5">
                {detectedRole === 'buyer' && <ShoppingBag className="h-3.5 w-3.5" />}
                {detectedRole === 'seller' && <Store className="h-3.5 w-3.5" />}
                {detectedRole === 'admin' && <ShieldCheck className="h-3.5 w-3.5" />}
                Role Auto-Detected: {detectedRole.toUpperCase()}
              </span>
              <span className="text-[9px] uppercase tracking-wider bg-brand/20 px-2 py-0.5 rounded-md">LIVE</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-pulse">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-1.5 transition-all">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/25 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection Segmented Control (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2 transition-all">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Register As</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('buyer')}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      signUpRole === 'buyer'
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpRole('seller')}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      signUpRole === 'seller'
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    Seller
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand to-purple-600 text-white py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-2 text-center">
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

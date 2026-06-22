'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Terminal,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentRole, initialize } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && currentRole === 'admin') {
      window.location.href = '/admin';
    }
  }, [isAuthenticated, currentRole]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your Admin Email'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        const resolvedRole = useStore.getState().currentRole;
        if (resolvedRole === 'admin') {
          window.location.href = '/admin';
        } else if (resolvedRole === 'seller') {
          window.location.href = '/seller';
        } else {
          window.location.href = '/';
        }
      } else {
        setError('Invalid credentials. Access denied.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(`Auth error: ${err?.message || String(err)}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-theme-bg-from text-theme-text transition-colors duration-500">
      {/* Background grid effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-hover shadow-lg shadow-brand/30 mb-4 relative">
            <ShieldCheck className="h-8 w-8 text-white" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-theme-bg-from animate-pulse" />
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-wide">
            System Control
          </h1>
          <p className="text-xs text-theme-muted mt-2 tracking-widest uppercase">Admin clearance required</p>
        </div>

        <div className="border border-theme-border bg-theme-card/60 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl rounded-3xl space-y-6">
          {/* Terminal header bar */}
          <div className="flex items-center space-x-2 -mt-2 mb-2">
            <Terminal className="h-4 w-4 text-brand" />
            <span className="text-[10px] font-mono text-theme-muted tracking-widest uppercase">ADMIN SECURE CHANNEL v2.4.19</span>
          </div>


          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-theme-muted tracking-widest flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Admin Email ID
              </label>
              <input
                type="email"
                required
                placeholder="admin@elitehub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-theme-bg-from/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text placeholder-theme-muted/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-theme-muted tracking-widest flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Secure Access Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-theme-bg-from/50 border border-theme-border rounded-xl px-4 py-3 pr-11 text-sm text-theme-text placeholder-theme-muted/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-3 text-sm font-bold transition-colors disabled:opacity-50 tracking-wide flex items-center justify-center gap-3 group shadow-lg shadow-brand/20"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Decrypting Session...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Initialize Admin Session
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-theme-border flex justify-between items-center text-[9px] text-theme-muted uppercase tracking-widest">
            <span>SECURE PROTOCOL ACTIVE</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

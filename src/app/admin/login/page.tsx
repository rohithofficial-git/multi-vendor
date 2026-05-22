'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Mail
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, currentRole, initialize } = useStore();

  const [email, setEmail] = useState('');
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
    setLoading(true);
    setError('');

    try {
      const success = await login(email, 'admin');
      if (success) {
        window.location.href = '/admin';
      } else {
        setError('Unauthorized credentials or role mismatch.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(`Crash: ${err?.message || String(err)}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-theme-bg-from text-theme-text transition-colors duration-500">
      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-hover shadow-lg shadow-brand/30 mb-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-wide">
            System Control
          </h1>
          <p className="text-xs text-theme-muted mt-2 tracking-widest uppercase">Admin clearance required</p>
        </div>

        <div className="border border-theme-border bg-theme-card/60 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl rounded-3xl">
          {error && (
            <div className="flex items-center space-x-2 p-3 mb-6 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-theme-muted tracking-widest flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Admin Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@elitehub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-bg-from/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text placeholder-theme-muted/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-3 text-sm font-bold transition-colors disabled:opacity-50 tracking-wide flex items-center justify-center gap-3 group"
            >
              {loading ? 'Decrypting...' : 'Initialize Session'}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-theme-border flex justify-between items-center text-[9px] text-theme-muted uppercase tracking-widest">
            <span>SECURE PROTOCOL ACTIVE</span>
            <span>v2.4.19</span>
          </div>
        </div>
      </div>
    </div>
  );
}

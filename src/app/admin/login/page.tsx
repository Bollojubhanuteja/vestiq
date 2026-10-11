'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const emailToSend = (customEmail || email).toLowerCase().trim();
    const passwordToSend = customPassword || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend, password: passwordToSend }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role === 'ADMIN') {
          // Direct full browser navigation ensures cookies are recognized by middleware
          window.location.href = '/admin';
        } else {
          setError('Access restricted. This account does not possess Executive Admin privileges.');
          setLoading(false);
        }
      } else {
        setError(data.error || 'Authentication failed. Please check administrative credentials.');
        setLoading(false);
      }
    } catch {
      setError('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 bg-slate-950 min-h-screen flex items-center justify-center px-4 text-white">
      <div className="max-w-md w-full">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Standard User Login
          </Link>
        </div>

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Executive Leadership Portal</h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Administrative governance &amp; verified opportunity diligence
          </p>
        </div>

        {/* Admin Login Form */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-xl text-xs mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Executive Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vestiq21@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-600/20 transition mt-2 flex items-center justify-center gap-1.5"
            >
              {loading ? 'Authenticating & Navigating...' : 'Sign In to Admin Oversight Portal'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            Regular Investor or Startup?{' '}
            <Link href="/login" className="text-blue-400 font-semibold hover:underline">
              Standard User Sign In &rarr;
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-slate-500 text-center">
          Vestiq Core Administration • Restricted Access
        </p>
      </div>
    </div>
  );
}

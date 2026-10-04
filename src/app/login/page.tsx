'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Briefcase, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const emailToSend = customEmail || email;
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
          router.push('/admin');
        } else if (data.user.role === 'BUSINESS') {
          router.push('/dashboard/business');
        } else {
          // Investor
          if (!data.onboardingCompleted) {
            router.push('/onboarding/investor');
          } else {
            router.push('/dashboard/investor');
          }
        }
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: 'INVESTOR' | 'BUSINESS' | 'ADMIN') => {
    if (demoRole === 'INVESTOR') {
      setEmail('investor@vestiq.com');
      setPassword('Password123!');
      handleLogin(undefined, 'investor@vestiq.com', 'Password123!');
    } else if (demoRole === 'BUSINESS') {
      setEmail('founder1@agripulse.demo');
      setPassword('Password123!');
      handleLogin(undefined, 'founder1@agripulse.demo', 'Password123!');
    } else if (demoRole === 'ADMIN') {
      setEmail('admin@vestiq.com');
      setPassword('Password123!');
      handleLogin(undefined, 'admin@vestiq.com', 'Password123!');
    }
  };

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">VESTIQ</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-950">Welcome Back</h1>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your investment research workspace
          </p>
        </div>

        {/* Demo Fast Logins Banner */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Demo Test Personas (One-Click)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('INVESTOR')}
              className="p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 font-medium transition text-center"
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              Investor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('BUSINESS')}
              className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 font-medium transition text-center"
            >
              <Briefcase className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              Startup
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-800 font-medium transition text-center"
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vestiq.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition mt-2 flex items-center justify-center gap-1.5"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Create an account &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="mt-6 text-[11px] text-slate-400 text-center leading-relaxed">
          Vestiq • Premium B2B Business Investment &amp; Partnership Platform
        </p>
      </div>
    </div>
  );
}

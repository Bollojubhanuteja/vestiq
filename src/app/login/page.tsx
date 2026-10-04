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

  const handleDemoLogin = (demoRole: 'INVESTOR' | 'BUSINESS' | 'FOUNDER' | 'COFOUNDER') => {
    if (demoRole === 'INVESTOR') {
      setEmail('investor@vestiq.com');
      setPassword('Password123!');
      handleLogin(undefined, 'investor@vestiq.com', 'Password123!');
    } else if (demoRole === 'BUSINESS') {
      setEmail('founder1@agripulse.demo');
      setPassword('Password123!');
      handleLogin(undefined, 'founder1@agripulse.demo', 'Password123!');
    } else if (demoRole === 'FOUNDER') {
      setEmail('vestiq21@gmail.com');
      setPassword('Vestiq@Launch2026!');
      handleLogin(undefined, 'vestiq21@gmail.com', 'Vestiq@Launch2026!');
    } else if (demoRole === 'COFOUNDER') {
      setEmail('bhavana@vestiq.com');
      setPassword('Vestiq@Bhavana2026!');
      handleLogin(undefined, 'bhavana@vestiq.com', 'Vestiq@Bhavana2026!');
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

        {/* Executive Fast Sign-in Portals */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Executive Leadership Desks
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">1-Click Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Founder Admin Button */}
            <button
              type="button"
              onClick={() => handleDemoLogin('FOUNDER')}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/90 text-blue-900 font-medium transition text-left relative overflow-hidden group shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  BT
                </div>
                <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
                  Founder Admin
                </span>
              </div>
              <div className="font-bold text-slate-900 text-xs truncate">
                BOLLOJU BHANU TEJA
              </div>
              <p className="text-[10px] text-blue-700/80 mt-0.5 truncate">
                Core Tech &amp; Legal Deeds
              </p>
            </button>

            {/* Co-Founder Admin Button */}
            <button
              type="button"
              onClick={() => handleDemoLogin('COFOUNDER')}
              className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-900 font-medium transition text-left relative overflow-hidden group shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  BH
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                  Co-Founder Admin
                </span>
              </div>
              <div className="font-bold text-slate-900 text-xs truncate">
                BHAVANA
              </div>
              <p className="text-[10px] text-emerald-700/80 mt-0.5 truncate">
                Operations &amp; Diligence
              </p>
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

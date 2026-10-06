'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Briefcase,
  Shield,
  CheckCircle2,
  TrendingUp,
  Building2
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role')?.toUpperCase() === 'BUSINESS' ? 'BUSINESS' : 'INVESTOR') as
    | 'INVESTOR'
    | 'BUSINESS';

  const [selectedRole, setSelectedRole] = useState<'INVESTOR' | 'BUSINESS'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
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
        setError(data.error || 'Authentication failed. Please verify your email and password.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xl shadow-sm flex items-center justify-center transition">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">VESTIQ</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-950">Welcome Back</h1>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your investment discovery and deal workspace
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {/* Investor Tab */}
          <button
            type="button"
            onClick={() => setSelectedRole('INVESTOR')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-2.5 ${
              selectedRole === 'INVESTOR'
                ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500 text-blue-950'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'INVESTOR'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                Investor Sign In
                {selectedRole === 'INVESTOR' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                Deals, thesis &amp; agreements
              </p>
            </div>
          </button>

          {/* Business Tab */}
          <button
            type="button"
            onClick={() => setSelectedRole('BUSINESS')}
            className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-2.5 ${
              selectedRole === 'BUSINESS'
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500 text-emerald-950'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'BUSINESS'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                Business Sign In
                {selectedRole === 'BUSINESS' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                Fundraising &amp; campaign
              </p>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'INVESTOR' ? 'Investor Email Address' : 'Business Account Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'INVESTOR'
                      ? 'investor@example.com'
                      : 'founder@yourcompany.com'
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-xl text-xs font-semibold shadow-sm transition mt-2 flex items-center justify-center gap-1.5 ${
                selectedRole === 'INVESTOR'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                'Authenticating...'
              ) : selectedRole === 'INVESTOR' ? (
                <>Sign In to Investor Dashboard &rarr;</>
              ) : (
                <>Sign In to Business Dashboard &rarr;</>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {selectedRole === 'INVESTOR' ? (
              <>
                New investor on Vestiq?{' '}
                <Link
                  href="/register?role=investor"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create Investor Account &rarr;
                </Link>
              </>
            ) : (
              <>
                Raising capital for your business?{' '}
                <Link
                  href="/register?role=business"
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Register Your Startup &rarr;
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Platform Administrator Discreet Link */}
        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-700 transition"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" /> Platform Administrator? Executive Portal &rarr;
          </Link>
        </div>

        {/* Bottom Tagline */}
        <p className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
          Vestiq • Standardized B2B Investment &amp; Partnership Discovery Platform
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <p className="text-xs text-slate-500">Loading sign in portal...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

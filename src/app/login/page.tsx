'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Briefcase,
  Shield,
  CheckCircle2,
  Sparkles,
  User,
  Building2
} from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'INVESTOR' | 'BUSINESS' | 'ADMIN'>('INVESTOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage('Authenticating credentials...');

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
        setStatusMessage('Authentication successful! Navigating to workspace...');
        const destination =
          data.redirectUrl ||
          (data.user?.role === 'ADMIN'
            ? '/admin'
            : data.user?.role === 'BUSINESS'
            ? '/dashboard/business'
            : data.onboardingCompleted
            ? '/dashboard/investor'
            : '/onboarding/investor');

        // Full browser navigation ensures the session cookie is dispatched cleanly
        window.location.href = destination;
      } else {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        setStatusMessage(null);
        setLoading(false);
      }
    } catch {
      setError('Network connection error. Please try again.');
      setStatusMessage(null);
      setLoading(false);
    }
  };

  const handleExecutiveQuickAccess = (type: 'FOUNDER' | 'COFOUNDER') => {
    if (type === 'FOUNDER') {
      setEmail('vestiq21@gmail.com');
      setPassword('Vestiq@Launch2026!');
      handleLogin(undefined, 'vestiq21@gmail.com', 'Vestiq@Launch2026!');
    } else {
      setEmail('bhavana@vestiq.com');
      setPassword('Vestiq@Bhavana2026!');
      handleLogin(undefined, 'bhavana@vestiq.com', 'Vestiq@Bhavana2026!');
    }
  };

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Card Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xl shadow-sm flex items-center justify-center transition">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">VESTIQ</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-950">Welcome Back</h1>
          <p className="mt-1 text-xs text-slate-500">
            Select your account portal to sign in to your workspace
          </p>
        </div>

        {/* 3 Main Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {/* 1. Investor Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('INVESTOR');
              setError(null);
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedRole === 'INVESTOR'
                ? 'bg-blue-50/90 border-blue-600 shadow-sm ring-2 ring-blue-500/20 text-blue-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <UserCheck className={`w-4 h-4 ${selectedRole === 'INVESTOR' ? 'text-blue-600' : 'text-slate-400'}`} />
              {selectedRole === 'INVESTOR' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-900">Investor</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Deals &amp; Diligence</span>
            </div>
          </button>

          {/* 2. Business Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('BUSINESS');
              setError(null);
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedRole === 'BUSINESS'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Briefcase className={`w-4 h-4 ${selectedRole === 'BUSINESS' ? 'text-emerald-600' : 'text-slate-400'}`} />
              {selectedRole === 'BUSINESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-900">Startup</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Fundraising</span>
            </div>
          </button>

          {/* 3. Executive Admin Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('ADMIN');
              setError(null);
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedRole === 'ADMIN'
                ? 'bg-amber-50/90 border-amber-600 shadow-sm ring-2 ring-amber-500/20 text-amber-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Shield className={`w-4 h-4 ${selectedRole === 'ADMIN' ? 'text-amber-600' : 'text-slate-400'}`} />
              {selectedRole === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-900">Executive</span>
              <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Admin Desks</span>
            </div>
          </button>
        </div>

        {/* Executive Quick Access Desks (Shown when Executive Admin tab is active) */}
        {selectedRole === 'ADMIN' && (
          <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl mb-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" /> Executive Leadership 1-Click Desks
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                Direct Sign In
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Founder Desk: BOLLOJU BHANU TEJA */}
              <button
                type="button"
                onClick={() => handleExecutiveQuickAccess('FOUNDER')}
                disabled={loading}
                className="p-3.5 rounded-2xl border border-blue-500/40 bg-blue-950/70 hover:bg-blue-900 text-left transition relative group shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      BT
                    </div>
                    <span className="text-[10px] font-bold uppercase text-blue-300 tracking-wider">
                      Founder Admin
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition" />
                </div>
                <div className="font-extrabold text-white text-xs truncate">
                  BOLLOJU BHANU TEJA
                </div>
                <p className="text-[10px] text-blue-300 mt-0.5">
                  Core Tech &amp; Legal Deeds
                </p>
                <span className="mt-2.5 block text-[11px] text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  1-Click Sign In &rarr;
                </span>
              </button>

              {/* Co-Founder Desk: BHAVANA */}
              <button
                type="button"
                onClick={() => handleExecutiveQuickAccess('COFOUNDER')}
                disabled={loading}
                className="p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/70 hover:bg-emerald-900 text-left transition relative group shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      BH
                    </div>
                    <span className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">
                      Co-Founder Admin
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
                <div className="font-extrabold text-white text-xs truncate">
                  BHAVANA
                </div>
                <p className="text-[10px] text-emerald-300 mt-0.5">
                  Operations &amp; Diligence
                </p>
                <span className="mt-2.5 block text-[11px] text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  1-Click Sign In &rarr;
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Login Form Box */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs mb-5 flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">
              {selectedRole === 'INVESTOR'
                ? 'Investor Sign In'
                : selectedRole === 'BUSINESS'
                ? 'Startup & Business Sign In'
                : 'Executive Admin Credentials'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedRole === 'INVESTOR'
                ? 'Enter your credentials to explore opportunities and diligence vaults'
                : selectedRole === 'BUSINESS'
                ? 'Access your funding campaign, investor inquiries and executed deeds'
                : 'Or sign in with administrative email and password'}
            </p>
          </div>

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'INVESTOR'
                  ? 'Investor Email Address'
                  : selectedRole === 'BUSINESS'
                  ? 'Business Account Email'
                  : 'Executive Admin Email'}
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
                      : selectedRole === 'BUSINESS'
                      ? 'founder@yourcompany.com'
                      : 'vestiq21@gmail.com'
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
                  : selectedRole === 'BUSINESS'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? (
                'Authenticating & Redirecting...'
              ) : selectedRole === 'INVESTOR' ? (
                <>Sign In to Investor Dashboard &rarr;</>
              ) : selectedRole === 'BUSINESS' ? (
                <>Sign In to Business Dashboard &rarr;</>
              ) : (
                <>Sign In to Admin Oversight &rarr;</>
              )}
            </button>
          </form>

          {/* Registration / Action Links */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {selectedRole === 'INVESTOR' && (
              <>
                New investor on Vestiq?{' '}
                <Link
                  href="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create Investor Account &rarr;
                </Link>
              </>
            )}
            {selectedRole === 'BUSINESS' && (
              <>
                Raising capital for your business?{' '}
                <Link
                  href="/register"
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Register Your Startup &rarr;
                </Link>
              </>
            )}
            {selectedRole === 'ADMIN' && (
              <>
                Switch to general user login:{' '}
                <button
                  type="button"
                  onClick={() => setSelectedRole('INVESTOR')}
                  className="text-blue-600 font-semibold hover:underline ml-1"
                >
                  Investor
                </button>
                {' • '}
                <button
                  type="button"
                  onClick={() => setSelectedRole('BUSINESS')}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Startup
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Footer Access to Admin Desk */}
        {selectedRole !== 'ADMIN' && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-700 font-medium transition"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" /> Executive Leadership Desk (Founder &amp; Co-Founder) &rarr;
            </button>
          </div>
        )}

        {/* Bottom Tagline */}
        <p className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
          Vestiq • Institutional B2B Business Investment &amp; Partnership Discovery
        </p>
      </div>
    </div>
  );
}

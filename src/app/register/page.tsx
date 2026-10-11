'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Briefcase,
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  User,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Building2,
  Layers,
  Coins
} from 'lucide-react';

const INDUSTRIES_LIST = [
  'Technology',
  'AI & Robotics',
  'CleanTech & EV',
  'HealthTech',
  'AgriTech',
  'FinTech',
  'Logistics & Supply Chain',
  'Manufacturing',
  'Consumer & D2C',
  'Education',
  'Other',
];

export default function RegisterPage() {
  const [role, setRole] = useState<'INVESTOR' | 'BUSINESS'>('INVESTOR');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [fundingRequirement, setFundingRequirement] = useState<number>(2500000);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read URL query params on client mount without triggering Next.js Suspense bailout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qRole = params.get('role')?.toUpperCase();
      if (qRole === 'BUSINESS') {
        setRole('BUSINESS');
      } else if (qRole === 'INVESTOR') {
        setRole('INVESTOR');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must acknowledge the Risk Disclosure and Terms of Service to create an account.');
      return;
    }

    if (role === 'BUSINESS' && !companyName.trim()) {
      setError('Please provide your Startup / Company Name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone.trim() || undefined,
          country,
          city: city.trim() || undefined,
          companyName: role === 'BUSINESS' ? companyName.trim() : undefined,
          industry: role === 'BUSINESS' ? industry : undefined,
          fundingRequirement: role === 'BUSINESS' ? Number(fundingRequirement) : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Full browser navigation ensures session cookies are recognized reliably
        const destination = data.redirectUrl || (role === 'INVESTOR' ? '/onboarding/investor' : '/dashboard/business');
        window.location.href = destination;
      } else {
        setError(data.error || 'Registration failed. Please check inputs.');
        setLoading(false);
      }
    } catch {
      setError('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xl shadow-sm flex items-center justify-center transition">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">VESTIQ</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-slate-200 text-slate-700">
            {role === 'BUSINESS' ? 'Startup & SME Capital Gateway' : 'Accredited Investor Portal'}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950">
            {role === 'BUSINESS' ? 'Register Your Startup' : 'Create Investor Account'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {role === 'BUSINESS'
              ? 'Create your verified company profile to connect with accredited Indian angel investors & debt capital'
              : 'Select your account type to access standardized deal discovery and due diligence tools'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('INVESTOR')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              role === 'INVESTOR'
                ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <UserCheck className={`w-5 h-5 ${role === 'INVESTOR' ? 'text-blue-600' : 'text-slate-400'}`} />
              {role === 'INVESTOR' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">I am an Investor</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Research opportunities &amp; set preferences
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('BUSINESS')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              role === 'BUSINESS'
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Briefcase className={`w-5 h-5 ${role === 'BUSINESS' ? 'text-emerald-600' : 'text-slate-400'}`} />
              {role === 'BUSINESS' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">I am a Business / Startup</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Raise capital &amp; connect with investors
              </span>
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Startup Specific Field: Company Name */}
            {role === 'BUSINESS' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Startup / Company Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Robotics Technologies Pvt Ltd"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'BUSINESS' ? 'Founder / Legal Representative Full Name *' : 'Full Legal Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Mehta"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Startup Specific: Industry & Target Capital */}
            {role === 'BUSINESS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry / Sector *
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {INDUSTRIES_LIST.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Capital (₹ INR) *
                  </label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={fundingRequirement}
                      onChange={(e) => setFundingRequirement(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value={1500000}>₹15 Lakhs</option>
                      <option value={2500000}>₹25 Lakhs</option>
                      <option value={5000000}>₹50 Lakhs</option>
                      <option value={10000000}>₹1 Crore</option>
                      <option value={20000000}>₹2 Crores</option>
                      <option value={50000000}>₹5 Crores</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'BUSINESS' ? 'Work / Business Email Address *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'BUSINESS' ? 'founder@yourcompany.com' : 'investor@example.com'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password * (minimum 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Headquarters</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad, Bengaluru"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Risk Disclosure Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I understand that Vestiq is strictly an informational discovery platform, not a broker-dealer or investment advisor. I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 underline">Terms of Service</Link>,{' '}
                  <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>, and acknowledge the{' '}
                  <Link href="/risk-disclosure" className="text-blue-600 underline">Risk Disclosure</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-xl text-xs font-semibold shadow-sm transition mt-3 flex items-center justify-center gap-1.5 ${
                role === 'BUSINESS'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading
                ? 'Creating Account...'
                : role === 'BUSINESS'
                ? 'Register Your Startup →'
                : 'Register as Investor →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered on Vestiq?{' '}
            <Link
              href={role === 'BUSINESS' ? '/login?role=business' : '/login?role=investor'}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In to Your {role === 'BUSINESS' ? 'Startup' : 'Investor'} Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

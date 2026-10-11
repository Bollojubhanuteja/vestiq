'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Sliders,
  IndianRupee,
  AlertCircle,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';

const INDUSTRIES_LIST = [
  'Technology',
  'AI',
  'Agriculture',
  'Healthcare',
  'Education',
  'FinTech',
  'E-commerce',
  'SaaS',
  'Manufacturing',
  'Energy',
  'Climate',
  'Logistics',
  'Other',
];

const HORIZONS_LIST = ['<1 year', '1–3 years', '3–5 years', '5+ years'];

const STAGES_LIST = ['Pre-seed', 'Seed', 'Early Stage', 'Growth', 'Expansion', 'Mature'];

export default function InvestorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');

  // Experience
  const [experienceLevel, setExperienceLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'EXPERIENCED'>('INTERMEDIATE');

  // Preferences
  const [minInvestment, setMinInvestment] = useState(250000);
  const [maxInvestment, setMaxInvestment] = useState(2500000);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['Technology', 'AI', 'Agriculture']);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>(['India']);
  const [selectedHorizons, setSelectedHorizons] = useState<string[]>(['3–5 years']);
  const [riskTolerance, setRiskTolerance] = useState<'LOWER' | 'MODERATE' | 'HIGHER'>('MODERATE');
  const [selectedStages, setSelectedStages] = useState<string[]>(['Seed', 'Early Stage', 'Growth']);
  const [revenuePreference, setRevenuePreference] = useState('REVENUE_GENERATING');
  const [profitabilityPreference, setProfitabilityPreference] = useState('ANY');

  // Load existing session data
  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setFullName(data.user.name || '');
            setCountry(data.user.country || 'India');
            setCity(data.user.city || '');
            setPhone(data.user.phone || '');
            if (data.user.investorProfile?.experienceLevel) {
              setExperienceLevel(data.user.investorProfile.experienceLevel);
            }
          }
        } else {
          router.push('/login?redirect=/onboarding/investor');
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMe();
  }, [router]);

  const toggleIndustry = (ind: string) => {
    if (selectedIndustries.includes(ind)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== ind));
    } else {
      setSelectedIndustries([...selectedIndustries, ind]);
    }
  };

  const toggleHorizon = (h: string) => {
    if (selectedHorizons.includes(h)) {
      setSelectedHorizons(selectedHorizons.filter((item) => item !== h));
    } else {
      setSelectedHorizons([...selectedHorizons, h]);
    }
  };

  const toggleStage = (s: string) => {
    if (selectedStages.includes(s)) {
      setSelectedStages(selectedStages.filter((item) => item !== s));
    } else {
      setSelectedStages([...selectedStages, s]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !fullName.trim()) {
      setError('Please provide your legal full name.');
      return;
    }
    if (step === 4 && selectedIndustries.length === 0) {
      setError('Please select at least one industry.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding/investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          country,
          city,
          experienceLevel,
          minInvestment,
          maxInvestment,
          industries: selectedIndustries,
          geographies: selectedGeographies,
          horizons: selectedHorizons,
          riskTolerance,
          stages: selectedStages,
          revenuePreference,
          profitabilityPreference,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = '/dashboard/investor';
      } else {
        setError(data.error || 'Failed to complete onboarding.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Progress Bar & Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-bold uppercase tracking-wider text-blue-600">
              Step {step} of 5
            </span>
            <span>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Investment Focus'}
              {step === 3 && 'Experience Level'}
              {step === 4 && 'Detailed Parameters'}
              {step === 5 && 'Confirmation & Disclaimer'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Step 1: Basic Information</h2>
                <p className="text-xs text-slate-500 mt-1">
                  We collect only necessary contact coordinates to identify your research account.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Mehta"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Bengaluru"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Investment Focus */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Step 2: Investment Focus &amp; Range</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify your typical individual ticket size range (used to calculate Amount Compatibility).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Ticket (₹)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ₹{minInvestment.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maximum Ticket (₹)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={maxInvestment}
                    onChange={(e) => setMaxInvestment(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ₹{maxInvestment.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Revenue Posture Preference
                </label>
                <select
                  value={revenuePreference}
                  onChange={(e) => setRevenuePreference(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ANY">Flexible (Any Revenue Stage)</option>
                  <option value="REVENUE_GENERATING">Revenue-Generating Only</option>
                  <option value="PRE_REVENUE">Open to Pre-Revenue / Research Stage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Profitability Preference
                </label>
                <select
                  value={profitabilityPreference}
                  onChange={(e) => setProfitabilityPreference(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ANY">Flexible (Any Profitability Posture)</option>
                  <option value="PATH_TO_PROFITABILITY">Clear Path to Profitability</option>
                  <option value="PROFITABLE">Currently Operating Profitable</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Experience */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Step 3: Private Investing Experience</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Helps tailor due diligence templates and terminology guides for your workflow.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    level: 'BEGINNER',
                    title: 'Beginner / First-Time Angel',
                    desc: 'Exploring private venture opportunities for the first time. Interested in structured explanations of venture mechanics.',
                  },
                  {
                    level: 'INTERMEDIATE',
                    title: 'Intermediate Allocator',
                    desc: 'Have participated in syndicates or made 1–4 direct private business angel investments previously.',
                  },
                  {
                    level: 'EXPERIENCED',
                    title: 'Experienced Angel / Family Office',
                    desc: 'Active portfolio builder with 5+ private deals, deep diligence processes, and established sector expertise.',
                  },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setExperienceLevel(item.level as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition ${
                      experienceLevel === item.level
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      {experienceLevel === item.level && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Detailed Parameters */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Step 4: Matching Parameters</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your sectors, target stages, time horizons, and risk appetite.
                </p>
              </div>

              {/* Industries */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Target Industries (Select all that apply) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES_LIST.map((ind) => {
                    const isSelected = selectedIndustries.includes(ind);
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Investment Horizon */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Preferred Investment Horizon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HORIZONS_LIST.map((h) => {
                    const isSelected = selectedHorizons.includes(h);
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => toggleHorizon(h)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Risk Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Risk Tolerance Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOWER', 'MODERATE', 'HIGHER'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRiskTolerance(r)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition ${
                        riskTolerance === r
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r === 'LOWER' ? 'Lower Risk' : r === 'MODERATE' ? 'Moderate Risk' : 'Higher Risk'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Stages */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Preferred Company Stages
                </label>
                <div className="flex flex-wrap gap-2">
                  {STAGES_LIST.map((stg) => {
                    const isSelected = selectedStages.includes(stg);
                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => toggleStage(stg)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Step 5: Profile Confirmation</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Please review your stated preferences before saving.
                </p>
              </div>

              {/* Crucial mandatory disclaimer box */}
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-3 leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Notice of Preference Organization: </strong>
                  "Your profile helps us organize opportunities according to your stated preferences. A match does not mean an opportunity is suitable or profitable."
                </p>
              </div>

              {/* Summary Review Grid */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Investor:</span>
                  <span className="font-bold text-slate-800">{fullName} ({experienceLevel})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Ticket Size Range:</span>
                  <span className="font-bold text-slate-800">
                    ₹{minInvestment.toLocaleString('en-IN')} – ₹{maxInvestment.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Selected Sectors:</span>
                  <span className="font-semibold text-slate-800">{selectedIndustries.join(', ')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Target Stages:</span>
                  <span className="font-semibold text-slate-800">{selectedStages.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Profile:</span>
                  <span className="font-bold text-slate-800">{riskTolerance} Risk</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
                >
                  Skip &amp; Enter Dashboard &rarr;
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1 shadow-sm"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                {loading ? 'Saving Profile...' : 'Confirm Preferences & Enter Dashboard'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

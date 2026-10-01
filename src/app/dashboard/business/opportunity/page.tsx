'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Save,
  Send,
  RefreshCw,
  ExternalLink
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

const STAGES = ['Pre-seed', 'Seed', 'Early Stage', 'Growth', 'Expansion', 'Mature'];

const REVENUE_OPTIONS = [
  'Pre-revenue',
  '₹1L - ₹10L/mo',
  '₹10L - ₹50L/mo',
  '₹50L+/mo',
  'Undisclosed',
];

const PROFITABILITY_OPTIONS = [
  'Profitable',
  'Near Break-even',
  'Loss-making',
  'Early Stage',
];

export default function BusinessOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Form Fields
  const [companyName, setCompanyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [businessStage, setBusinessStage] = useState('Seed');
  const [yearsOperating, setYearsOperating] = useState(1);
  const [teamSize, setTeamSize] = useState(4);
  const [businessDescription, setBusinessDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [customerTraction, setCustomerTraction] = useState('');
  const [revenueStatus, setRevenueStatus] = useState('Pre-revenue');
  const [revenueDetails, setRevenueDetails] = useState('');
  const [profitabilityStatus, setProfitabilityStatus] = useState('Early Stage');
  const [fundingRequirement, setFundingRequirement] = useState(2500000);
  const [intendedUseOfFunds, setIntendedUseOfFunds] = useState('');
  const [previousFunding, setPreviousFunding] = useState('');

  // Status
  const [status, setStatus] = useState('DRAFT');
  const [verificationStatus, setVerificationStatus] = useState('NOT_REVIEWED');
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/business/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.business) {
            const b = data.business;
            setBusinessId(b.id);
            setCompanyName(b.companyName || '');
            setFounderName(b.founderName || '');
            setEmail(b.email || '');
            setPhone(b.phone || '');
            setWebsite(b.website || '');
            setCountry(b.country || 'India');
            setCity(b.city || '');
            setIndustry(b.industry || 'Technology');
            setBusinessStage(b.businessStage || 'Seed');
            setYearsOperating(b.yearsOperating || 1);
            setTeamSize(b.teamSize || 4);
            setBusinessDescription(b.businessDescription || '');
            setProblem(b.problem || '');
            setSolution(b.solution || '');
            setBusinessModel(b.businessModel || '');
            setCustomerTraction(b.customerTraction || '');
            setRevenueStatus(b.revenueStatus || 'Pre-revenue');
            setRevenueDetails(b.revenueDetails || '');
            setProfitabilityStatus(b.profitabilityStatus || 'Early Stage');
            setFundingRequirement(b.fundingRequirement || 2500000);
            setIntendedUseOfFunds(b.intendedUseOfFunds || '');
            setPreviousFunding(b.previousFunding || '');
            setStatus(b.status || 'DRAFT');
            setVerificationStatus(b.verificationStatus || 'NOT_REVIEWED');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveDraft = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/business/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          founderName,
          email,
          phone,
          website,
          country,
          city,
          industry,
          businessStage,
          yearsOperating,
          teamSize,
          businessDescription,
          problem,
          solution,
          businessModel,
          customerTraction,
          revenueStatus,
          revenueDetails,
          profitabilityStatus,
          fundingRequirement,
          intendedUseOfFunds,
          previousFunding,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Profile draft saved successfully.');
        if (data.business?.id) setBusinessId(data.business.id);
      } else {
        setErrorMsg(data.error || 'Failed to save draft.');
      }
    } catch {
      setErrorMsg('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    // First save draft
    await handleSaveDraft();

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/business/submit', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatus('SUBMITTED');
        setVerificationStatus('UNDER_REVIEW');
        setSuccessMsg(data.message || 'Submitted for administrative review.');
      } else {
        setErrorMsg(data.error || 'Submission failed. Please check completeness.');
      }
    } catch {
      setErrorMsg('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading opportunity profile...</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Startup Dossier
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Opportunity Profile Editor
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Structured factual information will be reviewed by administrators before being visible in discovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : status === 'UNDER_REVIEW' || status === 'SUBMITTED'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Status: {status}
            </span>
            {businessId && status === 'APPROVED' && (
              <a
                href={`/opportunity/${businessId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-1"
              >
                View Public <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          {/* Section 1: Business Overview */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              1. Basic Company Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Startup Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. AgriPulse Technologies"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Founder / CEO Name *</label>
                <input
                  type="text"
                  required
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="e.g. Ananya Roy"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Contact Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sector & Stage */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              2. Industry &amp; Stage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry *</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stage *</label>
                <select
                  value={businessStage}
                  onChange={(e) => setBusinessStage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Years Operating</label>
                <input
                  type="number"
                  step="0.1"
                  value={yearsOperating}
                  onChange={(e) => setYearsOperating(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full-Time Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pitch & Business Model */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              3. Pitch, Problem &amp; Solution
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="One or two sentences explaining what the business does..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">The Problem Addressed *</label>
                <textarea
                  rows={3}
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe the market inefficiency, customer pain point, or structural gap..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Proposed Solution *</label>
                <textarea
                  rows={3}
                  required
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Explain your technology, product, or distribution approach..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Model &amp; Monetization *</label>
                <textarea
                  rows={2}
                  required
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value)}
                  placeholder="e.g. SaaS subscription at ₹12,000/yr, marketplace 8% take rate, unit sales..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Traction / Proof Points</label>
                <textarea
                  rows={2}
                  value={customerTraction}
                  onChange={(e) => setCustomerTraction(e.target.value)}
                  placeholder="e.g. 180 paying deployments, ₹36L ARR, 92% renewal rate, key pilots..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Financials & Raise Details */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              4. Financials &amp; Funding Requirement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Requirement (₹) *</label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={fundingRequirement}
                  onChange={(e) => setFundingRequirement(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Revenue Posture</label>
                <select
                  value={revenueStatus}
                  onChange={(e) => setRevenueStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {REVENUE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Profitability</label>
                <select
                  value={profitabilityStatus}
                  onChange={(e) => setProfitabilityStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {PROFITABILITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Revenue Source Detail / Evidence Note
                </label>
                <input
                  type="text"
                  value={revenueDetails}
                  onChange={(e) => setRevenueDetails(e.target.value)}
                  placeholder="e.g. ₹36L ARR reported for FY25 — Bank statements submitted for review"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Transparency standard: Claims will be marked as self-reported until admin verification.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Intended Capital Allocation / Use of Funds *
                </label>
                <textarea
                  rows={2}
                  required
                  value={intendedUseOfFunds}
                  onChange={(e) => setIntendedUseOfFunds(e.target.value)}
                  placeholder="e.g. 40% engineering expansion, 30% regional sales, 30% regulatory compliance..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Capital History</label>
                <input
                  type="text"
                  value={previousFunding}
                  onChange={(e) => setPreviousFunding(e.target.value)}
                  placeholder="e.g. Bootstrapped + ₹5L government grant"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              * Required fields for admin submission
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || submitting}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>

              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={saving || submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit for Admin Review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

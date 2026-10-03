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
  ExternalLink,
  Percent,
  TrendingUp,
  FileCheck,
  Lock,
  Layers
} from 'lucide-react';

const INDUSTRIES_LIST = [
  'Technology',
  'AI',
  'CleanTech',
  'HealthTech',
  'AgriTech',
  'Logistics',
  'Manufacturing',
  'FinTech',
  'Robotics',
  'DevSecOps',
  'Education',
  'E-commerce',
  'Other',
];

const STAGES = ['Seed', 'Early Stage', 'Growth', 'Expansion', 'Mature'];

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
  const [fundingRequirement, setFundingRequirement] = useState(5000000);
  const [intendedUseOfFunds, setIntendedUseOfFunds] = useState('');
  const [previousFunding, setPreviousFunding] = useState('');

  // B2B Investment Model Structure Fields
  const [investmentModel, setInvestmentModel] = useState<'FIXED_RETURN' | 'EQUITY'>('EQUITY');
  const [minimumInvestment, setMinimumInvestment] = useState(200000);
  const [proposedReturnRate, setProposedReturnRate] = useState<number | string>(16.0);
  const [investmentTenureMonths, setInvestmentTenureMonths] = useState<number | string>(24);
  const [expectedRepaymentAmount, setExpectedRepaymentAmount] = useState<number | string>(6600000);
  const [repaymentFrequency, setRepaymentFrequency] = useState('MONTHLY');
  const [collateralDetails, setCollateralDetails] = useState('');
  const [valuation, setValuation] = useState<number | string>(80000000);
  const [equityOffered, setEquityOffered] = useState<number | string>(12.0);
  const [investorRights, setInvestorRights] = useState('Quarterly audited financial reports, board observer seat, pro-rata subscription rights.');
  const [growthMetrics, setGrowthMetrics] = useState('');
  const [riskLevel, setRiskLevel] = useState('MODERATE');

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
            setFundingRequirement(b.fundingRequirement || 5000000);
            setIntendedUseOfFunds(b.intendedUseOfFunds || '');
            setPreviousFunding(b.previousFunding || '');
            setStatus(b.status || 'DRAFT');
            setVerificationStatus(b.verificationStatus || 'NOT_REVIEWED');

            // Load Investment Model fields
            if (b.investmentModel) setInvestmentModel(b.investmentModel);
            if (b.minimumInvestment) setMinimumInvestment(b.minimumInvestment);
            if (b.proposedReturnRate) setProposedReturnRate(b.proposedReturnRate);
            if (b.investmentTenureMonths) setInvestmentTenureMonths(b.investmentTenureMonths);
            if (b.expectedRepaymentAmount) setExpectedRepaymentAmount(b.expectedRepaymentAmount);
            if (b.repaymentFrequency) setRepaymentFrequency(b.repaymentFrequency);
            if (b.collateralDetails) setCollateralDetails(b.collateralDetails);
            if (b.valuation) setValuation(b.valuation);
            if (b.equityOffered) setEquityOffered(b.equityOffered);
            if (b.investorRights) setInvestorRights(b.investorRights);
            if (b.growthMetrics) setGrowthMetrics(b.growthMetrics);
            if (b.riskLevel) setRiskLevel(b.riskLevel);
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
          // Investment Model Fields
          investmentModel,
          minimumInvestment,
          proposedReturnRate,
          investmentTenureMonths,
          expectedRepaymentAmount,
          repaymentFrequency,
          collateralDetails,
          valuation,
          equityOffered,
          investorRights,
          growthMetrics,
          riskLevel,
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
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading opportunity campaign profile...</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Status Indicator */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Opportunity Profile
              </span>
              <span className="text-xs text-slate-400">•</span>
              {status === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Approved &amp; Published
                </span>
              ) : status === 'SUBMITTED' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3.5 h-3.5" /> Submitted (Under Review)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                  Draft Mode
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create / Edit Funding Opportunity
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Structure your funding requirement, configure investment models (Fixed Return or Equity), and provide verified disclosures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {businessId && status === 'APPROVED' && (
              <a
                href={`/opportunity/${businessId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Public Page
              </a>
            )}
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          {/* Section 1: Business Identity */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              1. Business Identity &amp; Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Registered Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Zenith CleanEnergy Technologies Private Limited"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Founder / Managing Director *</label>
                <input
                  type="text"
                  required
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="e.g. Rajeshwar Varma"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Hyderabad, Bengaluru, Pune"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.in"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Industry & Stage */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              2. Industry &amp; Stage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry *</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
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
                  step="0.5"
                  value={yearsOperating}
                  onChange={(e) => setYearsOperating(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full-Time Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pitch, Problem & Solution */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
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
                  placeholder="One or two sentences explaining what the business does and value provided..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Model &amp; Monetization *</label>
                <textarea
                  rows={2}
                  required
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value)}
                  placeholder="e.g. Enterprise hardware lease + 12% revenue-share on energy generation..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Traction / Proof Points</label>
                <textarea
                  rows={2}
                  value={customerTraction}
                  onChange={(e) => setCustomerTraction(e.target.value)}
                  placeholder="e.g. 42 operational hubs, ₹1.8 Cr FY25 revenue, signed master contracts..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: INVESTMENT MODEL SELECTION & PARAMETERS */}
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-blue-200/80">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              4. Investment Model &amp; Capital Structure *
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              Select whether you are raising debt-like capital with a contractual fixed return, or offering an equity partnership in your company.
            </p>

            {/* Model Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setInvestmentModel('FIXED_RETURN')}
                className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  investmentModel === 'FIXED_RETURN'
                    ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                }`}
              >
                <Percent className={`w-5 h-5 mt-0.5 ${investmentModel === 'FIXED_RETURN' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Option 1: Fixed Return / Debt</span>
                  <span className="text-xs text-slate-500">Contractual return (% p.a.), tenure duration, collateral, zero equity dilution.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInvestmentModel('EQUITY')}
                className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  investmentModel === 'EQUITY'
                    ? 'border-indigo-500 bg-white ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                }`}
              >
                <TrendingUp className={`w-5 h-5 mt-0.5 ${investmentModel === 'EQUITY' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">Option 2: Equity &amp; Partnership</span>
                  <span className="text-xs text-slate-500">Pre-money valuation, equity % pool, investor governance rights, long-term upside.</span>
                </div>
              </button>
            </div>

            {/* Total Requirement and Minimum Check */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Capital Sought (INR ₹) *
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={fundingRequirement}
                  onChange={(e) => setFundingRequirement(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Investment Check Ticket (INR ₹) *
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={minimumInvestment}
                  onChange={(e) => setMinimumInvestment(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* DYNAMIC FIELDS: FIXED RETURN */}
            {investmentModel === 'FIXED_RETURN' && (
              <div className="bg-white p-5 rounded-xl border border-emerald-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  Fixed Return Structure Parameters
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Proposed Return Rate (% p.a.) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={proposedReturnRate}
                      onChange={(e) => setProposedReturnRate(e.target.value)}
                      placeholder="e.g. 16.0"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Investment Tenure (Months) *
                    </label>
                    <input
                      type="number"
                      required
                      value={investmentTenureMonths}
                      onChange={(e) => setInvestmentTenureMonths(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Repayment Frequency *
                    </label>
                    <select
                      value={repaymentFrequency}
                      onChange={(e) => setRepaymentFrequency(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="MONTHLY">Monthly Amortization</option>
                      <option value="QUARTERLY">Quarterly Amortization</option>
                      <option value="AT_MATURITY">Bullet (At Maturity)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Collateral &amp; Security Structure *
                  </label>
                  <input
                    type="text"
                    required
                    value={collateralDetails}
                    onChange={(e) => setCollateralDetails(e.target.value)}
                    placeholder="e.g. First hypothecation charge on 50 DC fast chargers + escrow on EV fleet PPA receivables."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* DYNAMIC FIELDS: EQUITY */}
            {investmentModel === 'EQUITY' && (
              <div className="bg-white p-5 rounded-xl border border-indigo-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 block">
                  Equity &amp; Cap Table Parameters
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pre-Money Valuation (INR ₹) *
                    </label>
                    <input
                      type="number"
                      step="500000"
                      required
                      value={valuation}
                      onChange={(e) => setValuation(e.target.value)}
                      placeholder="e.g. 80000000 (8 Cr)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Equity Percentage Offered (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={equityOffered}
                      onChange={(e) => setEquityOffered(e.target.value)}
                      placeholder="e.g. 13.04"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Investor Rights &amp; Covenants Offered
                  </label>
                  <input
                    type="text"
                    value={investorRights}
                    onChange={(e) => setInvestorRights(e.target.value)}
                    placeholder="e.g. Quarterly audited MIS, board observer seat, pro-rata subscription rights."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Growth Metrics &amp; Unit Economics
                  </label>
                  <input
                    type="text"
                    value={growthMetrics}
                    onChange={(e) => setGrowthMetrics(e.target.value)}
                    placeholder="e.g. 58% YoY revenue growth, 82% recurring subscription margins."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Financial Metrics & Use of Funds */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              5. Revenue Verification &amp; Fund Utilization
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reported Revenue Posture *</label>
                <select
                  value={revenueStatus}
                  onChange={(e) => setRevenueStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {REVENUE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Profitability *</label>
                <select
                  value={profitabilityStatus}
                  onChange={(e) => setProfitabilityStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {PROFITABILITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source-Verified Revenue Details (e.g. GST filings / P&amp;L)
              </label>
              <input
                type="text"
                value={revenueDetails}
                onChange={(e) => setRevenueDetails(e.target.value)}
                placeholder="e.g. Self-reported &amp; MCA filed: ₹1.82 Cr FY25 revenue (Audited by KPMG/EY)"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Intended Use of Funds *</label>
              <textarea
                rows={3}
                required
                value={intendedUseOfFunds}
                onChange={(e) => setIntendedUseOfFunds(e.target.value)}
                placeholder="Specific breakdown of capital deployment across equipment, working capital, hiring, and expansion..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save & Submit Bar */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-6 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleSubmitForReview}
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Opportunity for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

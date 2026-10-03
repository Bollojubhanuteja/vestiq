'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MatchScoreBadge } from '@/components/MatchScoreBadge';
import { ExpressInterestModal } from '@/components/ExpressInterestModal';
import {
  Building2,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  Bookmark,
  Scale,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Info,
  Percent,
  Coins,
  Lock,
  Calendar,
  FileCheck
} from 'lucide-react';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Watchlist state
  const [isSaved, setIsSaved] = useState(false);
  const [savingWatchlist, setSavingWatchlist] = useState(false);

  // Express Interest Modal
  const [interestModalOpen, setInterestModalOpen] = useState(false);

  // Request info modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqSubject, setReqSubject] = useState('');
  const [reqMessage, setReqMessage] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState<string | null>(null);
  const [reqErrorMsg, setReqErrorMsg] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/opportunities/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsSaved(json.isSaved || false);
      } else if (res.status === 403) {
        setError('This opportunity profile is currently under private review and not accessible to the public.');
      } else {
        setError('Opportunity not found.');
      }
    } catch {
      setError('Failed to load opportunity data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleToggleWatchlist = async () => {
    setSavingWatchlist(true);
    try {
      const res = await fetch('/api/investor/watchlist', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessProfileId: id }),
      });
      if (res.ok) {
        setIsSaved(!isSaved);
      } else if (res.status === 401) {
        router.push('/login?redirect=/opportunity/' + id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingWatchlist(false);
    }
  };

  const handleSendInfoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReq(true);
    setReqErrorMsg(null);
    setReqSuccessMsg(null);

    try {
      const res = await fetch(`/api/opportunities/${id}/request-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: reqSubject,
          message: reqMessage,
        }),
      });
      const resJson = await res.json();
      if (res.ok) {
        setReqSuccessMsg('Inquiry submitted to the founder! You will receive updates in your investor dashboard.');
        setReqSubject('');
        setReqMessage('');
        setTimeout(() => setRequestModalOpen(false), 2000);
      } else if (res.status === 401) {
        setReqErrorMsg('Please log in as an investor to submit inquiries.');
      } else {
        setReqErrorMsg(resJson.error || 'Failed to submit inquiry.');
      }
    } catch {
      setReqErrorMsg('Network error. Please try again.');
    } finally {
      setSubmittingReq(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-slate-500">Loading opportunity diligence file...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center">
        <div className="p-8 bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Notice</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <Link
            href="/explore"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
          >
            &larr; Back to Explore Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const opp = data.opportunity;
  const matchResult = data.matchResult;
  const diligenceQuestions = data.diligenceQuestions || [];
  const factualSummary = data.factualSummary || [];

  const isFixedReturn = opp.investmentModel === 'FIXED_RETURN';

  const formatINR = (val?: number | null) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/dashboard/investor/compare?ids=${opp.id}`)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-slate-500" /> Compare
            </button>
            <button
              onClick={handleToggleWatchlist}
              disabled={savingWatchlist}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
              {isSaved ? 'Saved in Watchlist' : 'Save to Watchlist'}
            </button>
            <button
              onClick={() => setInterestModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-blue-300" /> Express Indicative Interest
            </button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {isFixedReturn ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    Option 1: Fixed Return ({opp.proposedReturnRate || 16}% p.a.)
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    Option 2: Equity &amp; Partnership ({opp.equityOffered || 12}% Pool)
                  </span>
                )}

                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {opp.industry}
                </span>

                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {opp.businessStage} Stage
                </span>

                {opp.verificationStatus === 'VERIFIED' ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ROC &amp; MCA Verified
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Admin Review
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                {opp.companyName}
              </h1>

              <p className="mt-2 text-sm text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {opp.city}, {opp.country} • Founded by {opp.founderName} • Operating: {opp.yearsOperating} yrs • Team: {opp.teamSize} members
              </p>
            </div>

            {/* Match Score Display */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 lg:min-w-[280px]">
              <div className="text-xs text-slate-500 font-medium mb-1">
                Preference Compatibility:
              </div>
              <MatchScoreBadge
                score={matchResult ? matchResult.score : 85}
                breakdown={matchResult ? matchResult.breakdown : []}
                summaryExplanation={matchResult ? matchResult.summaryExplanation : 'Institutional compatibility score.'}
                size="lg"
              />
              <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                Calculated from your saved investor preferences. Non-advisory discovery aid.
              </p>
            </div>
          </div>

          {/* Core Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Total Capital Sought</span>
              <span className="text-lg font-bold text-slate-900">
                {formatINR(opp.fundingRequirement)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Minimum Investment Check</span>
              <span className="text-lg font-bold text-blue-700">
                {formatINR(opp.minimumInvestment || 200000)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Reported Revenue</span>
              <span className="text-sm font-bold text-slate-800 truncate block">
                {opp.revenueStatus}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Operating Posture</span>
              <span className="text-sm font-bold text-slate-800 block">
                {opp.profitabilityStatus}
              </span>
            </div>
          </div>

          {/* Revenue Source Verification Note */}
          {opp.revenueDetails && (
            <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Revenue Claim &amp; Documentation Note: </span>
                <span>{opp.revenueDetails}</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 0: DEDICATED INVESTMENT MODEL & TERMS BOX */}
        <div className="mb-8">
          {isFixedReturn ? (
            <div className="bg-emerald-50/60 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Option 1 Framework
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Fixed Return / Debt Funding Facility
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setInterestModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" /> Express Interest in this Yield
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-6">
                <div className="p-4 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Proposed Annual Return</span>
                  <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
                    {opp.proposedReturnRate || 16}% p.a.
                  </span>
                  <span className="text-[11px] text-slate-500">Contractual coupon rate</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Tenure Duration</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {opp.investmentTenureMonths || 24} Months
                  </span>
                  <span className="text-[11px] text-slate-500">Fixed maturity horizon</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Repayment Frequency</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {opp.repaymentFrequency || 'MONTHLY'}
                  </span>
                  <span className="text-[11px] text-slate-500">Principal + interest amortized</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Expected Repayment Pool</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {opp.expectedRepaymentAmount ? formatINR(opp.expectedRepaymentAmount) : 'Formulaic (P + I)'}
                  </span>
                  <span className="text-[11px] text-slate-500">Total gross facility return</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200/70 text-xs text-slate-700 space-y-2 mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Collateral &amp; Security Structure:
                </div>
                <p className="leading-relaxed">
                  {opp.collateralDetails || 'Charge on company commercial receivables and primary capital assets registered under MCA Form CHG-1.'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Risk Disclosure:</strong> Proposed returns represent contractual obligations of the borrowing company. Returns are not guaranteed by Vestiq or insurance schemes and depend strictly on the company’s operating solvency.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50/60 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-indigo-200/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                      Option 2 Framework
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Equity &amp; Direct Strategic Partnership
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setInterestModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" /> Express Interest in this Equity
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-6">
                <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Pre-Money Valuation</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {formatINR(opp.valuation || opp.preMoneyValuation || 100000000)}
                  </span>
                  <span className="text-[11px] text-slate-500">Agreed baseline valuation</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Equity Pool Offered</span>
                  <span className="text-xl font-extrabold text-indigo-700 mt-1 block">
                    {opp.equityOffered || 12}%
                  </span>
                  <span className="text-[11px] text-slate-500">Aggregate share pool</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Minimum Check Size</span>
                  <span className="text-xl font-extrabold text-blue-700 mt-1 block">
                    {formatINR(opp.minimumInvestment || 500000)}
                  </span>
                  <span className="text-[11px] text-slate-500">Minimum ticket per investor</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                  <span className="text-slate-500 font-medium block">Ownership per Min Check</span>
                  <span className="text-xl font-extrabold text-indigo-700 mt-1 block">
                    {opp.investorOwnershipPercentage
                      ? `${opp.investorOwnershipPercentage}%`
                      : `${(((opp.minimumInvestment || 500000) / (opp.valuation || 100000000)) * 100).toFixed(2)}%`}
                  </span>
                  <span className="text-[11px] text-slate-500">Pro-rata ownership</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-white border border-indigo-200/70 text-xs text-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" /> Investor Rights &amp; Covenants:
                  </span>
                  <p className="leading-relaxed">
                    {opp.investorRights || 'Information rights, quarterly audited financial MIS, board observer seat, tag-along rights, and pro-rata subscription.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-indigo-200/70 text-xs text-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" /> Operational Growth Profile:
                  </span>
                  <p className="leading-relaxed">
                    {opp.growthMetrics || 'Demonstrated YoY unit economic growth and path to commercial scale.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Risk Disclosure:</strong> Equity investments carry substantial venture risk, illiquidity, and potential for total loss of capital. Future liquidity depends on company growth, subsequent funding, and M&amp;A exits.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Deep Diligence Dossier */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Business Overview */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Business Overview</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opp.businessDescription}
              </p>
            </div>

            {/* 2 & 3. Problem & Solution */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Problem Addressed</h2>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {opp.problem}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. Proposed Solution</h2>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {opp.solution}
                </p>
              </div>
            </div>

            {/* 4 & 5. Business Model & Traction */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Business Model &amp; Monetization</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {opp.businessModel}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Customer Traction &amp; Commercial Validation</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {opp.customerTraction || 'Specific pilot contracts and retention cohorts available upon formal diligence inquiry.'}
                </p>
              </div>
            </div>

            {/* 6. Team & Organization */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Team &amp; Organization</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-1">Founder / Managing Director</span>
                  <span className="text-sm font-bold text-slate-900">{opp.founderName}</span>
                  <p className="text-slate-500 mt-1">Direct contact registered with platform verification.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-1">Current Core Headcount</span>
                  <span className="text-sm font-bold text-slate-900">{opp.teamSize} Full-time equivalents</span>
                  <p className="text-slate-500 mt-1">Operating continuously for {opp.yearsOperating} years.</p>
                </div>
              </div>
            </div>

            {/* 7. Capital Allocation & Intended Use of Funds */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Capital Allocation &amp; Use of Funds</h2>
              <div className="mb-4">
                <span className="text-xs text-slate-500">Total Capital Sought:</span>
                <span className="text-xl font-extrabold text-blue-600 block mt-0.5">
                  {formatINR(opp.fundingRequirement)}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                {opp.intendedUseOfFunds}
              </p>
            </div>

            {/* 8. Known Risk Indicators */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">8. Highlighted Risk Factors</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Independent risk notes logged during administrative due diligence inspection:
              </p>

              {opp.riskFlags && opp.riskFlags.length > 0 ? (
                <div className="space-y-3">
                  {opp.riskFlags.map((flag: any) => (
                    <div
                      key={flag.id}
                      className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                          {flag.category} Risk • Severity: {flag.severity}
                        </span>
                        <p className="mt-0.5 leading-snug">{flag.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-500">
                  Standard private company risk factors apply (execution risk, market liquidity, regulatory compliance).
                </div>
              )}
            </div>

            {/* 9. Supporting Documents */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-3">9. Verified Supporting Documents</h2>
              {opp.documents && opp.documents.length > 0 ? (
                <div className="space-y-2.5">
                  {opp.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{doc.title}</p>
                          <p className="text-[11px] text-slate-500">{doc.sourceClaim || 'Submitted document'}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Additional documents (pitch deck, financial models) can be requested through the direct inquiry tool.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Diligence Actions & AI Aids */}
          <div className="space-y-8">
            {/* Primary Action Card: Express Indicative Interest */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-sm sticky top-24 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Express Indicative Interest
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Register your interest with {opp.founderName} to receive confidential data room access and indicative agreement drafts.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Model:</span>
                  <span className="font-bold text-slate-800">
                    {isFixedReturn ? 'Fixed Return (Debt)' : 'Equity Partnership'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Min Check:</span>
                  <span className="font-bold text-blue-700">
                    {formatINR(opp.minimumInvestment || 200000)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setInterestModalOpen(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Express Interest Now
              </button>

              <button
                onClick={() => setRequestModalOpen(true)}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                Request Custom Information
              </button>

              {/* Factual Executive Summary Box */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Objective Profile Synthesis</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 leading-snug">
                  {factualSummary.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structured Investor Diligence Questions (AI Assistive Tool) */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>Key Diligence Questions</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Assistive
                  </span>
                </div>

                <div className="space-y-2">
                  {diligenceQuestions.slice(0, 3).map((q: any, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                    >
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        {q.question}
                      </span>
                      <span className="text-[10px] text-slate-500 block italic">
                        Why: {q.rationale}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Express Interest */}
        <ExpressInterestModal
          isOpen={interestModalOpen}
          onClose={() => setInterestModalOpen(false)}
          opportunity={opp}
        />

        {/* Modal: Request Information Form */}
        {requestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Submit Information Request
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                To: {opp.founderName} ({opp.companyName})
              </p>

              {reqSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs mb-4">
                  {reqSuccessMsg}
                </div>
              )}

              {reqErrorMsg && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs mb-4">
                  {reqErrorMsg}
                </div>
              )}

              <form onSubmit={handleSendInfoRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject of Diligence Inquiry *
                  </label>
                  <input
                    type="text"
                    required
                    value={reqSubject}
                    onChange={(e) => setReqSubject(e.target.value)}
                    placeholder="e.g., Inquiring about customer retention and patent filings"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Message / Questions *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reqMessage}
                    onChange={(e) => setReqMessage(e.target.value)}
                    placeholder="Please specify the information, data room access, or unit economic metrics you wish to evaluate..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
                  <strong>Reminder:</strong> Do not share banking passwords or offer investment commitments inside inquiries. All formal contracts occur offline under independent legal review.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReq}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    {submittingReq ? 'Transmitting...' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

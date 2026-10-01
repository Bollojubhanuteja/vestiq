'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MatchScoreBadge } from '@/components/MatchScoreBadge';
import {
  Building2,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Bookmark,
  Scale,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Info
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

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
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
              onClick={() => setRequestModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Request Information
            </button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-slate-100 text-slate-800">
                  {opp.industry}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {opp.businessStage} Stage
                </span>
                {opp.verificationStatus === 'VERIFIED' ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Information Verified by Platform
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> Pending Admin Review
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
                score={matchResult ? matchResult.score : 70}
                breakdown={matchResult ? matchResult.breakdown : []}
                summaryExplanation={matchResult ? matchResult.summaryExplanation : 'Standard preview score.'}
                size="lg"
              />
              <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                Calculated purely from your saved investor preferences. Not an investment recommendation.
              </p>
            </div>
          </div>

          {/* Core Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Funding Requirement</span>
              <span className="text-lg font-bold text-slate-900">
                ₹{opp.fundingRequirement.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Reported Revenue Posture</span>
              <span className="text-sm font-bold text-slate-800 truncate block">
                {opp.revenueStatus}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Operating Profitability</span>
              <span className="text-sm font-bold text-slate-800 block">
                {opp.profitabilityStatus}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Previous Capital</span>
              <span className="text-sm font-semibold text-slate-800 truncate block">
                {opp.previousFunding || 'Self-funded / Bootstrapped'}
              </span>
            </div>
          </div>

          {/* Revenue Source Verification Note */}
          {opp.revenueDetails && (
            <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Revenue Claim &amp; Documentation Note: </span>
                <span>{opp.revenueDetails}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid: 17 Sections Organized Cleanly */}
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

            {/* 4 & 5 & 6. Product, Market & Business Model */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Business Model &amp; Monetization</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {opp.businessModel}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Customer Traction &amp; Validation</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {opp.customerTraction || 'Specific pilot contracts and retention cohorts available upon formal diligence inquiry.'}
                </p>
              </div>
            </div>

            {/* 7 & 8. Team & Operational Capability */}
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

            {/* 9 & 10. Funding Requirement & Intended Use of Funds */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Capital Allocation &amp; Use of Funds</h2>
              <div className="mb-4">
                <span className="text-xs text-slate-500">Total Capital Sought:</span>
                <span className="text-xl font-extrabold text-blue-600 block mt-0.5">
                  ₹{opp.fundingRequirement.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                {opp.intendedUseOfFunds}
              </p>
            </div>

            {/* 11. Known Risk Indicators */}
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

            {/* 12. Supporting Documents */}
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

          {/* Right Column: AI Diligence Aids & Request Info Card */}
          <div className="space-y-8">
            {/* Request Information Action Card */}
            <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm sticky top-24">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Conduct Private Diligence
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Connect directly with founder {opp.founderName}. Request operational clarification, schedule a briefing, or ask specific commercial questions.
              </p>

              <button
                onClick={() => setRequestModalOpen(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2 mb-3"
              >
                <Send className="w-4 h-4" /> Request Information
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                <strong>Privacy Note:</strong> Inquiries are transmitted securely. No financial commitments or binding agreements take place on Vestiq.
              </div>

              {/* Factual Executive Summary Box */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Objective Profile Synthesis</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 leading-snug">
                  {factualSummary.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structured Investor Diligence Questions (AI Assistive Tool) */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>Diligence Questions to Ask</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    AI Assist
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Key questions tailored to {opp.industry} ventures:
                </p>

                <div className="space-y-3">
                  {diligenceQuestions.slice(0, 3).map((q: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                    >
                      <span className="font-semibold text-slate-800 block mb-1">
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Layers,
  Users,
  Briefcase,
  Sliders,
  FileCheck,
  Send,
  AlertTriangle,
  History,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Cpu,
  Scale,
  Sparkles,
  Lock,
  Building,
  UserCheck,
  FileText,
  BadgeCheck,
  Coins
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeDesk, setActiveDesk] = useState<'ALL' | 'FOUNDER' | 'COFOUNDER'>('ALL');

  useEffect(() => {
    async function loadAdmin() {
      try {
        const [meRes, metRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/admin/metrics'),
        ]);

        if (!meRes.ok) {
          router.push('/login?redirect=/admin');
          return;
        }

        const meData = await meRes.json();
        if (meData.user?.role !== 'ADMIN') {
          router.push('/');
          return;
        }

        setCurrentUser(meData.user);

        // Intelligently set the default view to the logged-in founder's desk
        if (meData.user?.email === 'bhavana@vestiq.com' || meData.user?.name?.toLowerCase().includes('bhavana')) {
          setActiveDesk('COFOUNDER');
        } else if (meData.user?.email === 'vestiq21@gmail.com' || meData.user?.name?.toLowerCase().includes('bhanu')) {
          setActiveDesk('FOUNDER');
        }

        if (metRes.ok) {
          const metData = await metRes.json();
          setMetrics(metData.metrics || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Authenticating executive credentials...</p>
      </div>
    );
  }

  const isBhanu = currentUser?.email === 'vestiq21@gmail.com' || currentUser?.name?.toLowerCase().includes('bhanu');
  const isBhavana = currentUser?.email === 'bhavana@vestiq.com' || currentUser?.name?.toLowerCase().includes('bhavana');

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Executive Active Session Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-sm border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-inner ${isBhavana ? 'bg-gradient-to-tr from-emerald-600 to-teal-500' : 'bg-gradient-to-tr from-blue-700 to-indigo-600'}`}>
              {isBhavana ? 'BH' : 'BT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {currentUser?.name || 'Administrative Executive'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isBhavana ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                  {isBhavana ? 'Co-Founder & Head of Operations' : 'Founder & Chief Platform Architect'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Logged in as <span className="font-mono text-slate-200">{currentUser?.email}</span> • Security Level: Super Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Switch Desk:</span>
            <div className="inline-flex rounded-xl p-1 bg-slate-950/70 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveDesk('FOUNDER')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${activeDesk === 'FOUNDER' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Founder (Bhanu Teja)
              </button>
              <button
                type="button"
                onClick={() => setActiveDesk('COFOUNDER')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${activeDesk === 'COFOUNDER' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Co-Founder (Bhavana)
              </button>
              <button
                type="button"
                onClick={() => setActiveDesk('ALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${activeDesk === 'ALL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                All Governance
              </button>
            </div>
          </div>
        </div>

        {/* Portal Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Administrative Governance &amp; Executive Operations
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeDesk === 'FOUNDER' && "Founder's Desk: BOLLOJU BHANU TEJA"}
              {activeDesk === 'COFOUNDER' && "Co-Founder's Desk: BHAVANA"}
              {activeDesk === 'ALL' && "Executive Leadership Governance"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {activeDesk === 'FOUNDER' && "Overseeing core technology architecture, algorithmic matching engine configuration, formal legal deed frameworks, and cryptographic SHA-256 security audit logs."}
              {activeDesk === 'COFOUNDER' && "Directing business verification queues, MCA CIN/GST financial audits, investor onboarding & due diligence, bilateral communications, and regional MSME cluster scaling."}
              {activeDesk === 'ALL' && "Comprehensive platform oversight across core technology architecture, business due diligence verification queues, and investor matchmaking operations."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/opportunities"
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" /> Verification Queue
            </Link>
            <Link
              href="/admin/matching-config"
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" /> Matching Engine Config
            </Link>
            <Link
              href="/admin/audit-logs"
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-slate-600" /> Audit Logs
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: FOUNDER'S DESK (BOLLOJU BHANU TEJA)                                */}
        {/* ========================================================================= */}
        {(activeDesk === 'FOUNDER' || activeDesk === 'ALL') && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  BT
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Founder&apos;s Portfolio: BOLLOJU BHANU TEJA
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Chief Platform Architect • Technology, Legal Engineering, Algorithms &amp; Security
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                Engineering &amp; Legal Framework
              </span>
            </div>

            {/* Founder's Key Work Streams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Stream 1: Algorithmic Matching Config */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    Active Formula
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  1. Matching Engine Weight Tuning
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Calibrate deterministic weights (Industry 25%, Capital 20%, Stage 15%, Horizon 15%, Risk 15%, Geo 10%) without artificial promises.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Formula Weights</span>
                  <Link
                    href="/admin/matching-config"
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Adjust Weights &rarr;
                  </Link>
                </div>
              </div>

              {/* Stream 2: Legal Deeds & SHA Infrastructure */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Statutory Deeds
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  2. Online Legal Deed &amp; SHA Architecture
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Oversees formal Loan / Debenture Deeds (with ROC CHG-1 charge registration) &amp; Shareholders&apos; Agreements (SHA / PAS-3 allotment).
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">IT Act 2000 (Sec 10A)</span>
                  <Link
                    href="/investment-models"
                    className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Review Framework &rarr;
                  </Link>
                </div>
              </div>

              {/* Stream 3: Cryptographic Security & Audit Logs */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <History className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    SHA-256 Hashes
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  3. Cryptographic Audit Trail
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Monitors tamper-evident audit logs of digital signing ceremonies, issued certificates (<code className="font-mono text-[10px] text-slate-700">VST-EXEC-...</code>), and system events.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Logged Actions: {metrics?.totalAudits ?? 0}</span>
                  <Link
                    href="/admin/audit-logs"
                    className="font-semibold text-slate-700 hover:underline flex items-center gap-1"
                  >
                    Inspect Audit Log &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Founder's Technical Checklist Card */}
            <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl border border-blue-800 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                    <Cpu className="w-4 h-4" /> Founder Responsibilities Summary
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Platform Architecture, Algorithm Weights &amp; Legal Enforceability
                  </h4>
                  <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
                    Bhanu Teja oversees serverless Next.js deployment, zero-leak database permissions, deterministic financial formulas, and the legal deed generation engine under Indian law.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/admin/matching-config"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    Open Engine Console
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CO-FOUNDER'S DESK (BHAVANA)                                       */}
        {/* ========================================================================= */}
        {(activeDesk === 'COFOUNDER' || activeDesk === 'ALL') && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  BH
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Co-Founder&apos;s Portfolio: BHAVANA
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Head of Strategic Operations • Due Diligence, Business Verification &amp; Investor Relations
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Verification &amp; Operations
              </span>
            </div>

            {/* Co-Founder's Key Work Streams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Stream 1: Business Verification Queue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {metrics?.pendingReviews ?? 0} In Queue
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  1. Business Verification &amp; Due Diligence
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Audits company submissions against MCA CIN, GST filings, promoter identity KYC, and audited financial statements before public discovery.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Under Review Queue</span>
                  <Link
                    href="/admin/opportunities"
                    className="font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    Open Queue ({metrics?.pendingReviews ?? 0}) &rarr;
                  </Link>
                </div>
              </div>

              {/* Stream 2: Investor Relations & Onboarding */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    {metrics?.totalInvestors ?? 0} Investors
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  2. Investor Network &amp; Onboarding Diligence
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Validates investor onboarding profiles, accredited capital parameters, thesis requirements, and investment readiness.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Investors: {metrics?.totalInvestors ?? 0}</span>
                  <Link
                    href="/explore"
                    className="font-semibold text-teal-600 hover:underline flex items-center gap-1"
                  >
                    View Network &rarr;
                  </Link>
                </div>
              </div>

              {/* Stream 3: Information Requests & Deal Inquiries */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {metrics?.totalRequests ?? 0} Inquiries
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  3. Bilateral Inquiries Moderation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Oversees confidential diligence Q&amp;A between investors and business owners, ensuring strict adherence to platform standards and regulatory compliance.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Inquiries: {metrics?.totalRequests ?? 0}</span>
                  <Link
                    href="/admin/opportunities"
                    className="font-semibold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    Inspect Inquiries &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Co-Founder's Operations Checklist Card */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl border border-emerald-800 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    <BadgeCheck className="w-4 h-4" /> Co-Founder Responsibilities Summary
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Verification Operations, Due Diligence &amp; Investor Ecosystem
                  </h4>
                  <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                    Bhavana directs the 4-stage business verification pipeline, verifies company legal registration and financial disclosures, and builds relationships with high-caliber Indian startups and investors.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/admin/opportunities"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    Inspect Verification Queue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMBINED EXECUTIVE PLATFORM METRICS                                       */}
        {/* ========================================================================= */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              Live Production Database Metrics (Real-Time)
            </h2>
            <span className="text-xs text-slate-500">Strictly Source-Verified • Zero Fake Stats</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Registered Investors</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {metrics?.totalInvestors ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Live DB Account Records</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Registered Businesses</span>
                <Briefcase className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {metrics?.totalBusinesses ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Founders &amp; Companies</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Approved in Discovery</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {metrics?.approvedOpportunities ?? 0}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Publicly Discoverable</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Pending Review Queue</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-amber-600">
                {metrics?.pendingReviews ?? 0}
              </div>
              <Link
                href="/admin/opportunities?status=UNDER_REVIEW"
                className="text-[11px] text-blue-600 font-semibold hover:underline mt-1 block"
              >
                Inspect submissions &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUNDERS' DIVISION OF RESPONSIBILITIES & GOVERNANCE MATRIX                */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Organizational Governance Structure
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              Founders&apos; Division of Responsibilities
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Clear operational separation between platform engineering and business due diligence ensures institutional grade execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder Column */}
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  BT
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950">BOLLOJU BHANU TEJA</h4>
                  <p className="text-xs text-blue-700 font-medium">Founder &amp; Chief Platform Architect</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Full-Stack Architecture:</strong> Next.js 14, TypeScript, Serverless APIs, and SQLite/PostgreSQL synchronization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Matching Algorithm:</strong> Multi-parameter deterministic preference scoring and formula calibration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Legal Contract Engine:</strong> Generating formal Loan Deeds (ROC CHG-1) and Shareholders Agreements (SHA / PAS-3).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Cryptographic Integrity:</strong> SHA-256 digital signature ceremony hashing under Section 10A of Indian IT Act, 2000.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>System Security &amp; RBAC:</strong> Strict role isolation between Investors, Founders, and Administrators.</span>
                </li>
              </ul>
            </div>

            {/* Co-Founder Column */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  BH
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950">BHAVANA</h4>
                  <p className="text-xs text-emerald-700 font-medium">Co-Founder &amp; Head of Strategic Operations</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Business Due Diligence:</strong> Verification of MCA CIN, GST filings, promoter identity, and financial statements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Verification Queue Governance:</strong> Moving companies from DRAFT &rarr; UNDER_REVIEW &rarr; VERIFIED &rarr; LIVE.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Investor Relations:</strong> Onboarding high-net-worth investors, angel networks, and syndicates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Inquiries &amp; Confidential Q&amp;A:</strong> Moderating bilateral investor inquiries and preventing disintermediation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Ecosystem Partnerships:</strong> Expanding Vestiq across Indian MSME clusters, manufacturing, and tech hubs.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Joint Executive Responsibility: Platform Trust, Compliance &amp; Zero Misrepresentation</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/opportunities" className="text-blue-600 font-semibold hover:underline">
                Open Verification Queue &rarr;
              </Link>
              <Link href="/admin/matching-config" className="text-blue-600 font-semibold hover:underline">
                Open Matching Config &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

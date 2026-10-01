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
  RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <p className="text-sm text-slate-500">Authenticating administrative credentials...</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Administrative Compliance Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Governance &amp; Verification
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit company registrations, verify proof documentation, configure matching weights, and monitor diligence inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/opportunities"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" /> Opportunity Verification Queue
            </Link>
            <Link
              href="/admin/matching-config"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" /> Matching Engine Config
            </Link>
          </div>
        </div>

        {/* Real Database Metrics Cards - Strictly NO fake statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Registered Investors</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {metrics?.totalInvestors ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Live DB Account Records</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Registered Businesses</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {metrics?.totalBusinesses ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Founders &amp; Companies</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Approved in Discovery</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {metrics?.approvedOpportunities ?? 0}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Publicly Discoverable</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
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

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Total Information Requests</span>
              <div className="text-2xl font-bold text-slate-900">{metrics?.totalRequests ?? 0} Inquiries</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Diligence communications between users</p>
            </div>
            <Send className="w-8 h-8 text-blue-500 opacity-80" />
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Immutable Audit Log Entries</span>
              <div className="text-2xl font-bold text-slate-900">{metrics?.totalAudits ?? 0} Recorded Actions</div>
              <Link href="/admin/audit-logs" className="text-[11px] text-blue-600 font-semibold hover:underline mt-0.5 block">
                View complete audit trail &rarr;
              </Link>
            </div>
            <History className="w-8 h-8 text-slate-400 opacity-80" />
          </div>
        </div>

        {/* Quick Admin Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/opportunities"
            className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-amber-300 card-hover shadow-sm transition block"
          >
            <FileCheck className="w-6 h-6 text-amber-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Opportunities Queue</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Review company drafts, verify financial claims, assign risk flags, and grant public publication status.
            </p>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              Open Queue <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/admin/matching-config"
            className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-300 card-hover shadow-sm transition block"
          >
            <Sliders className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Matching Engine Weights</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Configure deterministic weights for Industry, Ticket Size, Business Stage, Geography, Horizon, and Risk.
            </p>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              Adjust Formula Weights <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-slate-400 card-hover shadow-sm transition block"
          >
            <History className="w-6 h-6 text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Audit Trail &amp; Governance</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Inspect immutable audit records of all approval changes, verification status updates, and config changes.
            </p>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              View Audit Logs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

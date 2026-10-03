'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Layers,
  Send,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function BusinessDashboardPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, bizRes, inqRes, intRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/business/profile'),
          fetch('/api/business/requests'),
          fetch('/api/business/interests'),
        ]);

        if (!meRes.ok) {
          router.push('/login?redirect=/dashboard/business');
          return;
        }

        const meData = await meRes.json();
        if (meData.user?.role !== 'BUSINESS' && meData.user?.role !== 'ADMIN') {
          router.push('/');
          return;
        }

        if (bizRes.ok) {
          const bizData = await bizRes.json();
          setBusiness(bizData.business || null);
        }

        if (inqRes.ok) {
          const inqData = await inqRes.json();
          setInquiries(inqData.requests || []);
        }

        if (intRes.ok) {
          const intData = await intRes.json();
          setInterests(intData.interests || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading your business portal...</p>
      </div>
    );
  }

  const isApproved = business?.status === 'APPROVED';
  const isUnderReview = business?.status === 'UNDER_REVIEW' || business?.status === 'SUBMITTED';
  const isDraft = !business || business?.status === 'DRAFT';

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Founder Portal
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {business ? business.companyName : 'Your Startup Profile'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your opportunity profile, verify documentation, and respond to allocator inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/business/opportunity"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              {isDraft ? 'Complete Profile' : 'Edit Profile'}
            </Link>
            {isApproved && (
              <Link
                href={`/opportunity/${business.id}`}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium shadow-sm transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Public View
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Application Status Banner */}
        {isApproved ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl mb-8 flex items-start gap-3 text-emerald-950">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Status: Approved &amp; Published in Discovery</h3>
              <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                Your opportunity profile is actively indexed in the discovery directory. Qualified investors whose stated ticket sizes and stage preferences match your business can review your dossier.
              </p>
            </div>
          </div>
        ) : isUnderReview ? (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex items-start gap-3 text-amber-950">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">"Your opportunity is currently under review."</h3>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                An administrator is inspecting your company registration and submitted financials. To preserve platform integrity, opportunities do not appear publicly until admin approval.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl mb-8 flex items-start gap-3 text-blue-950">
            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Status: Draft Profile</h3>
              <p className="text-xs text-blue-900 mt-0.5 leading-relaxed">
                Please complete all required fields (Problem, Solution, Funding Requirement) and submit your profile for administrative review.
              </p>
            </div>
          </div>
        )}

        {/* Real Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/dashboard/business/requests"
            className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-sm hover:border-emerald-400 transition block"
          >
            <span className="text-xs text-emerald-800 font-bold block mb-1">Incoming Investor Interests</span>
            <div className="text-2xl font-extrabold text-emerald-950">{interests.length}</div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2">
              Review checks &amp; draft term sheets &rarr;
            </p>
          </Link>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium block mb-1">Model &amp; Structure</span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {business?.investmentModel === 'FIXED_RETURN' ? (
                <span className="text-emerald-700 font-bold">Fixed Return ({business?.proposedReturnRate || 16}% p.a.)</span>
              ) : (
                <span className="text-indigo-700 font-bold">Equity ({business?.equityOffered || 12}% Pool)</span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Min Check: ₹{business?.minimumInvestment ? (business.minimumInvestment / 100000).toFixed(0) : '2'} Lakhs
            </span>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium block mb-1">Total Capital Requirement</span>
            <div className="text-2xl font-extrabold text-slate-900">
              ₹{business?.fundingRequirement ? (business.fundingRequirement / 100000).toFixed(0) : '0'} Lakhs
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Committed: ₹{business?.amountCommitted ? (business.amountCommitted / 100000).toFixed(0) : '0'} Lakhs</span>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-medium block mb-1">Verification Status</span>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {business?.verificationStatus === 'VERIFIED' ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> MCA &amp; ROC Verified
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" /> Under Review
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {business?.verificationNotes || 'Diligence notes logged here.'}
            </p>
          </div>
        </div>

        {/* Inbound Diligence Inquiries Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Investor Inquiries</h2>
              <p className="text-xs text-slate-500">Direct questions submitted by verified researchers.</p>
            </div>
            <Link
              href="/dashboard/business/requests"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All ({inquiries.length}) &rarr;
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No inbound inquiries yet. Once your profile is approved, interested allocators can submit diligence questions here.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.slice(0, 3).map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{inq.subject}</span>
                    <span className="text-slate-500">
                      From: {inq.investorUser?.name || 'Investor'} ({inq.investorUser?.city || 'India'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        inq.status === 'RESPONDED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <Link
                      href="/dashboard/business/requests"
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                    >
                      Respond
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

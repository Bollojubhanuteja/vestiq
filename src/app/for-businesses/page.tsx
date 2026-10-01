import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ShieldCheck,
  Users,
  Send,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'For Businesses | Vestiq Opportunity Research Platform',
  description:
    'Present your startup to aligned capital allocators. Transparent submission, verification standards, and structured due diligence communication.',
};

export default function ForBusinessesPage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">
            Startup &amp; Enterprise Discovery
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Reach Relevant Allocators Without Cold Pitch Spam.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Stop blasting generic emails to uninterested investors. Vestiq matches your funding requirement, stage, and sector directly with investors actively looking for your profile.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register?role=BUSINESS"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition"
            >
              Submit Your Opportunity
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition"
            >
              Review Verification Standards
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Profile Badge</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stand out with an audited profile. Verification of your corporate registry, GST filings, and revenue statements builds immediate trust with institutional and angel researchers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Users className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pre-Filtered Investor Match</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our preference engine highlights your profile to investors whose stated ticket sizes, geographic focus, and sector preferences explicitly align with your raise.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Send className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Structured Diligence Inbox</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Manage inbound questions efficiently. Respond to structured inquiries from interested allocators directly in your business portal.
            </p>
          </div>
        </div>

        {/* Submission Checklist */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
            What You Need to Submit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Company incorporation documents &amp; country of registry</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Clear problem, solution, and monetization model narrative</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Realistic funding requirement &amp; milestone capital plan</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Revenue posture and historical traction figures</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

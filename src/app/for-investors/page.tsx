import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sliders,
  Scale,
  ShieldCheck,
  Bookmark,
  Search,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const metadata = {
  title: 'For Investors | Vestiq Opportunity Research Platform',
  description:
    'Standardized due diligence, transparent preference matching, and organized opportunity comparison for private capital allocators.',
};

export default function ForInvestorsPage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Capital Allocator Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Research Private Opportunities With Discipline.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Eliminate hype and fragmented data. Vestiq organizes venture discovery, normalizes company profiles, and provides factual comparison tools.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register?role=INVESTOR"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition"
            >
              Create Free Investor Profile
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition"
            >
              Browse Open Opportunities
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Sliders className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Preference Matching</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every opportunity is scored against your specified parameters: industry, ticket size, stage, geography, horizon, and risk tolerance. No blackbox claims.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Scale className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Side-by-Side Comparison</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Compare up to 3 businesses across 13 objective metrics: runway, traction, revenue verification, intended use of funds, and regulatory risk notes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Bookmark className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Private Watchlist &amp; Notes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Keep your research organized. Save opportunities to your private watchlist and write confidential diligence notes accessible only to you.
            </p>
          </div>
        </div>

        {/* Deal Flow & Opportunity Callout */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
              Direct Opportunity Discovery
            </span>
            <h3 className="text-xl font-bold">Structured Investment &amp; Partnership Workflow</h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Express interest directly on verified business listings, review repayment schedules or equity participation, and execute legal agreements seamlessly.
            </p>
          </div>
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white whitespace-nowrap transition"
          >
            Explore Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}

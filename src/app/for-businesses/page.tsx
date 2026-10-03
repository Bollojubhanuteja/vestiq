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
  ArrowRight,
  Percent,
  TrendingUp,
  Scale
} from 'lucide-react';

export const metadata = {
  title: 'Raise Capital | Vestiq B2B Investment Platform India',
  description:
    'Present your business to verified investors. Choose between Fixed Return / Debt funding (14%–18% p.a.) or Equity partnerships.',
};

export default function ForBusinessesPage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">
            Enterprise &amp; Startup Capital Solutions • India
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Raise Growth Capital with Structured Certainty.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Connect with verified Indian investors looking for carefully presented business opportunities. Choose between non-dilutive Fixed Return funding or strategic Equity partnerships.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register?role=BUSINESS"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition"
            >
              List Your Business / Funding Need
            </Link>
            <Link
              href="/investment-models"
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition"
            >
              Explore Investment Models
            </Link>
          </div>
        </div>

        {/* Two Investment Models for Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-emerald-50/50 border-2 border-emerald-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-4">
              <Percent className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Option 1: Non-Dilutive Capital
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Fixed Return / Debt Funding</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Retain 100% company ownership. Offer investors a structured contractual yield (typically 14% to 18% p.a.) backed by corporate collateral or receivables. Repay through predictable monthly or quarterly schedules.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 0% Equity Dilution for Founders
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 12 to 36 Months Tenure Horizons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Backed by Machinery or PPA Escrow
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-indigo-50/50 border-2 border-indigo-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
              Option 2: Venture Expansion
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Equity &amp; Direct Partnership</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Raise growth capital without debt service pressure. Partner with strategic angels and institutional syndicates to expand market distribution, hire core engineering talent, and accelerate scale.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Pre &amp; Post-Money Valuation Transparency
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Patient Capital Without Monthly Payouts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Standardized Indicative Shareholders Terms
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">MCA &amp; ROC Verified Badge</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stand out with an audited profile. Verification of your corporate registry, GST filings, and revenue statements builds immediate trust with serious allocators.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Users className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pre-Filtered Investor Match</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our preference matching engine highlights your opportunity to investors whose ticket sizes, sector thesis, and return criteria match your exact parameters.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <Send className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Indicative Term Sheet Tools</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate non-binding indicative agreements directly on platform, exchange data room materials, and communicate securely with investors.
            </p>
          </div>
        </div>

        {/* Submission Checklist */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Verification Requirements to List
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Ministry of Corporate Affairs (MCA) CIN / ROC incorporation check</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Clear problem, solution, and monetization model narrative</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Selected model: Fixed Return (coupon/tenure) or Equity (valuation/stake)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Audited GST returns or certified historical revenue statements</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/register?role=BUSINESS"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
            >
              Start Business Registration &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

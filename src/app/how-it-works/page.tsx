import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sliders,
  Search,
  Scale,
  Send,
  ShieldCheck,
  FileCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | Vestiq Opportunity Research Platform',
  description:
    'Learn how Vestiq connects investors and startups through transparent preference matching, factual verification, and structured due diligence inquiries.',
};

export default function HowItWorksPage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Platform Workflow
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight">
            How Vestiq Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A transparent B2B platform connecting business owners seeking capital with qualified investors across fixed-return and equity funding models.
          </p>
        </div>

        {/* Platform Overview Notice */}
        <div className="mb-16 p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-950 mb-1">End-to-End Investment &amp; Partnership Workflow:</p>
            <p>
              Vestiq connects verified businesses with prospective capital investors. From listing review and indicative term negotiation to due diligence and formal partnership agreements, our platform standardizes disclosures and structures every step cleanly.
            </p>
          </div>
        </div>

        {/* Section 1: For Investors */}
        <div className="mb-20">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-blue-600" />
              The Investor Experience
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Five clear steps to discover opportunities matching your investment focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Create &amp; Configure Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify your criteria: target ticket size (e.g., ₹5L - ₹50L), preferred industries (AI, Agritech, SaaS), business stage, and risk tolerance. No bank details or financial commitments are requested.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Explore &amp; Filter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover businesses with live filters for revenue posture, profitability, geography, and verification status. Each card clearly displays its preference match score.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Compare Factual Metrics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select up to 3 opportunities for side-by-side comparison across 13 dimensions including runway, team size, intended use of funds, and known operational risks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Private Watchlist &amp; Notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bookmark businesses to your private workspace. Record confidential diligence notes that are visible exclusively to your account.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                5
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Direct Diligence Inquiries</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit specific inquiries directly to founders to request supplementary documentation, verify unit economics, or clarify technical roadmaps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-blue-950 mb-2">Ready to Start?</h3>
                <p className="text-xs text-blue-800 leading-relaxed mb-4">
                  Join hundreds of individual allocators and private angel researchers organizing their opportunity pipeline.
                </p>
              </div>
              <Link
                href="/register?role=INVESTOR"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl text-center transition"
              >
                Join as Investor
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: For Businesses */}
        <div className="mb-20">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-600" />
              The Business &amp; Startup Workflow
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How founders submit their companies for review and connect with relevant capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 mb-1 block">Phase 1</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Profile Submission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit your company overview, business model, problem/solution, funding requirement, and traction information.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 mb-1 block">Phase 2</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Admin Due Diligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our compliance team validates company registration and claims. Profiles remain private until approved.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 mb-1 block">Phase 3</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Discovery Publication</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Approved companies are indexed in discovery. Investors whose stated preferences match your profile are matched.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 mb-1 block">Phase 4</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Inquiry Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive diligence questions in your business dashboard and communicate directly with interested researchers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Preference Match Engine Explained */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
              <Sliders className="w-4 h-4" />
              Transparent Calculation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              How the Preference Match Score Is Calculated
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Our matching engine is completely deterministic and rule-based. It does not use blackbox predictions or claim to forecast investment returns. It measures compatibility across 6 specific dimensions:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="font-bold text-blue-400 block mb-1">Industry (25%)</span>
                <span>Matches stated focus sectors</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="font-bold text-blue-400 block mb-1">Ticket Size (20%)</span>
                <span>Aligns with funding requirement</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="font-bold text-blue-400 block mb-1">Stage (15%)</span>
                <span>Seed, Growth, Expansion fit</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="font-bold text-blue-400 block mb-1">Horizon (15%)</span>
                <span>Liquidity timeline compatibility</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="font-bold text-blue-400 block mb-1">Risk Profile (15%)</span>
                <span>Operational stage risk alignment</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="font-bold text-blue-400 block mb-1">Geography (10%)</span>
                <span>Regional and country preference</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>A match score of 80% means 80% preference compatibility—it does not mean an 80% chance of success or profit.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

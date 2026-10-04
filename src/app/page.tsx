import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { OpportunityCard, OpportunityCardData } from '@/components/OpportunityCard';
import { ThesisMatcherWidget } from '@/components/ThesisMatcherWidget';
import {
  Compass,
  Search,
  ShieldCheck,
  Scale,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Percent,
  TrendingUp,
  Coins,
  FileCheck,
  Lock,
  Building2,
  Users2,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const revalidate = 0; // dynamic

async function getFeaturedOpportunities(): Promise<OpportunityCardData[]> {
  try {
    const opps = await db.businessProfile.findMany({
      where: {
        status: 'APPROVED',
        isPublished: true,
      },
      include: {
        riskFlags: { where: { isPublic: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return opps.map((o) => ({
      id: o.id,
      companyName: o.companyName,
      industry: o.industry,
      city: o.city,
      country: o.country,
      businessStage: o.businessStage,
      fundingRequirement: o.fundingRequirement,
      revenueStatus: o.revenueStatus,
      revenueDetails: o.revenueDetails,
      yearsOperating: o.yearsOperating,
      businessDescription: o.businessDescription,
      verificationStatus: o.verificationStatus,
      riskFlags: o.riskFlags,
      investmentModel: o.investmentModel,
      minimumInvestment: o.minimumInvestment,
      proposedReturnRate: o.proposedReturnRate,
      investmentTenureMonths: o.investmentTenureMonths,
      expectedRepaymentAmount: o.expectedRepaymentAmount,
      repaymentFrequency: o.repaymentFrequency,
      collateralDetails: o.collateralDetails,
      valuation: o.valuation,
      equityOffered: o.equityOffered,
      preMoneyValuation: o.preMoneyValuation,
      postMoneyValuation: o.postMoneyValuation,
      investorRights: o.investorRights,
      growthMetrics: o.growthMetrics,
      riskLevel: o.riskLevel,
      agreementStatus: o.agreementStatus,
      matchScore: 85,
      matchSummary: 'Institutional suitability match based on verified operational milestones and capital structure.',
    }));
  } catch (error) {
    console.error('Error fetching featured opportunities:', error);
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedOpportunities();
  const fixedReturnDeals = featured.filter((o) => o.investmentModel === 'FIXED_RETURN');
  const equityDeals = featured.filter((o) => o.investmentModel === 'EQUITY');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 border-b border-slate-200 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Institutional B2B Investment &amp; Partnership Platform • India
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12]">
            Discover Businesses. Invest in Opportunities. Build Partnerships.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Vestiq connects verified businesses seeking capital with investors looking for carefully presented business opportunities across fixed-return funding and direct equity partnerships.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              Explore Opportunities
            </Link>
            <Link
              href="/for-businesses"
              className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-base transition flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Raise Capital
            </Link>
            <Link
              href="/investment-models"
              className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-medium text-sm transition flex items-center gap-1.5"
            >
              Learn Investment Models <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Institutional Highlights Grid */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Two Clear Models</span>
              <span className="text-sm font-bold text-white mt-1 block">Fixed Return &amp; Equity</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">14–18% p.a. or Cap-Table</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Strict Verification</span>
              <span className="text-sm font-bold text-white mt-1 block">ROC &amp; GST Checked</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">No unvetted listings</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Deal Diligence</span>
              <span className="text-sm font-bold text-white mt-1 block">Indicative Term Sheets</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Direct Q&amp;A &amp; Data Rooms</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Deal Execution</span>
              <span className="text-sm font-bold text-white mt-1 block">Direct Agreements</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Structured deal terms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Platform Workflow Pipeline */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              End-to-End Deal Flow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Vestiq Connects Capital &amp; Enterprise
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A transparent milestone pipeline from business listing to verified partnership agreement.
            </p>
          </div>

          {/* Workflow Steps Horizontal Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-blue-300 transition">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">List Requirement</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Founders structure capital needs: Fixed Return (coupon, tenure, collateral) or Equity (valuation, share pool).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-blue-300 transition">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Vestiq Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rigorous ROC incorporation, audited GST returns, and collateral review before public release.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-blue-300 transition">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Discover &amp; Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Investors screen opportunities using thesis matching, side-by-side comparison, and verified metrics.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-blue-300 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Express Interest</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Investors submit intended check size and custom terms. Direct discussions and data room open.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-blue-300 transition">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                5
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Indicative Agreement</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parties draft, review, and execute non-binding indicative term sheets prior to definitive SHA/Debenture closing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Investment Models: Side-by-Side Comparison Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Platform Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Two Structured Investment Models
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Vestiq supports both contractually defined debt-like funding and direct equity partnerships, giving businesses and investors complete flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* OPTION 1: FIXED RETURN / DEBT-LIKE FUNDING */}
            <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-8 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-8 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Option 1: Fixed Return / Debt-Like
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Fixed Return Funding</h3>
                    <p className="text-xs text-slate-500">Contractual Yield with Asset Collateral</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Ideal for businesses with predictable cash flows seeking growth capital without diluting company ownership. Investors receive structured, scheduled returns supported by verified collateral.
                </p>

                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Target Annualized Return (% p.a.)</strong>
                      <span className="text-slate-600">Typically 14% to 18% p.a. defined coupon rate.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Tenure &amp; Repayment Frequency</strong>
                      <span className="text-slate-600">12 to 36 Months tenure with Monthly or Quarterly principal + interest repayments.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Collateral &amp; Security Details</strong>
                      <span className="text-slate-600">First charge on enterprise machinery, PPA escrow receivables, or corporate guarantees.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Agreement &amp; Governance</strong>
                      <span className="text-slate-600">Indicative Debt Term Sheet followed by bilateral Loan Agreement / Non-Convertible Debentures.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 mb-5">
                  <strong>Risk Disclosure:</strong> Returns are contractual targets based on borrower financial performance. Private debt is not a bank deposit and carries business default risk.
                </div>

                <Link
                  href="/explore?model=FIXED_RETURN"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  Explore Fixed Return Opportunities <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* OPTION 2: EQUITY / PARTNERSHIP */}
            <div className="bg-white rounded-3xl border-2 border-indigo-500/30 p-8 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-8 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Option 2: Equity &amp; Partnership
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Equity &amp; Direct Partnership</h3>
                    <p className="text-xs text-slate-500">Ownership Stake &amp; Long-Term Upside</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Designed for high-growth venture companies, tech innovators, and scalable commercial enterprises. Investors acquire equity shares and partner on long-term enterprise value creation.
                </p>

                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Transparent Business Valuation</strong>
                      <span className="text-slate-600">Disclosed Pre-Money and Post-Money valuations in Indian Rupees (₹ Cr).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Equity Pool &amp; Minimum Check</strong>
                      <span className="text-slate-600">Specific percentage offered (e.g. 10%–15%) with fractional ownership calculation per check ticket.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Investor Rights &amp; Covenants</strong>
                      <span className="text-slate-600">Comprehensive information rights, quarterly audited MIS, observer seats, and pro-rata rights.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Growth Trajectory &amp; Use of Funds</strong>
                      <span className="text-slate-600">Audited revenue milestones, gross margin profile, and specific deployment for expansion.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 mb-5">
                  <strong>Risk Disclosure:</strong> Equity investments carry high market and liquidity risk. Future returns depend on company growth and exit opportunities.
                </div>

                <Link
                  href="/explore?model=EQUITY"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  Explore Equity Opportunities <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/investment-models"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Read Full Investment Model Guide &amp; Institutional Calculator &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Live Featured Opportunities Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Verified Deal Pipeline
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Business Opportunities
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Institutional-grade businesses actively accepting indicative expressions of interest in India.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <Link
                href="/explore?model=FIXED_RETURN"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                Fixed Return ({fixedReturnDeals.length})
              </Link>
              <Link
                href="/explore?model=EQUITY"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition"
              >
                Equity ({equityDeals.length})
              </Link>
              <Link
                href="/explore"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                View All &rarr;
              </Link>
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl mx-auto">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">No Active Listings</h4>
              <p className="text-xs text-slate-600 mb-4">
                Be the first verified business owner to list an institutional funding opportunity.
              </p>
              <Link
                href="/register?role=BUSINESS"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
              >
                Raise Capital Now &rarr;
              </Link>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition"
            >
              <Search className="w-4 h-4" />
              Browse All Opportunities with Financial Filters
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Thesis Matcher & Diligence Engine */}
      <ThesisMatcherWidget />

      {/* Verification & Risk Disclosure Trust Section */}
      <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Institutional Diligence Standard</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Vestiq enforces a rigorous multi-stage review before any company is published. We audit ROC registration, verify MCA filings, confirm promoter background, and inspect financial statements.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 1. Ministry of Corporate Affairs (MCA)
                </div>
                <p className="text-xs text-slate-300">
                  CIN, active company status, ROC jurisdiction, and authorized share capital confirmed.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 2. GST &amp; Financial Cross-Checks
                </div>
                <p className="text-xs text-slate-300">
                  GST returns and audited P&amp;L statements inspected to substantiate claimed annual revenues.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 3. Collateral &amp; Charge Review
                </div>
                <p className="text-xs text-slate-300">
                  Fixed return assets verified for encumbrances and first-charge registry on ROC Form CHG-1.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 4. Agreement &amp; Capital Execution
                </div>
                <p className="text-xs text-slate-300">
                  Execute binding contracts, structured disbursements, and transparent profit or equity terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

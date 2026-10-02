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
  Sliders,
  HelpCircle,
  FileText
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
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return opps.map(o => ({
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
      matchScore: 82, // Baseline demo preview score
      matchSummary: "Sample preview compatibility. Log in and configure your preferences for personalized matching.",
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedOpportunities();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            V1 Information &amp; Research Platform • Non-Custodial
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Discover Investment Opportunities That Match Your Goals.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore businesses and startups, compare opportunities, and organize your investment research in one place.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm hover:shadow transition flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              Explore Opportunities
            </Link>
            <Link
              href="/register?role=INVESTOR"
              className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-base hover:bg-slate-50 transition"
            >
              Join as Investor
            </Link>
            <Link
              href="/register?role=BUSINESS"
              className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-slate-500" />
              Submit Your Business
            </Link>
          </div>

          {/* Factual Disclaimer Banner below Hero */}
          <div className="mt-12 max-w-3xl mx-auto p-3.5 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              <strong>Platform Notice:</strong> Vestiq does not handle customer money, execute transactions, or guarantee returns. All research tools and preference match calculations are deterministic and non-advisory.
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Thesis Matcher & Founder Readiness Engine */}
      <ThesisMatcherWidget />

      {/* How It Works Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Process</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How the Platform Works
            </h3>
            <p className="mt-3 text-base text-slate-600">
              A structured workflow designed for transparent information discovery, factual comparison, and direct diligence inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-6">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">State Your Preferences</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Define your target industries, ticket sizes, preferred stages, and risk tolerance. No capital commitment required.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-6">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Discover &amp; Compare</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter approved business profiles with verified metrics, compare up to 3 opportunities side-by-side, and inspect source claims.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-6">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Direct Information Requests</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send structured diligence questions directly to vetted founders to clarify unit economics, patents, and team capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Discovery Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Discovery</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Opportunity Discovery
              </h3>
              <p className="mt-2 text-base text-slate-600">
                Browse businesses with source-reported metrics and transparent preference compatibility indicators.
              </p>
            </div>
            <Link
              href="/explore"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View All Opportunities ({featured.length} active) &rarr;
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Opportunities Queue is Open</h4>
              <p className="text-xs text-slate-600 mb-5 max-w-md mx-auto">
                All demo data has been cleaned. The platform is ready for live business submissions and verified investor diligence inquiries.
              </p>
              <Link
                href="/register?role=BUSINESS"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
              >
                Submit Your Startup Listing &rarr;
              </Link>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition"
            >
              <Search className="w-4 h-4" />
              Explore All Filterable Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Two Columns: For Investors & For Businesses */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Investors */}
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 block">
                  For Capital Allocators
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Streamlined Dealflow &amp; Diligence
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Stop wading through unstructured pitch decks and unverifiable hype. Vestiq standardizes data points, highlights risk factors, and calculates how closely an opportunity aligns with your investment criteria.
                </p>
                <ul className="space-y-3 text-sm text-slate-700 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Transparent rule-based preference compatibility scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Private watchlist with personal notes and annotations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Side-by-side comparison across 13 core business metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Direct structured information inquiries to founders</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/for-investors"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Learn more about investor tools &rarr;
              </Link>
            </div>

            {/* For Businesses */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 block">
                  For Founders &amp; Startups
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Reach Relevant Investors Without the Noise
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Present your company with credibility. Submit verified documents, outline your funding requirement, and get discovered by allocators whose ticket sizes and risk profiles naturally match your stage.
                </p>
                <ul className="space-y-3 text-sm text-slate-700 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <span>Structured profile submission with source-audited metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <span>Admin verification badge to establish market trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <span>Receive organized diligence inquiries from qualified allocators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <span>No public discovery until formal verification review</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/for-businesses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-slate-900"
              >
                Learn how founders get listed &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Information & Risk Awareness Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 block">
              Integrity &amp; Standards
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Transparent Information, Zero Financial Hype
            </h3>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              We reject high-pressure sales tactics and exaggerated returns. Our mandate is objective discovery and rigorous organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <Sliders className="w-6 h-6 text-blue-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Deterministic Match Score</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our match percentage is purely an index of alignment with your saved criteria. It is never an artificial rating of company quality or prediction of future returns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <FileText className="w-6 h-6 text-emerald-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Source-Claim Labeling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every financial claim is labeled with its source: whether self-reported by the founder, verified via banking exports, or supported by audited financials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <AlertTriangle className="w-6 h-6 text-amber-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Explicit Risk Highlighting</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Admins identify and highlight known risks—such as early regulatory exposure, technology execution risk, or supply-chain concentration—directly on profile cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Preview */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">FAQ</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Does Vestiq handle payments or execute investments?
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                No. Vestiq V1 is strictly an informational discovery, research, and opportunity-management platform. We do not hold client funds, manage wallets, execute transactions, or act as an intermediary or broker-dealer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 mb-2">
                What does the "Preference Match" percentage mean?
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The match score represents mathematical compatibility with the investment preferences you specified (industry, ticket size, stage, geography, horizon, and risk tolerance). It is <strong>NOT</strong> an indicator of potential profit or company quality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 mb-2">
                How are businesses verified before appearing publicly?
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every business submission undergoes administrative review. Incorporations, basic operational standing, and submitted pitch materials are inspected before public discovery is granted. Unverified claims remain labeled as self-reported.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Read full FAQ &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Start Your Investment Research With Clarity.
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
            Discover opportunities aligned with your criteria and streamline your diligence process.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm transition"
            >
              Explore Opportunities
            </Link>
            <Link
              href="/register?role=INVESTOR"
              className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-base transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Risk Disclosure & Non-Brokerage Notice | Vestiq',
  description:
    'Important regulatory and risk disclosure statement regarding private investment discovery, non-custodial software, and preference match scores.',
};

export default function RiskDisclosurePage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Mandatory Legal &amp; Regulatory Notice
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Risk Disclosure Statement &amp; Operating Boundaries
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Last Updated: September 2026 • Platform Version 1.0 (MVP)
          </p>
        </div>

        {/* Primary Callout Box */}
        <div className="p-6 bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl mb-10 text-amber-950 text-sm leading-relaxed">
          <p className="font-bold text-base mb-2">
            "Investment opportunities involve risk. Information provided on this platform is for discovery and research purposes and is not a guarantee of returns or financial advice."
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            Vestiq Platforms Inc. ("Vestiq") operates strictly as an informational software directory, research compilation platform, and opportunity-matching tool. Vestiq is NOT an investment advisor, broker-dealer, funding portal, payment processor, or regulated custodian.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Non-Custodial Architecture &amp; Zero Transaction Execution</h2>
            <p>
              Under no circumstances does Vestiq accept, solicit, hold, escrow, clear, or transmit investor funds. Vestiq provides software tools for capital allocators to review company profiles, compare factual metrics, and submit information requests directly to businesses. Any discussions, negotiations, legal documentation, or monetary investments resulting from information discovered on Vestiq take place completely outside of this platform and under the parties' independent counsel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Inherent Risks of Early-Stage and Private Business Investments</h2>
            <p>
              Investing in unlisted private enterprises, early-stage startups, and emerging businesses carries exceptionally high commercial, operational, and financial risk:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-xs text-slate-600">
              <li><strong>Risk of Total Capital Loss:</strong> A substantial percentage of early-stage businesses fail to achieve profitability and cease operations. Investors may lose 100% of invested capital.</li>
              <li><strong>Severe Illiquidity:</strong> Private company shares, notes, or debentures are not traded on public stock exchanges. There is generally no secondary marketplace to liquidate your position.</li>
              <li><strong>Uncertain Valuation:</strong> Unlike public securities with continuous market pricing, private venture valuations are highly subjective and determined via bilateral negotiations.</li>
              <li><strong>Future Dilution:</strong> Subsequent financing rounds, convertible instruments, or employee stock options may significantly dilute initial ownership percentages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Nature of the "Preference Match" Score</h2>
            <p>
              The "Preference Match" percentage displayed across cards and profiles is a <strong>deterministic mathematical comparison</strong> reflecting how closely a business opportunity's submitted attributes align with an investor's stated profile parameters (e.g., sector preference, ticket size, stage, geography, investment horizon, and risk tolerance).
            </p>
            <div className="p-4 bg-slate-100 rounded-xl my-3 text-xs">
              <strong>The Preference Match score DOES NOT indicate:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                <li>A probability of business success or commercial viability</li>
                <li>A prediction or expectation of financial return or profit</li>
                <li>An endorsement or recommendation by Vestiq Platforms</li>
                <li>A guarantee against operational failure or bankruptcy</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Self-Reported Information &amp; Verification Limits</h2>
            <p>
              While Vestiq administrators conduct review of submitted company registry and basic operational documents, financial representations and forward-looking projections are provided by the respective business founders. A status badge of "Information Verified" indicates only that specified documentation was submitted and inspected against public registries; it does NOT constitute an audit, valuation certification, or financial solvency guarantee.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Mandatory Independent Professional Due Diligence</h2>
            <p>
              Investors must not rely on the information provided on Vestiq as the sole basis for any financial decision. You are strongly advised to consult with certified legal, tax, accounting, and registered financial professionals to evaluate any prospective private investment opportunity independently.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

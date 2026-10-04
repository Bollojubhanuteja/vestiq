import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Compass, Users, Scale, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'About Vestiq | Venture Research & Opportunity Discovery',
  description:
    'Our mission to bring transparency, structured data, and objective preference matching to private venture opportunities.',
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Our Purpose &amp; Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Building Transparency Into Private Venture Discovery.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We believe private business research should be as organized, disciplined, and objective as public equities research.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">The Problem in Private Capital</h2>
          <p>
            Historically, finding early-stage and growth investment opportunities has been an opaque, word-of-mouth process. Capital allocators are bombarded with unstandardized pitch decks, exaggerated claims of profitability, and artificial urgency. Meanwhile, credible founders waste hundreds of hours chasing investors whose ticket sizes and sector mandates don’t align with their round.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Our Platform Philosophy: Transparency &amp; Structured Diligence</h2>
          <p>
            Vestiq bridges the gap between businesses raising capital and investors seeking verified opportunities. By providing standardized metrics, structured fixed-return and equity models, and formal diligence workflows, we make business partnerships efficient, legally compliant, and transparent.
          </p>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 my-8">
            <h3 className="text-base font-bold text-slate-900 mb-2">Our Operating Core Principles:</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• <strong>No Artificial Predictions:</strong> We never generate fake AI return predictions or promise investment success.</li>
              <li>• <strong>Transparent Scoring:</strong> Our preference match score explains every point earned and missed.</li>
              <li>• <strong>Source-Verified Claims:</strong> Self-reported numbers are clearly separated from audited records.</li>
              <li>• <strong>Independent Diligence:</strong> We encourage investors to conduct independent legal and financial review before committing capital outside the platform.</li>
            </ul>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Ready for Future Regulatory Evolution</h2>
          <p>
            As Vestiq grows, we are laying the technical and operational groundwork to support jurisdictional compliance standards, professional legal due diligence modules, and accredited investor verification frameworks.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Platform Version: 1.0 (MVP)</span>
          <Link href="/explore" className="text-blue-600 font-semibold hover:underline">
            Explore Opportunities &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

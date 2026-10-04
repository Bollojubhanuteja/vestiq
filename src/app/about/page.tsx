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

        {/* Founding Leadership Section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              Leadership &amp; Founding Team
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Meet the Visionaries Behind Vestiq
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
              Driven by a shared mission to institutionalize private venture investment and growth debt for Indian businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Founder Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="w-1.5 h-full bg-blue-600 absolute left-0 top-0" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  BT
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Founder
                  </span>
                  <h3 className="text-lg font-bold text-slate-950">BOLLOJU BHANU TEJA</h3>
                  <p className="text-xs text-slate-500 font-medium">Founder &amp; Platform Architect</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leading platform architecture, legal engineering, and the core vision of connecting verified Indian MSMEs and startups with strategic capital partners through transparent due diligence and digital execution.
              </p>
            </div>

            {/* Co-Founder Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="w-1.5 h-full bg-emerald-600 absolute left-0 top-0" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  BH
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Co-Founder
                  </span>
                  <h3 className="text-lg font-bold text-slate-950">BHAVANA</h3>
                  <p className="text-xs text-slate-500 font-medium">Co-Founder &amp; Strategic Operations</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spearheading founder ecosystems, investor onboarding workflows, business verification operations, and strategic growth initiatives across key Indian enterprise sectors.
              </p>
            </div>
          </div>
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

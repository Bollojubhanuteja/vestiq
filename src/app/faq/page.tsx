import React from 'react';
import Link from 'next/link';
import { HelpCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions | Vestiq',
  description:
    'Common questions about Vestiq’s discovery platform, preference matching engine, verification process, and legal status.',
};

export default function FaqPage() {
  const faqs = [
    {
      q: 'How does Vestiq facilitate investment and partnership agreements?',
      a: 'Vestiq provides a structured workflow where investors explore verified business listings, submit indicative interest, review terms, and negotiate agreements. Funding, profit-sharing distributions, and equity transfers are coordinated in accordance with verified contracts and regulatory requirements.',
    },
    {
      q: 'What exactly is the "Preference Match" score?',
      a: 'The Preference Match score is a transparent, deterministic mathematical calculation measuring how closely an opportunity aligns with your stated investment parameters (target industry, ticket size, stage, geography, horizon, and risk preference). It is NOT an indicator of company viability, success probability, or guaranteed investment return.',
    },
    {
      q: 'Is Vestiq a registered investment adviser or broker-dealer?',
      a: 'No. Vestiq does not provide personalized investment advice, financial planning, underwriting, or broker-dealer intermediary services. All content on the platform is for discovery and research purposes.',
    },
    {
      q: 'How are startup opportunities verified?',
      a: 'Every opportunity submitted undergoes an administrative inspection. We examine incorporation documentation, corporate registries, and submitted pitch materials. Financial figures are tagged with their provenance (e.g., self-reported vs. platform-verified bank statements).',
    },
    {
      q: 'Is my research and watchlist data private?',
      a: 'Yes. Strict role-based access controls ensure that your profile, preferences, private watchlist, and diligence notes cannot be accessed by other investors or businesses.',
    },
    {
      q: 'How does an investor request additional information from a founder?',
      a: 'On each verified opportunity profile, registered investors can click "Request Information" to submit structured due diligence inquiries. Founders receive these in their dashboard and can respond directly.',
    },
    {
      q: 'How can a founder submit their startup for discovery?',
      a: 'Founders can register for a Business Account, complete their opportunity profile, upload supporting pitch materials, and submit for administrative review. Profiles remain completely private until formal approval.',
    },
    {
      q: 'Does Vestiq charge any transaction fees?',
      a: 'Because Vestiq does not execute or broker transactions, there are zero investment transaction or commission fees.',
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Questions &amp; Clarifications
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Clear, transparent answers about our platform model, verification standards, and research features.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
            >
              <h2 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h2>
              <p className="text-sm text-slate-600 pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-blue-50/70 border border-blue-200 rounded-3xl text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Have additional questions?</h3>
          <p className="text-xs text-slate-600 mb-6 max-w-md mx-auto">
            Our support and compliance team is available to assist investors and founders.
          </p>
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Contact Team &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

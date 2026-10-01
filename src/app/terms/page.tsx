import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Vestiq Opportunity Research Platform',
  description: 'Terms and conditions governing the use of the Vestiq discovery and research software platform.',
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 mb-8">Effective Date: September 2026 • Platform Version 1.0 (MVP)</p>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Vestiq platform ("Platform", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree, you must immediately discontinue use of the platform.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. Description of Service &amp; Non-Intermediary Status</h2>
          <p>
            Vestiq provides an online software platform for discovering, organizing, comparing, and managing research on private businesses and investment opportunities. Vestiq is NOT a broker-dealer, funding portal, registered investment adviser, payment processor, or depository institution. V1 does not handle customer money, process investment payments, or execute investments.
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. User Accounts and Role-Based Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
            <li><strong>Investor Users:</strong> You agree that any preferences you state are for software matching and organizational convenience only. You are solely responsible for conducting independent due diligence before considering any financial transaction outside the platform.</li>
            <li><strong>Business Users:</strong> You represent that all company information, revenue figures, and documents you submit are truthful, accurate, and not misleading. Submitting fraudulent claims is strictly prohibited and subject to immediate account termination.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900">4. Prohibited Activities</h2>
          <p>
            Users shall not: (a) attempt to execute securities purchases or solicit public retail investments through the platform; (b) scrape, extract, or redistribute confidential documents; (c) attempt unauthorized access to another user's private watchlist, preferences, or admin controls; (d) misrepresent verification badges or match scores as financial guarantees.
          </p>

          <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability &amp; Disclaimer of Warranties</h2>
          <p>
            The platform is provided on an "AS IS" and "AS AVAILABLE" basis. Vestiq disclaims all warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, and non-infringement. In no event shall Vestiq be liable for any direct, indirect, incidental, or consequential damages resulting from investment decisions made outside the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

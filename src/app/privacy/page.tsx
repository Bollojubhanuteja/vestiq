import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Vestiq Opportunity Research Platform',
  description: 'How Vestiq handles, isolates, and protects investor preferences, confidential startup documents, and user data.',
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mb-8">Effective Date: September 2026 • Platform Version 1.0 (MVP)</p>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Commitment:</strong> We never sell personal data or monetize private investor diligence notes. We do not ask for or store sensitive banking credentials or payment card numbers.
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
            <li><strong>Account Credentials:</strong> Full name, verified email address, phone number (optional), and one-way hashed passwords (bcrypt). Passwords are never stored in plaintext.</li>
            <li><strong>Investor Preferences:</strong> Investment range, target sectors, preferred geographies, investment horizons, and risk tolerance levels.</li>
            <li><strong>Confidential Diligence Notes:</strong> Private annotations you attach to saved opportunities. These notes are encrypted at rest and accessible exclusively by your authenticated session.</li>
            <li><strong>Business Profiles:</strong> Company details, revenue posture, problem/solution descriptions, and supporting documents submitted by authorized company representatives.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900">2. Strict Role-Based Data Isolation</h2>
          <p>
            Vestiq implements strict server-side authorization controls:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>An investor cannot view or modify another investor's private watchlist, preference parameters, or inquiries.</li>
            <li>A business user cannot access or modify another business user's profile or proprietary documents.</li>
            <li>Unpublished business drafts remain private and inaccessible to public discovery until approved by an administrator.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900">3. Information Requests Transmission</h2>
          <p>
            When an investor chooses to click "Request Information", the subject, message, and investor contact details are securely transmitted to the target business profile's founder.
          </p>

          <h2 className="text-lg font-bold text-slate-900">4. Data Security</h2>
          <p>
            We implement industry-standard cryptographic techniques, including HTTPS/TLS encryption in transit, HTTP-only secure cookie sessions, parameterized SQL queries, and administrative audit logging for all record changes.
          </p>
        </div>
      </div>
    </div>
  );
}

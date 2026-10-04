import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                V
              </div>
              <span className="text-xl font-bold tracking-tight text-white">VESTIQ</span>
            </Link>
            <p className="text-slate-400 leading-relaxed pr-6">
              Vestiq is a premium B2B business investment and partnership platform connecting verified businesses with potential investors. Discover opportunities, negotiate structured terms, and build strategic business partnerships.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Deterministic Rule-Based Matching • Source-Audited Metrics</span>
            </div>
            <div className="pt-3 flex flex-col gap-1.5 text-xs border-t border-slate-800/80 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Founder:</span>
                <span className="text-blue-400 font-semibold tracking-wide">BOLLOJU BHANU TEJA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Co-Founder:</span>
                <span className="text-emerald-400 font-semibold tracking-wide">BHAVANA</span>
              </div>
            </div>
          </div>

          {/* Column: Platform */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/explore" className="hover:text-white transition">
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/for-investors" className="hover:text-white transition">
                  For Investors
                </Link>
              </li>
              <li>
                <Link href="/for-businesses" className="hover:text-white transition">
                  For Businesses
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Company & Research */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Vestiq
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact &amp; Diligence Help
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="hover:text-white transition">
                  Risk Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Compliance & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Legal &amp; Policy</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="text-amber-400 hover:text-amber-300 transition">
                  Risk &amp; Non-Brokerage Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Regulatory / Investment Position Notice */}
        <div className="py-8 border-b border-slate-800 text-xs text-slate-500 space-y-3">
          <div className="flex items-start gap-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <p className="font-semibold text-slate-300">
                Important Investment &amp; Regulatory Notice:
              </p>
              <p>
                Vestiq connects verified businesses seeking capital with qualified investors and strategic partners across structured fixed-return and equity models. All investment terms, distributions, and agreements are executed in accordance with applicable statutory standards and mutual contracts between participating parties.
              </p>
              <p>
                All company information and financial metrics displayed on Vestiq are provided by respective business submitters and verified via platform due diligence. Business investments carry commercial risks, and financial returns vary based on operating performance. Investors and business owners are advised to conduct independent review of agreements and risk disclosures prior to execution.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Vestiq Platforms. Founded by <strong className="text-slate-300 font-medium">BOLLOJU BHANU TEJA</strong> &amp; Co-Founded by <strong className="text-slate-300 font-medium">BHAVANA</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link href="/risk-disclosure" className="hover:text-slate-400">Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

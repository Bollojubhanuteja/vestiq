import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function DisclaimerBanner() {
  return (
    <aside aria-label="Risk Disclosure Banner" className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-snug">
            <span className="font-semibold text-slate-200">Legal Notice: </span>
            Investment opportunities involve risk. Information provided on this platform is for discovery and research purposes and is not a guarantee of returns or financial advice. V1 does not handle funds, execute transactions, or act as an intermediary.
          </p>
        </div>
        <Link
          href="/risk-disclosure"
          className="text-blue-400 hover:text-blue-300 underline font-medium shrink-0 ml-2 whitespace-nowrap"
        >
          Read Risk Disclosure &rarr;
        </Link>
      </div>
    </aside>
  );
}

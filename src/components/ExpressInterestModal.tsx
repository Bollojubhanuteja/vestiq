'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Percent,
  Clock,
  Banknote,
  FileText
} from 'lucide-react';

interface ExpressInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string;
    companyName: string;
    investmentModel?: string;
    fundingRequirement: number;
    minimumInvestment?: number;
    proposedReturnRate?: number | null;
    investmentTenureMonths?: number | null;
    repaymentFrequency?: string | null;
    expectedRepaymentAmount?: number | null;
    valuation?: number | null;
    equityOffered?: number | null;
    riskLevel?: string;
    collateralDetails?: string | null;
  };
  onSuccess?: () => void;
}

export function ExpressInterestModal({
  isOpen,
  onClose,
  opportunity,
  onSuccess,
}: ExpressInterestModalProps) {
  const isFixedReturn = opportunity.investmentModel === 'FIXED_RETURN';
  const minTicket = opportunity.minimumInvestment || 200000;

  const [intendedAmount, setIntendedAmount] = useState<number>(minTicket);
  const [customTerms, setCustomTerms] = useState<string>(
    isFixedReturn
      ? `${opportunity.proposedReturnRate || 16}% p.a. Fixed Coupon`
      : `${opportunity.equityOffered || 10}% Equity Allocation`
  );
  const [notes, setNotes] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (intendedAmount < minTicket) {
      setError(`Minimum investment check for this opportunity is ₹${minTicket.toLocaleString('en-IN')}`);
      return;
    }

    if (!termsAccepted) {
      setError('Please review and check the indicative terms and risk disclosure acknowledgment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/investor/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessProfileId: opportunity.id,
          intendedAmount: Number(intendedAmount),
          investmentModel: opportunity.investmentModel || 'EQUITY',
          ownershipOrReturnProposed: customTerms,
          notes,
          termsAccepted: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit expression of interest');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isFixedReturn
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isFixedReturn ? 'Option 1: Fixed Return / Debt Funding' : 'Option 2: Equity & Partnership'}
            </span>
            <span className="text-xs text-slate-400">• Institutional Diligence</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight">{opportunity.companyName}</h3>
          <p className="text-xs text-slate-300 mt-1">
            Submit a non-binding indicative expression of interest to review diligence documents and discuss terms directly with founders.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Interest Formally Registered</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your expression of interest for <strong className="text-slate-900">{opportunity.companyName}</strong> at ₹{intendedAmount.toLocaleString('en-IN')} has been delivered to the founding team.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Next Diligence Milestones:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Founder reviews your investor profile and accreditation details.</li>
                <li>Direct Q&A and confidential virtual data room access.</li>
                <li>Mutual execution of non-binding indicative term sheet before final closing.</li>
              </ul>
            </div>

            <div className="pt-4 flex gap-3 justify-center">
              <a
                href="/dashboard/investor/requests"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
              >
                Track in Diligence Dashboard
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Opportunity Snapshot */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-500 block">Total Requirement</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{opportunity.fundingRequirement.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Minimum Check</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{minTicket.toLocaleString('en-IN')}
                </span>
              </div>

              {isFixedReturn ? (
                <>
                  <div>
                    <span className="text-slate-500 block">Proposed Annual Return</span>
                    <span className="font-bold text-emerald-700">
                      {opportunity.proposedReturnRate || 16}% p.a.
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tenure & Repayment</span>
                    <span className="font-semibold text-slate-800">
                      {opportunity.investmentTenureMonths || 24} Mo ({opportunity.repaymentFrequency || 'Monthly'})
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-slate-500 block">Pre-Money Valuation</span>
                    <span className="font-bold text-slate-900">
                      ₹{((opportunity.valuation || 100000000) / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Offered Equity Pool</span>
                    <span className="font-bold text-indigo-700">
                      {opportunity.equityOffered || 10}%
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Intended Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Intended Investment Amount (INR ₹)</span>
                <span className="text-slate-500 font-normal">Min: ₹{minTicket.toLocaleString('en-IN')}</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                <input
                  type="number"
                  min={minTicket}
                  step={50000}
                  value={intendedAmount}
                  onChange={(e) => setIntendedAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[minTicket, minTicket * 2, minTicket * 5].map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIntendedAmount(amt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    ₹{(amt / 100000).toFixed(amt % 100000 === 0 ? 0 : 1)} Lakhs
                  </button>
                ))}
              </div>
            </div>

            {/* Proposed Structure / Terms */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Target Return or Equity Terms
              </label>
              <input
                type="text"
                value={customTerms}
                onChange={(e) => setCustomTerms(e.target.value)}
                placeholder={isFixedReturn ? 'e.g. 16.0% p.a. monthly coupon' : 'e.g. 5.0% Direct Equity'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900"
                required
              />
            </div>

            {/* Private Diligence Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Preliminary Diligence Inquiries / Note to Founders (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify your investment timeline, syndicate details, or initial questions regarding unit economics, cap table, or security charges..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900"
              />
            </div>

            {/* Regulatory and Risk Disclosures */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Risk &amp; Agreement Terms:</strong> Investments in private businesses carry commercial and liquidity risks. Proposed returns or equity percentages are structured through formal agreements. Ensure you review all term sheets and legal covenants before final execution.
                </p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-[11px] text-slate-700 font-medium select-none">
                  I confirm that I am an informed investor expressing non-binding interest for bilateral diligence and acknowledge that all final investments require definitive legal contracts.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !termsAccepted}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
              >
                {submitting ? 'Submitting Interest...' : 'Submit Expression of Interest'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

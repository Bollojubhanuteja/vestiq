'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Percent,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Building2,
  Coins,
  Scale,
  Calendar,
  Layers,
  FileCheck,
  HelpCircle
} from 'lucide-react';

export default function InvestmentModelsPage() {
  const [activeTab, setActiveTab] = useState<'FIXED' | 'EQUITY'>('FIXED');

  // Calculator State for Fixed Return
  const [fixedAmount, setFixedAmount] = useState<number>(500000); // 5 Lakhs
  const [fixedRate, setFixedRate] = useState<number>(16.0); // 16% p.a.
  const [fixedTenure, setFixedTenure] = useState<number>(24); // 24 Months
  const [repayFreq, setRepayFreq] = useState<'MONTHLY' | 'QUARTERLY'>('MONTHLY');

  // Calculator State for Equity
  const [equityCheck, setEquityCheck] = useState<number>(1000000); // 10 Lakhs
  const [valuationCr, setValuationCr] = useState<number>(10.0); // 10 Cr Pre-money
  const [projectedExitMultiple, setProjectedExitMultiple] = useState<number>(3.0); // 3x

  // Calculations for Fixed Return
  const annualInterest = (fixedAmount * fixedRate) / 100;
  const totalInterest = (annualInterest / 12) * fixedTenure;
  const totalRepayment = fixedAmount + totalInterest;
  const numPayments = repayFreq === 'MONTHLY' ? fixedTenure : fixedTenure / 3;
  const periodicPayment = totalRepayment / numPayments;

  // Calculations for Equity
  const preMoneyValuation = valuationCr * 10000000;
  const postMoneyValuation = preMoneyValuation + equityCheck;
  const ownershipPercentage = (equityCheck / postMoneyValuation) * 100;
  const projectedExitValue = equityCheck * projectedExitMultiple;

  // Helper formatting INR
  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 2)} L`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-700">
            Platform Investment Framework
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Understanding Vestiq Investment Models
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Discover the two core investment structures supported by Vestiq. Choose between predictable yield with asset collateral or venture upside via equity ownership.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab('FIXED')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'FIXED'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Percent className="w-4 h-4" /> Option 1: Fixed Return / Debt
            </button>
            <button
              onClick={() => setActiveTab('EQUITY')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'EQUITY'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Option 2: Equity &amp; Partnership
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Side-by-Side Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* OPTION 1 CARD */}
          <div
            className={`rounded-3xl p-8 bg-white border-2 transition ${
              activeTab === 'FIXED'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                : 'border-slate-200 opacity-90'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Option 1</span>
                <h2 className="text-2xl font-bold text-slate-900">Fixed Return Funding</h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              In the Fixed Return model, businesses raise structured growth capital in exchange for contractually scheduled repayments with an agreed annual interest coupon. Founders retain 100% equity ownership, while investors gain high-yield debt exposure secured by underlying assets.
            </p>

            <div className="space-y-4 text-xs">
              <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">Key Financial Terms:</span>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                  <li><strong>Target Yield:</strong> 14% to 18% per annum (p.a.) fixed interest rate.</li>
                  <li><strong>Tenure:</strong> 12, 24, or 36 months defined duration.</li>
                  <li><strong>Repayment Frequency:</strong> Monthly or Quarterly amortized schedules.</li>
                  <li><strong>Total Payout:</strong> Guaranteed principal + pre-calculated coupon yield.</li>
                </ul>
              </div>

              <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">Security &amp; Collateral:</span>
                <p className="text-slate-600">
                  Fixed return facilities require hypothecation of revenue-generating machinery, customer PPA escrow accounts, ROC charge registration (Form CHG-1), or personal promoter guarantees.
                </p>
              </div>

              <div className="border border-amber-200/80 p-3.5 rounded-xl bg-amber-50 text-amber-900">
                <span className="font-bold block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Risk Disclosure:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Returns depend on the operational solvency of the borrower. Private debt instruments are not bank deposits and are not guaranteed by the platform or government insurance.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/explore?model=FIXED_RETURN"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                Browse Fixed Return Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* OPTION 2 CARD */}
          <div
            className={`rounded-3xl p-8 bg-white border-2 transition ${
              activeTab === 'EQUITY'
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-slate-200 opacity-90'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Option 2</span>
                <h2 className="text-2xl font-bold text-slate-900">Equity &amp; Partnership</h2>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              In the Equity &amp; Direct Partnership model, investors purchase an ownership stake in the enterprise. Founders receive non-repayable permanent capital to fund product R&amp;D, market penetration, or scale-up operations, aligning long-term upside with strategic partners.
            </p>

            <div className="space-y-4 text-xs">
              <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">Key Financial Terms:</span>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                  <li><strong>Valuation:</strong> Explicit Pre-Money and Post-Money valuations in Indian Rupees (₹ Cr).</li>
                  <li><strong>Equity Offered:</strong> Typically 8% to 15% aggregate stake pool.</li>
                  <li><strong>Check Size:</strong> Minimum institutional ticket starting from ₹5L to ₹25L.</li>
                  <li><strong>Pro-Rata Ownership:</strong> Mathematically calculated ownership per check ticket.</li>
                </ul>
              </div>

              <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">Investor Rights &amp; Governance:</span>
                <p className="text-slate-600">
                  Comprehensive Shareholders Agreement (SHA) terms including quarterly audited financial statements, board observer privileges, tag-along rights, and anti-dilution provisions.
                </p>
              </div>

              <div className="border border-amber-200/80 p-3.5 rounded-xl bg-amber-50 text-amber-900">
                <span className="font-bold block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Risk Disclosure:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Early-stage and private equity investments carry substantial business failure and market liquidity risk. Shares cannot be redeemed on demand and require future secondary rounds, buybacks, or trade acquisitions for exit.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/explore?model=EQUITY"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                Browse Equity Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Model Calculator Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Interactive Model Projections &amp; Yield Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate your financial returns under both models with authentic institutional parameters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FIXED RETURN CALCULATOR */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" /> Fixed Return Simulation
                </span>
                <span className="text-xs font-bold text-emerald-700">{fixedRate}% p.a.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Investment Principal: {formatINR(fixedAmount)}
                </label>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Annual Coupon</label>
                  <select
                    value={fixedRate}
                    onChange={(e) => setFixedRate(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={14.0}>14.0% p.a.</option>
                    <option value={15.0}>15.0% p.a.</option>
                    <option value={16.0}>16.0% p.a.</option>
                    <option value={17.5}>17.5% p.a.</option>
                    <option value={18.0}>18.0% p.a.</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tenure</label>
                  <select
                    value={fixedTenure}
                    onChange={(e) => setFixedTenure(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={12}>12 Months (1 yr)</option>
                    <option value={24}>24 Months (2 yrs)</option>
                    <option value={36}>36 Months (3 yrs)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest Earned:</span>
                  <span className="font-bold text-emerald-800">{formatINR(totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Capital Repaid:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatINR(totalRepayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Cash Inflow:</span>
                  <span className="font-semibold text-emerald-700">{formatINR(periodicPayment)} / mo</span>
                </div>
              </div>
            </div>

            {/* EQUITY CALCULATOR */}
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Equity Ownership Simulation
                </span>
                <span className="text-xs font-bold text-indigo-700">{ownershipPercentage.toFixed(2)}% Stake</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Check Size: {formatINR(equityCheck)}
                </label>
                <input
                  type="range"
                  min={200000}
                  max={5000000}
                  step={100000}
                  value={equityCheck}
                  onChange={(e) => setEquityCheck(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pre-Money Valuation</label>
                  <select
                    value={valuationCr}
                    onChange={(e) => setValuationCr(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={5.0}>₹5.0 Cr</option>
                    <option value={8.0}>₹8.0 Cr</option>
                    <option value={10.0}>₹10.0 Cr</option>
                    <option value={15.0}>₹15.0 Cr</option>
                    <option value={20.0}>₹20.0 Cr</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Projected Exit Multiple</label>
                  <select
                    value={projectedExitMultiple}
                    onChange={(e) => setProjectedExitMultiple(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={2.0}>2x Upside</option>
                    <option value={3.0}>3x Upside</option>
                    <option value={5.0}>5x Upside</option>
                    <option value={10.0}>10x Scale</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-200/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Post-Money Valuation:</span>
                  <span className="font-bold text-slate-900">{formatINR(postMoneyValuation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ownership Allocation:</span>
                  <span className="font-bold text-indigo-800 text-sm">{ownershipPercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Simulated Exit Value ({projectedExitMultiple}x):</span>
                  <span className="font-bold text-indigo-700 text-sm">{formatINR(projectedExitValue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 overflow-x-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Direct Feature Matrix Comparison</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Feature Dimension</th>
                <th className="py-3 px-4 text-emerald-700">Fixed Return Funding (Debt-Like)</th>
                <th className="py-3 px-4 text-indigo-700">Equity &amp; Partnership</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Capital Return Structure</td>
                <td className="py-3.5 px-4">Pre-defined annual coupon (14%–18% p.a.)</td>
                <td className="py-3.5 px-4">Ownership share with capital appreciation</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Dilution for Business Owner</td>
                <td className="py-3.5 px-4 text-emerald-700 font-bold">0% Dilution (Non-dilutive)</td>
                <td className="py-3.5 px-4">8% to 15% equity pool dilution</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Repayment Obligation</td>
                <td className="py-3.5 px-4">Strict monthly or quarterly debt service</td>
                <td className="py-3.5 px-4">No debt service; patient venture capital</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Collateral Backing</td>
                <td className="py-3.5 px-4">Secured by machinery, receivables, or charge</td>
                <td className="py-3.5 px-4">Unsecured equity shares in company</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Typical Check Size</td>
                <td className="py-3.5 px-4">₹2 Lakhs to ₹10 Lakhs ticket</td>
                <td className="py-3.5 px-4">₹5 Lakhs to ₹50 Lakhs ticket</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Agreement Format</td>
                <td className="py-3.5 px-4">Indicative Term Sheet &rarr; Loan / Debenture Deed</td>
                <td className="py-3.5 px-4">Indicative Term Sheet &rarr; Shareholders Agreement (SHA)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

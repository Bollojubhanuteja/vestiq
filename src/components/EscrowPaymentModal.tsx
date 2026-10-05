'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  QrCode,
  Smartphone,
  CreditCard,
  Building,
  RefreshCw,
  X,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { formatINR } from '@/lib/legal-templates';

interface EscrowPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: any;
  currentUserId: string;
  currentUserRole: 'INVESTOR' | 'BUSINESS' | 'ADMIN';
  onAgreementUpdated: () => void;
}

export function EscrowPaymentModal({
  isOpen,
  onClose,
  agreement,
  currentUserId,
  currentUserRole,
  onAgreementUpdated,
}: EscrowPaymentModalProps) {
  if (!isOpen || !agreement) return null;

  const isInvestor = agreement.investorUserId === currentUserId || currentUserRole === 'INVESTOR';
  const isFounder = agreement.businessProfile?.userId === currentUserId || currentUserRole === 'BUSINESS';
  const isAdmin = currentUserRole === 'ADMIN';

  const amount = agreement.escrowAmount || agreement.principalOrAmount || 0;
  const isHeldInEscrow = agreement.escrowStatus === 'HELD_IN_ESCROW';
  const isReleased = agreement.escrowStatus === 'RELEASED';
  const isDeedExecuted = agreement.status === 'EXECUTED';

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING' | 'NEFT_RTGS'>('UPI');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [upiVpa, setUpiVpa] = useState('investor@okhdfcbank');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const virtualAccountNum = agreement.escrowVirtualAccount || `VSTESCROW${agreement.id.slice(-6).toUpperCase()}`;

  const handleDepositEscrow = async () => {
    setProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId: agreement.id,
          action: 'ESCROW_DEPOSIT',
          amount,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAgreementUpdated();
      } else {
        setErrorMsg(data.error || 'Failed to deposit to escrow');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReleaseEscrow = async () => {
    setProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId: agreement.id,
          action: 'ESCROW_RELEASE',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAgreementUpdated();
      } else {
        setErrorMsg(data.error || 'Failed to disburse escrow funds');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Vestiq Trustee Escrow Gateway</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  RBI Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Neutral FBO Escrow Account • ICICI Bank Trustee Services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Target Deal Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Target Business Opportunity
              </span>
              <h4 className="text-base font-bold text-slate-950">
                {agreement.businessProfile?.companyName}
              </h4>
              <p className="text-xs text-slate-500">
                Model: {agreement.agreementType === 'FIXED_RETURN_DEBT' ? 'Fixed-Return Growth Debt' : 'Equity Partnership'}
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Committed Settlement Capital
              </span>
              <div className="text-2xl font-extrabold text-slate-950">
                {formatINR(amount)}
              </div>
            </div>
          </div>

          {/* Escrow State Machine Stepper */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-3">
              Escrow Settlement Pipeline Status
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              
              {/* Step 1 */}
              <div className={`p-3 rounded-xl border ${isHeldInEscrow || isReleased ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-blue-200 text-blue-800 font-semibold'}`}>
                <div className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold text-[10px] bg-current text-white">
                  1
                </div>
                <div className="font-bold text-[11px]">Investor Deposit</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isHeldInEscrow || isReleased ? 'Completed' : 'Pending Funding'}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3 rounded-xl border ${isHeldInEscrow ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : isReleased ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-500'}`}>
                <div className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold text-[10px] bg-current text-white">
                  2
                </div>
                <div className="font-bold text-[11px]">Held in Neutral Escrow</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isHeldInEscrow ? 'Protected in Pool' : isReleased ? 'Released' : 'Awaiting Funds'}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-xl border ${isReleased ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                <div className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold text-[10px] bg-current text-white">
                  3
                </div>
                <div className="font-bold text-[11px]">Disbursed to Business</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isReleased ? `UTR: ${agreement.escrowUtrNumber?.slice(-6)}` : 'On Legal Deed'}
                </div>
              </div>

            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {/* VIEW: ALREADY RELEASED */}
          {isReleased ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                Capital Successfully Disbursed to {agreement.businessProfile?.companyName}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Capital of {formatINR(amount)} has been released from neutral escrow upon legal execution of formal deed.
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 inline-block font-mono text-xs text-slate-800 mt-2">
                RBI Bank UTR: <strong>{agreement.escrowUtrNumber}</strong>
              </div>
            </div>
          ) : isHeldInEscrow ? (
            /* VIEW: HELD IN ESCROW (READY FOR RELEASE) */
            <div className="space-y-4">
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Funds Securely Held in Escrow
                    </h5>
                    <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                      Amount of <strong>{formatINR(amount)}</strong> is safely deposited in Vestiq Neutral Escrow Account (<code className="font-mono text-xs">{virtualAccountNum}</code>).
                      Neither party can withdraw funds without statutory compliance.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                        Txn ID: {agreement.escrowTransactionId || 'VST-ESC-ACTIVE'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Method: {agreement.escrowPaymentMethod || 'UPI'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Release Action Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Disbursement Condition:
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isDeedExecuted ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Deed Executed Online. Ready for disbursement.
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Legal deed must be signed by both parties first.
                      </span>
                    )}
                  </p>
                </div>

                {(isFounder || isAdmin || isInvestor) && (
                  <button
                    type="button"
                    onClick={handleReleaseEscrow}
                    disabled={!isDeedExecuted || processing}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-xs transition flex items-center gap-2 shadow-sm shrink-0"
                  >
                    {processing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    Release Funds to Business A/c
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* VIEW: INITIAL INVESTOR FUNDING INTERFACE */
            <div className="space-y-4">
              
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Institutional Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">UPI (Instant)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${paymentMethod === 'NETBANKING' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">NetBanking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NEFT_RTGS')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${paymentMethod === 'NEFT_RTGS' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    <Building className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">NEFT / RTGS</span>
                  </button>
                </div>
              </div>

              {/* Method Details */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Virtual Escrow UPI ID:</span>
                    <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      vestiq.escrow.{agreement.id.slice(-6).toLowerCase()}@icici
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Your UPI ID / Mobile Number (PhonePe, Google Pay, Paytm)
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Select Your Corporate / Retail Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'NEFT_RTGS' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-sans font-semibold text-slate-500">Beneficiary Name:</span>
                    <span>Vestiq Escrow FBO {agreement.businessProfile?.companyName.slice(0, 15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-semibold text-slate-500">Virtual Account #:</span>
                    <span className="font-bold text-slate-900">{virtualAccountNum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-semibold text-slate-500">IFSC Code:</span>
                    <span>ICIC0000104</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans font-semibold text-slate-500">Bank:</span>
                    <span>ICICI Bank Ltd (Trustee Division)</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDepositEscrow}
                  disabled={processing}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Deposit {formatINR(amount)} Into Neutral Escrow
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  🔒 Funds are securely locked in Vestiq Trustee Escrow until formal legal deeds are fully executed.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

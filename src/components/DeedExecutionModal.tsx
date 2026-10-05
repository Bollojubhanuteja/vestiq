'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ArrowRight,
  PenTool,
  Lock,
  Building2,
  UserCheck,
  Award,
  Scroll,
  Percent,
  Coins,
  Smartphone,
  CreditCard,
  RefreshCw,
  BadgeCheck
} from 'lucide-react';
import { formatINR } from '@/lib/legal-templates';
import { EscrowPaymentModal } from './EscrowPaymentModal';

interface DeedExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: any;
  currentUserId: string;
  currentUserRole: 'INVESTOR' | 'BUSINESS' | 'ADMIN';
  onAgreementUpdated: () => void;
}

export function DeedExecutionModal({
  isOpen,
  onClose,
  agreement,
  currentUserId,
  currentUserRole,
  onAgreementUpdated,
}: DeedExecutionModalProps) {
  if (!isOpen || !agreement) return null;

  const isInvestor = agreement.investorUserId === currentUserId || currentUserRole === 'INVESTOR';
  const isFounder = agreement.businessProfile?.userId === currentUserId || currentUserRole === 'BUSINESS';

  const isFixedReturn = agreement.agreementType === 'FIXED_RETURN_DEBT';
  const isFormalDeed = agreement.agreementStage === 'FORMAL_DEED';
  const isFullyExecuted = agreement.status === 'EXECUTED';

  const userHasSigned = isInvestor
    ? !!agreement.investorSignedAt
    : isFounder
    ? !!agreement.businessSignedAt
    : false;

  const [activeTab, setActiveTab] = useState<'DEED' | 'TERM_SHEET'>(
    isFormalDeed ? 'DEED' : 'TERM_SHEET'
  );

  // Signing form mode
  const [signMethod, setSignMethod] = useState<'AADHAAR' | 'PAN'>('AADHAAR');

  // Aadhaar OTP State
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTransactionId, setOtpTransactionId] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Signing form state
  const [signing, setSigning] = useState(false);
  const [legalName, setLegalName] = useState(
    isInvestor
      ? agreement.investorUser?.name || ''
      : agreement.businessProfile?.founderName || ''
  );
  const [panOrId, setPanOrId] = useState('');
  const [designation, setDesignation] = useState(
    isInvestor ? 'Qualified Investor / Capital Partner' : 'Founder & Managing Director'
  );
  const [consentChecked, setConsentChecked] = useState(false);

  // Promotion state
  const [promoting, setPromoting] = useState(false);

  // Escrow modal state
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);

  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handlePromoteToDeed = async () => {
    setPromoting(true);
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId: agreement.id,
          action: 'PROMOTE_TO_FORMAL_DEED',
        }),
      });
      if (res.ok) {
        onAgreementUpdated();
        setActiveTab('DEED');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPromoting(false);
    }
  };

  const handleRequestAadhaarOtp = async () => {
    const clean = aadhaarNumber.replace(/\s+/g, '');
    if (clean.length !== 12) {
      setOtpError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setRequestingOtp(true);
    setOtpError(null);
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId: agreement.id,
          action: 'REQUEST_AADHAAR_OTP',
          aadhaarNumber: clean,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpTransactionId(data.transactionId);
        setMaskedMobile(data.maskedMobile || '+91 ******4521');
        setOtpCountdown(60);
      } else {
        setOtpError(data.error || 'Failed to request OTP');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Network error');
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleSignWithAadhaar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) return;
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }
    setSigning(true);
    setOtpError(null);
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId: agreement.id,
          action: 'SIGN_AADHAAR_OTP',
          aadhaarNumber: aadhaarNumber.replace(/\s+/g, ''),
          otp,
          transactionId: otpTransactionId,
          legalName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAgreementUpdated();
      } else {
        setOtpError(data.error || 'Aadhaar eSign verification failed');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Network error');
    } finally {
      setSigning(false);
    }
  };

  const handleSignOnlinePan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) return;
    setSigning(true);
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId: agreement.id,
          action: 'SIGN_ONLINE',
          legalName,
          panOrId,
          designation,
        }),
      });
      if (res.ok) {
        onAgreementUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const deedTitle = isFixedReturn
    ? 'Deed of Secured Loan & Debenture Facility'
    : "Shareholders' Agreement (SHA) & Share Subscription Agreement";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
          
          {/* Modal Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFixedReturn ? 'bg-emerald-600/30 text-emerald-400' : 'bg-blue-600/30 text-blue-400'}`}>
                {isFixedReturn ? <Coins className="w-5 h-5" /> : <Percent className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {isFormalDeed ? deedTitle : 'Indicative Investment Term Sheet'}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isFullyExecuted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : isFormalDeed ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                    {isFullyExecuted ? 'Executed Deed' : isFormalDeed ? 'Formal Deed Stage' : 'Term Sheet Stage'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Parties: {agreement.investorUser?.name} ➔ {agreement.businessProfile?.companyName} • Settlement: {formatINR(agreement.principalOrAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isFullyExecuted && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('TERM_SHEET')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'TERM_SHEET' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Scroll className="w-3.5 h-3.5" />
                1. Indicative Term Sheet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('DEED')}
                disabled={!isFormalDeed}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${!isFormalDeed ? 'opacity-40 cursor-not-allowed text-slate-400' : activeTab === 'DEED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Award className="w-3.5 h-3.5 text-blue-600" />
                2. Formal Legal Deed {isFormalDeed ? '' : '(Promote to View)'}
              </button>
            </div>

            {/* Escrow Button if executed */}
            {isFullyExecuted && (
              <button
                type="button"
                onClick={() => setIsEscrowOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Escrow Settlement Gateway
              </button>
            )}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* PROMOTION BANNER */}
            {!isFormalDeed && isFounder && (
              <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider mb-1">
                    <FileCheck className="w-4 h-4" /> Ready for Legal Execution
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Promote Term Sheet to Official {isFixedReturn ? 'Loan / Debenture Deed' : 'Shareholders Agreement (SHA)'}
                  </h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Generates full statutory covenants under the Companies Act 2013 and Arbitration Act for online digital execution.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePromoteToDeed}
                  disabled={promoting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
                >
                  {promoting ? 'Generating Deed...' : 'Promote to Formal Deed'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* FULLY EXECUTED CERTIFICATE BADGE */}
            {isFullyExecuted && (
              <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-500/40 shadow-lg text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Official Vestiq Digital Execution Seal
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  LEGALLY EXECUTED DIGITAL DEED
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mx-auto">
                  Enforceable under Section 10A of the Information Technology Act, 2000. Dual digital signatures authenticated with tamper-proof SHA-256 cryptographic hashes.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-emerald-300">
                  <span>Certificate ID: <strong>{agreement.executionCertificateId || 'VST-EXEC-VERIFIED'}</strong></span>
                  <span>•</span>
                  <span>Executed: {new Date(agreement.updatedAt).toLocaleString('en-IN')}</span>
                  {agreement.investorAadhaarLast4 && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4 text-emerald-400" /> DigiLocker Verified (Aadhaar ending {agreement.investorAadhaarLast4})
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* AGREEMENT DOCUMENT PREVIEW BOX */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed font-normal overflow-x-auto max-h-[350px]">
                {activeTab === 'DEED' && agreement.formalDeedContent
                  ? agreement.formalDeedContent
                  : agreement.indicativeTerms}
              </pre>
            </div>

            {/* SIGNATORIES AUDIT SECTION */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Digital Signatory Audit Trail
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Investor Signatory Card */}
                <div className={`p-4 rounded-2xl border text-xs space-y-2 transition ${agreement.investorSignedAt ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Investor Signatory
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${agreement.investorSignedAt ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                      {agreement.investorSignedAt ? '✓ SIGNED' : 'Awaiting Signature'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">
                      {agreement.investorLegalName || agreement.investorUser?.name || 'Investor'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {agreement.investorDesignation || 'Qualified Capital Partner'}
                    </p>
                    {agreement.investorAadhaarLast4 && (
                      <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" /> Aadhaar OTP Verified (Ending in {agreement.investorAadhaarLast4})
                      </p>
                    )}
                    {agreement.investorSignedAt && (
                      <div className="pt-1 text-[10px] text-emerald-800 font-mono">
                        Signed: {new Date(agreement.investorSignedAt).toLocaleString('en-IN')}<br />
                        Hash: {agreement.investorSignatureHash?.slice(0, 24)}...
                      </div>
                    )}
                  </div>
                </div>

                {/* Founder / Company Signatory Card */}
                <div className={`p-4 rounded-2xl border text-xs space-y-2 transition ${agreement.businessSignedAt ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Founder / Company Signatory
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${agreement.businessSignedAt ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                      {agreement.businessSignedAt ? '✓ SIGNED' : 'Awaiting Signature'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">
                      {agreement.businessLegalName || agreement.businessProfile?.founderName || 'Founder'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {agreement.businessDesignation || 'Founder & Director, ' + (agreement.businessProfile?.companyName || 'Company')}
                    </p>
                    {agreement.businessAadhaarLast4 && (
                      <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" /> Aadhaar OTP Verified (Ending in {agreement.businessAadhaarLast4})
                      </p>
                    )}
                    {agreement.businessSignedAt && (
                      <div className="pt-1 text-[10px] text-emerald-800 font-mono">
                        Signed: {new Date(agreement.businessSignedAt).toLocaleString('en-IN')}<br />
                        Hash: {agreement.businessSignatureHash?.slice(0, 24)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* E-SIGNING FORM FOR UN-SIGNED PARTY */}
            {!userHasSigned && (
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border-2 border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Digital Signing Ceremony
                      </h4>
                      <p className="text-xs text-slate-500">
                        Signing as {isInvestor ? 'Investor / Capital Partner' : 'Authorized Founder & Director'}.
                      </p>
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="inline-flex rounded-xl p-1 bg-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setSignMethod('AADHAAR')}
                      className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${signMethod === 'AADHAAR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Aadhaar OTP (DigiLocker)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignMethod('PAN')}
                      className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${signMethod === 'PAN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      PAN / ID E-Sign
                    </button>
                  </div>
                </div>

                {otpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {otpError}
                  </div>
                )}

                {/* MODE A: AADHAAR OTP & DIGILOCKER */}
                {signMethod === 'AADHAAR' ? (
                  <form onSubmit={handleSignWithAadhaar} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Legal Signatory Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          12-Digit Aadhaar Number *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            maxLength={12}
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 542189034521"
                            className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 font-mono tracking-wider focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleRequestAadhaarOtp}
                            disabled={requestingOtp || aadhaarNumber.length !== 12 || otpCountdown > 0}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap"
                          >
                            {requestingOtp ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : otpCountdown > 0 ? (
                              `Resend in ${otpCountdown}s`
                            ) : (
                              'Get OTP'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* OTP Entry box */}
                    {otpSent && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-900">
                          <span className="font-medium">
                            ✓ OTP sent to mobile registered with Aadhaar ({maskedMobile})
                          </span>
                          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Sandbox Test OTP: <strong>123456</strong>
                          </span>
                        </div>
                        <div className="max-w-xs">
                          <label className="block text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                            Enter 6-Digit OTP *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className="w-full p-2.5 rounded-xl border border-emerald-300 text-sm font-mono tracking-widest text-slate-900 bg-white text-center focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-[11px] text-slate-700 leading-relaxed select-none">
                        I hereby consent to UIDAI authentication and authorize DigiLocker electronic signature under Section 10A of the Information Technology Act, 2000. I confirm that all details and obligations are binding upon verification.
                      </span>
                    </label>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={signing || !consentChecked || !otpSent || otp.length !== 6}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                      >
                        {signing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                        {signing ? 'Verifying OTP & eSigning...' : 'Verify OTP & Execute DigiLocker e-Sign'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* MODE B: PAN / GOVERNMENT ID DECLARATION */
                  <form onSubmit={handleSignOnlinePan} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          PAN / ID No. *
                        </label>
                        <input
                          type="text"
                          required
                          value={panOrId}
                          onChange={(e) => setPanOrId(e.target.value.toUpperCase())}
                          placeholder="e.g. ABCDE1234F"
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Designation *
                        </label>
                        <input
                          type="text"
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-[11px] text-slate-700 leading-relaxed select-none">
                        I declare that I am the authorized signatory. I confirm my unconditional assent to the terms, covenants, and obligations set forth in this agreement. I understand that digital execution on Vestiq constitutes a legally valid agreement under Section 10A of the Information Technology Act, 2000.
                      </span>
                    </label>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={signing || !consentChecked || !legalName.trim() || !panOrId.trim()}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                      >
                        <PenTool className="w-4 h-4" />
                        {signing ? 'Executing Signature...' : 'Affix Digital Signature & Execute Deed'}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>UIDAI / IT Act 2000 Encrypted Execution • Audit Seal Persisted</span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Escrow Banking Modal Component */}
      <EscrowPaymentModal
        isOpen={isEscrowOpen}
        onClose={() => setIsEscrowOpen(false)}
        agreement={agreement}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onAgreementUpdated={onAgreementUpdated}
      />
    </>
  );
}

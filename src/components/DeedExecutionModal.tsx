'use client';

import React, { useState } from 'react';
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
  Coins
} from 'lucide-react';
import { formatINR } from '@/lib/legal-templates';

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

  // Signing form state
  const [signing, setSigning] = useState(false);
  const [legalName, setLegalName] = useState(
    isInvestor
      ? agreement.investorUser?.name || ''
      : agreement.businessProfile?.founderName || ''
  );
  const [panOrId, setPanOrId] = useState('');
  const [designation, setDesignation] = useState(
    isInvestor ? 'Angel Investor / Capital Partner' : 'Founder & Managing Director'
  );
  const [consentChecked, setConsentChecked] = useState(false);

  // Promotion state
  const [promoting, setPromoting] = useState(false);

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

  const handleSignOnline = async (e: React.FormEvent) => {
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
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {agreement.formalDeedType ? (isFixedReturn ? 'Loan / Debenture Deed' : 'Shareholders Agreement (SHA)') : 'Indicative Term Sheet'}
                </span>
                <span className="text-xs text-slate-400">
                  • Ref: {agreement.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
                {agreement.businessProfile?.companyName} • {formatINR(agreement.principalOrAmount)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFullyExecuted && (
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                title="Print Deed / Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs & Status Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('TERM_SHEET')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'TERM_SHEET'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Indicative Term Sheet
            </button>
            <button
              onClick={() => setActiveTab('DEED')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'DEED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Formal Legal Deed
              {isFormalDeed && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  isFullyExecuted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : agreement.status === 'PENDING_FOUNDER_SIGN' || agreement.status === 'PENDING_INVESTOR_SIGN'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}
              >
                {isFullyExecuted ? '✓ EXECUTED & BINDING' : agreement.status.replace(/_/g, ' ')}
              </span>
            </div>

            {agreement.executionCertificateId && (
              <span className="hidden sm:inline font-mono text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-300">
                Cert: {agreement.executionCertificateId}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Promotion Callout Banner if still only an Indicative Term Sheet */}
          {!isFormalDeed && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-blue-950 flex items-center gap-1.5 text-sm">
                  <Scroll className="w-4 h-4 text-blue-600" />
                  Ready to Complete Formal Agreement Online?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Promote this term sheet to a full{' '}
                  <strong className="text-slate-900">
                    {isFixedReturn ? 'Loan / Debenture Deed' : "Shareholders' Agreement (SHA)"}
                  </strong>{' '}
                  under Indian law with digital signing for both parties.
                </p>
              </div>

              <button
                onClick={handlePromoteToDeed}
                disabled={promoting}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
              >
                <PenTool className="w-3.5 h-3.5" />
                {promoting ? 'Generating Deed...' : `Promote to Formal Deed →`}
              </button>
            </div>
          )}

          {/* Fully Executed Certificate Callout */}
          {isFullyExecuted && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-emerald-950">
                    Official Digital Execution Certificate
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    This legal instrument has been executed online by both parties with cryptographic verification.
                  </p>
                  <p className="font-mono text-[11px] text-emerald-700 mt-1">
                    Certificate ID: <strong>{agreement.executionCertificateId}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
              >
                <Printer className="w-3.5 h-3.5" /> Print Deed Certificate
              </button>
            </div>
          )}

          {/* TAB 1: INDICATIVE TERM SHEET */}
          {activeTab === 'TERM_SHEET' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" /> Indicative Term Sheet Terms
                </h3>
                <span className="text-xs text-slate-500">Stage 1: Preliminary Indicative Terms</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-line select-all">
                {agreement.indicativeTerms}
              </div>
            </div>
          )}

          {/* TAB 2: FORMAL LEGAL DEED */}
          {activeTab === 'DEED' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Scroll className="w-4 h-4 text-emerald-600" /> {deedTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Stage 2: Comprehensive multi-clause legal instrument governed by Indian contract &amp; corporate law.
                  </p>
                </div>
              </div>

              {agreement.formalDeedContent ? (
                <div className="p-6 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 whitespace-pre-line max-h-96 overflow-y-auto select-all shadow-inner">
                  {agreement.formalDeedContent}
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-3">
                  <Scroll className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-medium">Formal deed text has not been generated yet.</p>
                  <button
                    onClick={handlePromoteToDeed}
                    disabled={promoting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    {promoting ? 'Generating...' : 'Generate Formal Legal Deed Now'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DUAL SIGNATORY AUDIT CARDS */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" /> Dual-Party Digital Signatories
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Investor Signatory */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                  agreement.investorSignedAt
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    Investor Signatory
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      agreement.investorSignedAt
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
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
                  {agreement.investorPan && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      PAN/ID: {agreement.investorPan}
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

              {/* Card 2: Founder / Business Signatory */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                  agreement.businessSignedAt
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Founder / Company Signatory
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      agreement.businessSignedAt
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
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
                  {agreement.businessPan && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      PAN/DIN: {agreement.businessPan}
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

          {/* ONLINE E-SIGNING FORM (FOR UN-SIGNED PARTY) */}
          {!userHasSigned && (
            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border-2 border-blue-200 space-y-4">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Online Digital Signature Ceremony
                  </h4>
                  <p className="text-xs text-slate-500">
                    Signing as {isInvestor ? 'Investor / Capital Partner' : 'Company Founder & Authorized Director'}.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSignOnline} className="space-y-4">
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
                      placeholder="e.g. Vikram Mehta"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      PAN / Identification No. *
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
                      placeholder="e.g. Director / Angel Investor"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* E-Signature Consent Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed select-none">
                    I declare that I am the authorized signatory. I confirm my unconditional assent to the terms, covenants, and repayment/equity obligations set forth in this agreement. I understand that digital execution on Vestiq constitutes a legally valid agreement under Section 10A of the Information Technology Act, 2000.
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
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Dual-Party Execution • Audit Trail Persisted</span>
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
  );
}

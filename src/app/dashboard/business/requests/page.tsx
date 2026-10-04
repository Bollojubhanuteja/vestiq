'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Clock,
  CheckCircle2,
  MessageSquare,
  Reply,
  RefreshCw,
  Percent,
  TrendingUp,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Coins,
  AlertCircle,
  FileCheck,
  Check,
  X,
  Scroll,
  PenTool,
  Award,
  Printer
} from 'lucide-react';
import { DeedExecutionModal } from '@/components/DeedExecutionModal';

export default function BusinessRequestsPage() {
  const [activeTab, setActiveTab] = useState<'INTERESTS' | 'INQUIRIES'>('INTERESTS');

  // Interests state
  const [interests, setInterests] = useState<any[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Term Sheet & Formal Deed Draft Modal
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [activeInterest, setActiveInterest] = useState<any | null>(null);
  const [draftPrincipal, setDraftPrincipal] = useState<number>(500000);
  const [draftTerms, setDraftTerms] = useState<string>('');
  const [drafting, setDrafting] = useState(false);
  const [createDirectDeed, setCreateDirectDeed] = useState(false);

  // Formal Deed Execution modal state
  const [selectedDeed, setSelectedDeed] = useState<any | null>(null);
  const [deedModalOpen, setDeedModalOpen] = useState(false);

  // Discussion Messages state
  const [expandedInterestId, setExpandedInterestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  const fetchInterests = async () => {
    try {
      const res = await fetch('/api/business/interests');
      if (res.ok) {
        const data = await res.json();
        setInterests(data.interests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInterests(false);
    }
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/business/requests');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInterests();
    fetchInquiries();
  }, []);

  const handleAdvanceStatus = async (interestId: string, newStatus: string) => {
    setUpdatingStatusId(interestId);
    try {
      const res = await fetch('/api/business/interests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interestId, status: newStatus }),
      });
      if (res.ok) {
        setInterests((prev) =>
          prev.map((i) => (i.id === interestId ? { ...i, status: newStatus } : i))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleOpenDraftModal = (interest: any) => {
    setActiveInterest(interest);
    setDraftPrincipal(interest.intendedAmount);
    setCreateDirectDeed(false);
    setDraftTerms(
      interest.investmentModel === 'FIXED_RETURN'
        ? `INDICATIVE TERM SHEET: FIXED RETURN FACILITY\n1. Principal: ₹${interest.intendedAmount.toLocaleString('en-IN')}\n2. Proposed Coupon: 16% p.a.\n3. Tenure: 24 Months\n4. Frequency: Monthly Amortization\n5. Collateral: First hypothecation charge on enterprise machinery and commercial receivables.\n6. Next Step: Promote to formal Loan & Debenture Deed upon bilateral assent.`
        : `INDICATIVE TERM SHEET: DIRECT EQUITY PARTNERSHIP\n1. Check Size: ₹${interest.intendedAmount.toLocaleString('en-IN')}\n2. Pre-Money Valuation: ₹8,00,00,000\n3. Equity Pool Allocation: 10%\n4. Governance Rights: Information rights, quarterly audited MIS, observer seat.\n5. Next Step: Promote to formal Shareholders' Agreement (SHA) upon bilateral assent.`
    );
    setDraftModalOpen(true);
  };

  const handleCreateAgreement = async () => {
    if (!activeInterest) return;
    setDrafting(true);
    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interestId: activeInterest.id,
          agreementType:
            activeInterest.investmentModel === 'FIXED_RETURN'
              ? 'FIXED_RETURN_DEBT'
              : 'EQUITY_PARTNERSHIP',
          principalOrAmount: Number(draftPrincipal),
          indicativeTerms: draftTerms,
          directPromoteToDeed: createDirectDeed,
        }),
      });

      if (res.ok) {
        setDraftModalOpen(false);
        fetchInterests();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDrafting(false);
    }
  };

  const handleSignAgreement = async (agreementId: string) => {
    try {
      const res = await fetch('/api/agreements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreementId, action: 'SIGN' }),
      });
      if (res.ok) {
        fetchInterests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadMessages = async (interestId: string) => {
    if (expandedInterestId === interestId) {
      setExpandedInterestId(null);
      return;
    }
    setExpandedInterestId(interestId);
    try {
      const res = await fetch(`/api/messages?interestId=${interestId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (interestId: string) => {
    if (!newMessage.trim()) return;
    setSendingMsg(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interestId, content: newMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSendReply = async (requestId: string) => {
    if (!replyText.trim()) return;
    setSavingReply(true);

    try {
      const res = await fetch('/api/business/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, businessReply: replyText }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: 'RESPONDED', businessReply: replyText, repliedAt: new Date().toISOString() }
              : r
          )
        );
        setReplyingId(null);
        setReplyText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingReply(false);
    }
  };

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    INTEREST_SUBMITTED: { label: 'Interest Received', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    BUSINESS_REVIEWING: { label: 'Founder Reviewing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    DISCUSSION: { label: 'In Discussion', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    DUE_DILIGENCE: { label: 'Due Diligence Data Room', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    AGREEMENT: { label: 'Indicative Term Sheet Drafted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    COMPLETED: { label: 'Agreement Executed', color: 'bg-emerald-600 text-white border-emerald-600' },
    DECLINED: { label: 'Declined', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Founder Deal Pipeline
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Investor Interests &amp; Inquiries
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage incoming expressions of interest, review investor check sizes, draft indicative term sheets, and conduct direct due diligence.
            </p>
          </div>

          <Link
            href="/dashboard/business"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('INTERESTS')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'INTERESTS'
                ? 'bg-white border-t-2 border-emerald-600 text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Percent className="w-4 h-4 text-emerald-600" />
            Investment Interests &amp; Agreements ({interests.length})
          </button>
          <button
            onClick={() => setActiveTab('INQUIRIES')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'INQUIRIES'
                ? 'bg-white border-t-2 border-blue-600 text-blue-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            General Diligence Inquiries ({inquiries.length})
          </button>
        </div>

        {/* TAB 1: INVESTMENT INTERESTS & AGREEMENTS */}
        {activeTab === 'INTERESTS' && (
          <div>
            {loadingInterests ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading incoming investor interests...</p>
              </div>
            ) : interests.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
                <Percent className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No investment interests received yet</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Ensure your opportunity profile is fully submitted and published so allocators can discover your capital requirements.
                </p>
                <Link
                  href="/dashboard/business/opportunity"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Configure Opportunity Profile
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {interests.map((item) => {
                  const isExpanded = expandedInterestId === item.id;
                  const isFixedReturn = item.investmentModel === 'FIXED_RETURN';
                  const agreement = item.agreements && item.agreements[0];
                  const currentStatus = statusMap[item.status] || {
                    label: item.status,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
                    >
                      {/* Top Row: Investor identity and Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isFixedReturn
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}
                            >
                              {isFixedReturn ? 'Fixed Return Check' : 'Equity Allocation'}
                            </span>
                            <span className="text-xs text-slate-400">
                              Received {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {item.investorUser?.name || 'Institutional Investor'}
                            <span className="text-xs font-normal text-slate-500">
                              ({item.investorUser?.email}, {item.investorUser?.city || 'India'})
                            </span>
                          </h3>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${currentStatus.color}`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {currentStatus.label}
                        </span>
                      </div>

                      {/* Financial Metrics Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Intended Check Size</span>
                          <span className="text-base font-bold text-blue-700 block mt-0.5">
                            {formatINR(item.intendedAmount)}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Proposed Terms</span>
                          <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                            {item.ownershipOrReturnProposed}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Investor Experience</span>
                          <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                            {item.investorUser?.investorProfile?.experienceLevel || 'Accredited'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Agreement State</span>
                          <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
                            {agreement ? agreement.status : 'No draft yet'}
                          </span>
                        </div>
                      </div>

                      {/* Investor Note */}
                      {item.notes && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                          <span className="font-semibold text-slate-900 block mb-0.5">Investor Diligence Note:</span>
                          <p className="italic">"{item.notes}"</p>
                        </div>
                      )}

                      {/* Indicative Agreement & Formal Deed Section */}
                      {agreement && (
                        <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-2xl border-2 border-emerald-300 text-xs space-y-3.5 shadow-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                                {agreement.formalDeedType ? <Scroll className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block text-xs">
                                  {agreement.formalDeedType
                                    ? (item.investmentModel === 'FIXED_RETURN'
                                        ? 'Loan & Debenture Deed (Formal Deed)'
                                        : "Shareholders' Agreement (SHA)")
                                    : `Indicative Term Sheet (${formatINR(agreement.principalOrAmount)})`}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {agreement.agreementStage === 'FORMAL_DEED' ? 'Stage 2: Formal Binding Deed' : 'Stage 1: Preliminary Indicative Terms'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                                  agreement.status === 'EXECUTED'
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {agreement.status === 'EXECUTED' ? '✓ EXECUTED ONLINE' : agreement.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 text-[11px] text-slate-700 whitespace-pre-line font-mono max-h-36 overflow-y-auto">
                            {agreement.formalDeedContent || agreement.indicativeTerms}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-emerald-100/80">
                            <div className="text-[11px] text-slate-600 flex items-center gap-2">
                              <span>Investor E-Sign: {agreement.investorSignedAt ? '✓ Signed' : 'Pending'}</span>
                              <span>•</span>
                              <span>Founder E-Sign: {agreement.businessSignedAt ? '✓ Signed' : 'Pending'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedDeed(agreement);
                                  setDeedModalOpen(true);
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                              >
                                <PenTool className="w-3.5 h-3.5" />
                                {agreement.status === 'EXECUTED'
                                  ? 'View & Print Deed'
                                  : agreement.agreementStage === 'FORMAL_DEED'
                                  ? 'Complete Online E-Sign'
                                  : 'Review & Promote to Deed'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Milestone Pipeline Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">Advance Stage:</span>
                          {item.status === 'INTEREST_SUBMITTED' && (
                            <button
                              onClick={() => handleAdvanceStatus(item.id, 'BUSINESS_REVIEWING')}
                              disabled={updatingStatusId === item.id}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition"
                            >
                              Mark as Reviewing
                            </button>
                          )}
                          {(item.status === 'INTEREST_SUBMITTED' || item.status === 'BUSINESS_REVIEWING') && (
                            <button
                              onClick={() => handleAdvanceStatus(item.id, 'DISCUSSION')}
                              disabled={updatingStatusId === item.id}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition"
                            >
                              Open Direct Discussion
                            </button>
                          )}
                          {item.status === 'DISCUSSION' && (
                            <button
                              onClick={() => handleAdvanceStatus(item.id, 'DUE_DILIGENCE')}
                              disabled={updatingStatusId === item.id}
                              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition"
                            >
                              Open Data Room Diligence
                            </button>
                          )}
                          {!agreement && (
                            <button
                              onClick={() => handleOpenDraftModal(item)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" /> Draft Indicative Agreement
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLoadMessages(item.id)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                            {isExpanded ? 'Hide Discussion' : 'Diligence Discussion'}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Collapsible Discussion Thread */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <span className="text-xs font-bold text-slate-800 block">
                            Direct Diligence Communication with {item.investorUser?.name}
                          </span>

                          <div className="max-h-56 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            {messages.length === 0 ? (
                              <p className="text-xs text-slate-500 italic text-center py-2">
                                No messages yet. Send an opening note regarding due diligence and cap table documents.
                              </p>
                            ) : (
                              messages.map((m) => (
                                <div key={m.id} className="text-xs">
                                  <div className="flex items-center gap-2">
                                    <strong className="text-slate-900">{m.sender.name} ({m.sender.role})</strong>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 mt-0.5 leading-relaxed bg-white p-2 rounded-lg border border-slate-200 inline-block">
                                    {m.content}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type a message or answer diligence inquiries..."
                              className="flex-1 p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendMessage(item.id);
                              }}
                            />
                            <button
                              onClick={() => handleSendMessage(item.id)}
                              disabled={sendingMsg || !newMessage.trim()}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GENERAL INQUIRIES */}
        {activeTab === 'INQUIRIES' && (
          <div>
            {loadingInquiries ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No inquiries received</h3>
                <p className="text-xs text-slate-500">
                  Questions submitted via "Request Information" on your profile will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {inquiries.map((req) => {
                  const isReplying = replyingId === req.id;
                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-xs text-slate-400">Inquiry from:</span>
                          <span className="text-base font-bold text-slate-900 block mt-0.5">
                            {req.investorUser?.name || 'Registered Investor'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {req.status === 'RESPONDED' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Answered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock className="w-3.5 h-3.5" /> Pending Response
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-800">{req.subject}</h4>
                        <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                          {req.message}
                        </p>
                      </div>

                      {req.businessReply && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                            Your Sent Response:
                          </span>
                          <p className="text-xs text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 leading-relaxed">
                            {req.businessReply}
                          </p>
                        </div>
                      )}

                      {!req.businessReply && (
                        <div>
                          {isReplying ? (
                            <div className="space-y-3 pt-2">
                              <textarea
                                rows={4}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your factual response to the allocator..."
                                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setReplyingId(null);
                                    setReplyText('');
                                  }}
                                  className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSendReply(req.id)}
                                  disabled={savingReply || !replyText.trim()}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                                >
                                  {savingReply ? 'Transmitting...' : 'Send Response'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setReplyingId(req.id);
                                setReplyText('');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                            >
                              <Reply className="w-3.5 h-3.5 text-slate-500" /> Respond to Allocator
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal: Draft Indicative Term Sheet or Formal Deed */}
        {draftModalOpen && activeInterest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Draft Agreement / Legal Instrument
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                To: {activeInterest.investorUser?.name} • Model: {activeInterest.investmentModel === 'FIXED_RETURN' ? 'Fixed Return / Debt' : 'Equity / Partnership'}
              </p>

              <div className="space-y-4">
                {/* Agreement Format Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Agreement Format:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCreateDirectDeed(false)}
                      className={`p-3 rounded-xl border text-left transition ${
                        !createDirectDeed
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="block font-bold">1. Indicative Term Sheet</span>
                      <span className="text-[10px] text-slate-500 font-normal">Core commercial terms &amp; schedule</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateDirectDeed(true)}
                      className={`p-3 rounded-xl border text-left transition ${
                        createDirectDeed
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="block font-bold">
                        2. {activeInterest.investmentModel === 'FIXED_RETURN' ? 'Loan / Debenture Deed' : 'Shareholders Agreement (SHA)'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Direct formal deed for online E-Sign</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Principal / Investment Check Amount (INR ₹) *
                  </label>
                  <input
                    type="number"
                    value={draftPrincipal}
                    onChange={(e) => setDraftPrincipal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {!createDirectDeed && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Indicative Clauses &amp; Terms *
                    </label>
                    <textarea
                      rows={6}
                      value={draftTerms}
                      onChange={(e) => setDraftTerms(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div className="p-3 bg-blue-50/60 rounded-xl text-[11px] text-blue-900 border border-blue-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Online Digital Execution:</strong> Both parties can review clauses, promote to formal deeds, and affix digital signatures online under the Information Technology Act, 2000.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDraftModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAgreement}
                    disabled={drafting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    {drafting
                      ? 'Generating...'
                      : createDirectDeed
                      ? `Create Formal ${activeInterest.investmentModel === 'FIXED_RETURN' ? 'Loan Deed' : 'SHA'} Deed`
                      : 'Issue Indicative Term Sheet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formal Deed Execution & E-Sign Modal */}
      {selectedDeed && (
        <DeedExecutionModal
          isOpen={deedModalOpen}
          onClose={() => {
            setDeedModalOpen(false);
            setSelectedDeed(null);
          }}
          agreement={selectedDeed}
          currentUserId=""
          currentUserRole="BUSINESS"
          onAgreementUpdated={() => {
            fetchInterests();
            if (selectedDeed?.id) {
              fetch(`/api/agreements?id=${selectedDeed.id}`)
                .then((r) => r.json())
                .then((d) => {
                  if (d.agreements?.[0]) setSelectedDeed(d.agreements[0]);
                });
            }
          }}
        />
      )}
    </div>
  );
}

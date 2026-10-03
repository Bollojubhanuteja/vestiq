'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Clock,
  CheckCircle2,
  Building2,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  Percent,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Check,
  Coins
} from 'lucide-react';

export default function InvestorRequestsPage() {
  const [activeTab, setActiveTab] = useState<'INTERESTS' | 'INQUIRIES'>('INTERESTS');

  // Interests state
  const [interests, setInterests] = useState<any[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(true);

  // Discussion Messages state
  const [expandedInterestId, setExpandedInterestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Inquiries state
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchInterests = async () => {
    try {
      const res = await fetch('/api/investor/interests');
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

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/investor/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchInterests();
    fetchRequests();
  }, []);

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

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    INTEREST_SUBMITTED: { label: 'Interest Registered', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    BUSINESS_REVIEWING: { label: 'Under Founder Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    DISCUSSION: { label: 'Direct Diligence Discussion', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    DUE_DILIGENCE: { label: 'Data Room Diligence', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    AGREEMENT: { label: 'Indicative Term Sheet Ready', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    COMPLETED: { label: 'Term Sheet Executed', color: 'bg-emerald-600 text-white border-emerald-600' },
    DECLINED: { label: 'Declined', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Investor Deal Pipeline
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Investment Interests &amp; Diligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your expressions of interest, review indicative term sheets, and communicate directly with founding teams.
            </p>
          </div>

          <Link
            href="/explore"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Explore Opportunities
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('INTERESTS')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 ${
              activeTab === 'INTERESTS'
                ? 'bg-white border-t-2 border-blue-600 text-blue-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Percent className="w-4 h-4 text-emerald-600" />
            Active Interests &amp; Term Sheets ({interests.length})
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
            Q&amp;A Diligence Inquiries ({requests.length})
          </button>
        </div>

        {/* TAB 1: ACTIVE INTERESTS & TERM SHEETS */}
        {activeTab === 'INTERESTS' && (
          <div>
            {loadingInterests ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading your investment pipeline...</p>
              </div>
            ) : interests.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
                <Percent className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No active expressions of interest</h3>
                <p className="text-xs text-slate-500 mb-6">
                  When you find a verified business opportunity, click "Express Indicative Interest" to initiate direct diligence with founders.
                </p>
                <Link
                  href="/explore"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Browse Verified Deals
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
                      {/* Top Header Row */}
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
                              {isFixedReturn
                                ? `Fixed Return: ${item.businessProfile.proposedReturnRate || 16}% p.a.`
                                : `Equity: ${item.businessProfile.equityOffered || 12}% Pool`}
                            </span>
                            <span className="text-xs text-slate-400">
                              Registered on {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <Link
                            href={`/opportunity/${item.businessProfile.id}`}
                            className="text-lg font-bold text-slate-900 hover:text-blue-600 transition flex items-center gap-2"
                          >
                            {item.businessProfile.companyName}
                            <span className="text-xs font-normal text-slate-500">
                              ({item.businessProfile.city}, {item.businessProfile.industry})
                            </span>
                          </Link>
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
                          <span className="text-slate-400 block font-medium">My Intended Investment</span>
                          <span className="text-base font-bold text-blue-700 block mt-0.5">
                            {formatINR(item.intendedAmount)}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Target Return / Terms</span>
                          <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                            {item.ownershipOrReturnProposed}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Founder</span>
                          <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                            {item.businessProfile.founderName}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Indicative Term Sheet</span>
                          <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
                            {agreement ? agreement.status : 'Awaiting founder draft'}
                          </span>
                        </div>
                      </div>

                      {/* Indicative Agreement Section if Created */}
                      {agreement && (
                        <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4 text-emerald-700" />
                              Indicative Term Sheet ({formatINR(agreement.principalOrAmount)})
                            </span>
                            <span className="font-bold text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              {agreement.status}
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-emerald-100 text-[11px] text-slate-700 whitespace-pre-line font-mono">
                            {agreement.indicativeTerms}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                            <div className="text-[11px] text-slate-500">
                              Investor Signed: {agreement.investorSignedAt ? '✓ Yes' : 'Pending Signature'} • Founder Signed: {agreement.businessSignedAt ? '✓ Yes' : 'Pending Signature'}
                            </div>

                            {!agreement.investorSignedAt ? (
                              <button
                                onClick={() => handleSignAgreement(agreement.id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" /> Sign Indicative Term Sheet
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Signed this Term Sheet
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Discussion Thread Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <Link
                          href={`/opportunity/${item.businessProfile.id}`}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          View Full Diligence Profile &rarr;
                        </Link>

                        <button
                          onClick={() => handleLoadMessages(item.id)}
                          className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                          {isExpanded ? 'Hide Discussion' : 'Diligence Discussion'}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Discussion Drawer */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <span className="text-xs font-bold text-slate-800 block">
                            Direct Communication with Founder ({item.businessProfile.founderName})
                          </span>

                          <div className="max-h-56 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            {messages.length === 0 ? (
                              <p className="text-xs text-slate-500 italic text-center py-2">
                                No messages in this thread yet. Send a note to discuss terms or request data room credentials.
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
                              placeholder="Type a message to the founder..."
                              className="flex-1 p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendMessage(item.id);
                              }}
                            />
                            <button
                              onClick={() => handleSendMessage(item.id)}
                              disabled={sendingMsg || !newMessage.trim()}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition"
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

        {/* TAB 2: GENERAL Q&A INQUIRIES */}
        {activeTab === 'INQUIRIES' && (
          <div>
            {loadingRequests ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading your information requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No inquiries sent yet</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Use "Request Information" on any opportunity profile to ask custom questions.
                </p>
                <Link
                  href="/explore"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Browse Opportunities
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs text-slate-400">Inquiry to:</span>
                        <Link
                          href={`/opportunity/${req.businessProfile.id}`}
                          className="text-base font-bold text-slate-900 hover:text-blue-600 transition block mt-0.5"
                        >
                          {req.businessProfile.companyName} ({req.businessProfile.founderName})
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'RESPONDED' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Founder Responded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <Clock className="w-3.5 h-3.5" /> Awaiting Founder Reply
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
                          Founder Response:
                        </span>
                        <p className="text-xs text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 leading-relaxed">
                          {req.businessReply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

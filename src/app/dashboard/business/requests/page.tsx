'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, Clock, CheckCircle2, MessageSquare, Reply, RefreshCw } from 'lucide-react';

export default function BusinessRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/business/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
        setRequests((prev) =>
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

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Founder Diligence Inbox
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Inbound Investor Inquiries
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Respond directly to structured diligence questions from qualified allocators.
            </p>
          </div>

          <Link
            href="/dashboard/business"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading inquiries...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No inquiries received yet</h3>
            <p className="text-xs text-slate-500 mb-6">
              When investors explore your verified profile and submit questions, they will arrive in this inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => {
              const isReplying = replyingId === req.id;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs text-slate-400">Inquiry from:</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {req.investorUser?.name || 'Investor'} ({req.investorUser?.city || 'India'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'RESPONDED' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Responded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Awaiting Your Reply
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Investor Question */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject: {req.subject}
                    </h4>
                    <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                      {req.message}
                    </p>
                  </div>

                  {/* Previous Reply if any */}
                  {req.businessReply && !isReplying && (
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs">
                      <span className="font-bold text-emerald-950 block mb-1">Your Sent Response:</span>
                      <p className="text-emerald-900 leading-relaxed">{req.businessReply}</p>
                      {req.repliedAt && (
                        <span className="text-[10px] text-emerald-600 mt-2 block">
                          Sent on {new Date(req.repliedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  {isReplying ? (
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-bold text-slate-700">Write Your Reply:</label>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Provide the operational clarification, unit economic context, or diligence response..."
                        className="w-full p-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(req.id)}
                          disabled={savingReply}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {savingReply ? 'Sending...' : 'Send Response'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          setReplyingId(req.id);
                          setReplyText(req.businessReply || '');
                        }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        {req.businessReply ? 'Update Response' : 'Reply to Investor'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

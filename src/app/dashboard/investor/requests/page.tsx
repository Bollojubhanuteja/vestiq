'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, Clock, CheckCircle2, Building2, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';

export default function InvestorRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/investor/requests');
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

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Direct Inquiries
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Information Requests &amp; Diligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track questions and supplementary document requests sent to startup founders.
            </p>
          </div>

          <Link
            href="/explore"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Find Opportunities
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading your information requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No inquiries sent yet</h3>
            <p className="text-xs text-slate-500 mb-6">
              When reviewing an opportunity profile, use "Request Information" to ask questions directly to the founding team.
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
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject: {req.subject}
                  </h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                    {req.message}
                  </p>
                </div>

                {/* Reply */}
                {req.businessReply && (
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-950 block mb-1">
                      Response from {req.businessProfile.founderName}:
                    </span>
                    <p className="text-blue-900 leading-relaxed">{req.businessReply}</p>
                    {req.repliedAt && (
                      <span className="text-[10px] text-blue-500 mt-2 block">
                        Replied on {new Date(req.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

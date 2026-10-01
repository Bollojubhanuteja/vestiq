'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MatchScoreBadge } from '@/components/MatchScoreBadge';
import {
  Bookmark,
  Trash2,
  Edit3,
  Check,
  Scale,
  Send,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/investor/watchlist');
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data.watchlist || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (businessProfileId: string) => {
    try {
      const res = await fetch('/api/investor/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessProfileId }),
      });
      if (res.ok) {
        setWatchlist((prev) => prev.filter((item) => item.businessProfileId !== businessProfileId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = async (businessProfileId: string) => {
    setSavingNote(true);
    try {
      const res = await fetch('/api/investor/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessProfileId, privateNotes: noteContent }),
      });
      if (res.ok) {
        setWatchlist((prev) =>
          prev.map((item) =>
            item.businessProfileId === businessProfileId ? { ...item, privateNotes: noteContent } : item
          )
        );
        setEditingNoteId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Private Diligence
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Watchlist &amp; Notes
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your confidential research repository. Notes are visible exclusively to your account.
            </p>
          </div>

          <Link
            href="/explore"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Explore More Opportunities
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading your saved watchlist...</p>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Your watchlist is currently empty</h3>
            <p className="text-xs text-slate-500 mb-6">
              Browse approved opportunities and bookmark businesses to keep track of your diligence notes.
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
            {watchlist.map((item) => {
              const opp = item.opportunity;
              const isEditingNote = editingNoteId === item.businessProfileId;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row gap-6 justify-between"
                >
                  {/* Left Column: Business Summary */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                        {opp.industry}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {opp.businessStage}
                      </span>
                      {opp.verificationStatus === 'VERIFIED' ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Information Verified
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </div>

                    <div>
                      <Link href={`/opportunity/${opp.id}`} className="hover:text-blue-600 transition">
                        <h2 className="text-xl font-bold text-slate-900">{opp.companyName}</h2>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp.city}, {opp.country} • Operating {opp.yearsOperating} yrs • Seeking ₹{opp.fundingRequirement.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {opp.businessDescription}
                    </p>

                    {/* Private Diligence Notes Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Confidential Notes
                        </span>
                        {!isEditingNote && (
                          <button
                            onClick={() => {
                              setEditingNoteId(item.businessProfileId);
                              setNoteContent(item.privateNotes || '');
                            }}
                            className="text-[11px] text-blue-600 hover:underline font-medium"
                          >
                            {item.privateNotes ? 'Edit Note' : '+ Add Note'}
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Add your confidential research impressions, questions to ask the founder, or valuation benchmarks..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(item.businessProfileId)}
                              disabled={savingNote}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-700 flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 italic">
                          {item.privateNotes || 'No notes added yet. Click "+ Add Note" to record private diligence points.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Match Score */}
                  <div className="lg:w-64 flex flex-col justify-between items-start lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                    <MatchScoreBadge
                      score={opp.matchScore ?? 75}
                      breakdown={opp.matchBreakdown}
                      summaryExplanation={opp.matchSummary}
                      size="md"
                    />

                    <div className="w-full space-y-2">
                      <Link
                        href={`/opportunity/${opp.id}`}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
                      >
                        Research Dossier <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/dashboard/investor/compare?ids=${opp.id}`}
                        className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium text-center transition flex items-center justify-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" /> Compare Factuals
                      </Link>

                      <button
                        onClick={() => handleRemove(item.businessProfileId)}
                        className="w-full py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove from Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Shield,
  Save,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit State
  const [newStatus, setNewStatus] = useState('APPROVED');
  const [newVerification, setNewVerification] = useState('VERIFIED');
  const [newIsPublished, setNewIsPublished] = useState(true);
  const [adminNote, setAdminNote] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/opportunities?status=${selectedStatus}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedStatus]);

  const handleOpenEdit = (opp: any) => {
    setEditingId(opp.id);
    setNewStatus(opp.status);
    setNewVerification(opp.verificationStatus);
    setNewIsPublished(opp.isPublished);
    setVerificationNotes(opp.verificationNotes || '');
    setAdminNote('');
    setActionMsg(null);
  };

  const handleSaveDecision = async (id: string) => {
    setSaving(true);
    setActionMsg(null);

    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          verificationStatus: newVerification,
          isPublished: newIsPublished,
          verificationNotes,
          adminNote,
        }),
      });

      if (res.ok) {
        setActionMsg('Decision recorded and immutable audit log entry created.');
        setEditingId(null);
        fetchOpportunities();
      } else {
        setActionMsg('Failed to update opportunity.');
      }
    } catch (e) {
      console.error(e);
      setActionMsg('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link href="/admin" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                &larr; Admin Dashboard
              </Link>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                Executive Portfolio: BHAVANA (Co-Founder &amp; Head of Operations)
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Opportunity Verification &amp; Review Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Inspect submitted dossiers, assign audit verification states, and manage discovery publication.
            </p>
          </div>

          <button
            onClick={fetchOpportunities}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'All Profiles', val: 'ALL' },
            { label: 'Pending Review', val: 'UNDER_REVIEW' },
            { label: 'Submitted', val: 'SUBMITTED' },
            { label: 'Approved', val: 'APPROVED' },
            { label: 'Needs More Info', val: 'NEEDS_INFO' },
            { label: 'Rejected', val: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setSelectedStatus(tab.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedStatus === tab.val
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {actionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Opportunities Table / List */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading verification queue...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Queue is clear</h3>
            <p className="text-xs text-slate-500">
              No opportunities matching status "{selectedStatus}".
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {opportunities.map((opp) => {
              const isEditing = editingId === opp.id;

              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                          {opp.industry}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {opp.businessStage}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          opp.investmentModel === 'FIXED_RETURN'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}>
                          {opp.investmentModel === 'FIXED_RETURN'
                            ? `Fixed Return (${opp.proposedReturnRate || 16}% p.a.)`
                            : `Equity (${opp.equityOffered || 10}% Pool)`}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            opp.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : opp.status === 'UNDER_REVIEW' || opp.status === 'SUBMITTED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          Status: {opp.status}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            opp.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          Verification: {opp.verificationStatus}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            opp.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opp.isPublished ? 'Publicly Discoverable' : 'Hidden from Discovery'}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900">{opp.companyName}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Founder: {opp.founderName} ({opp.email}) • City: {opp.city}, {opp.country} • Registered: {new Date(opp.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/opportunity/${opp.id}`}
                        target="_blank"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Public Page
                      </Link>

                      <button
                        onClick={() => (isEditing ? setEditingId(null) : handleOpenEdit(opp))}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Review & Verify'}
                      </button>
                    </div>
                  </div>

                  {/* Summary & Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-0.5">Funding Sought</span>
                      <span className="text-sm font-bold text-slate-900">
                        ₹{opp.fundingRequirement.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-0.5">Reported Revenue</span>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {opp.revenueStatus}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-0.5">Operating Profitability</span>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {opp.profitabilityStatus}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block mb-0.5">Operating Duration</span>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {opp.yearsOperating} yrs • {opp.teamSize} team members
                      </span>
                    </div>
                  </div>

                  {/* Pitch description */}
                  <div className="text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-1">Description:</p>
                    <p className="mb-2">{opp.businessDescription}</p>
                    <p className="font-semibold text-slate-900 mb-1">Problem &amp; Solution:</p>
                    <p>{opp.problem} &mdash; <em>Solution: {opp.solution}</em></p>
                  </div>

                  {/* Admin Notes Trail */}
                  {opp.adminNotes && opp.adminNotes.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Internal Admin Audit Notes
                      </h4>
                      {opp.adminNotes.map((note: any) => (
                        <div
                          key={note.id}
                          className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-950 flex items-start justify-between"
                        >
                          <div>
                            <span className="font-bold">{note.author?.name || 'Admin'}: </span>
                            <span>{note.note}</span>
                          </div>
                          <span className="text-[10px] text-amber-600">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Edit & Verification Controls */}
                  {isEditing && (
                    <div className="p-6 bg-slate-100/80 rounded-2xl border border-slate-300 space-y-4 animate-in fade-in">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        Admin Verification &amp; Publication Decision
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Application Status
                          </label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="NEEDS_INFO">NEEDS_INFO</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="DRAFT">DRAFT</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Verification State
                          </label>
                          <select
                            value={newVerification}
                            onChange={(e) => setNewVerification(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="NOT_REVIEWED">NOT_REVIEWED</option>
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="VERIFIED">VERIFIED (Information Verified)</option>
                            <option value="NEEDS_INFO">NEEDS_INFO</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Discovery Publication
                          </label>
                          <select
                            value={newIsPublished ? 'true' : 'false'}
                            onChange={(e) => setNewIsPublished(e.target.value === 'true')}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="true">Published (Visible in Explore)</option>
                            <option value="false">Private / Hidden</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Public Verification Note (Displayed on Opportunity Card)
                        </label>
                        <input
                          type="text"
                          value={verificationNotes}
                          onChange={(e) => setVerificationNotes(e.target.value)}
                          placeholder="e.g. MCA Certificate of Incorporation and GST filings verified by platform admin."
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Internal Admin Note (Immutable Audit Log entry)
                        </label>
                        <textarea
                          rows={2}
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Record review rationale, bank statement inspection notes, or risk flag context..."
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSaveDecision(opp.id)}
                          className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {saving ? 'Recording Audit...' : 'Commit Decision to Audit Log'}
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
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Clock,
  Bookmark,
  Scale,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { MatchScoreBadge } from './MatchScoreBadge';
import { FactorBreakdown } from '@/lib/matching';

export interface OpportunityCardData {
  id: string;
  companyName: string;
  industry: string;
  city: string;
  country: string;
  businessStage: string;
  fundingRequirement: number;
  revenueStatus: string;
  revenueDetails?: string | null;
  yearsOperating: number;
  businessDescription: string;
  verificationStatus: string;
  verificationNotes?: string | null;
  matchScore?: number;
  matchBreakdown?: FactorBreakdown[];
  matchSummary?: string;
  riskFlags?: Array<{ category: string; description: string; severity: string }>;
  isSaved?: boolean;
}

interface OpportunityCardProps {
  opportunity: OpportunityCardData;
  onToggleWatchlist?: (id: string, isSaved: boolean) => void;
  onToggleCompare?: (id: string) => void;
  isCompared?: boolean;
}

export function OpportunityCard({
  opportunity,
  onToggleWatchlist,
  onToggleCompare,
  isCompared = false,
}: OpportunityCardProps) {
  const [saved, setSaved] = useState(opportunity.isSaved || false);
  const [saving, setSaving] = useState(false);

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      const res = await fetch('/api/investor/watchlist', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessProfileId: opportunity.id }),
      });
      if (res.ok) {
        setSaved(!saved);
        if (onToggleWatchlist) onToggleWatchlist(opportunity.id, !saved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(opportunity.id);
  };

  // Verification Badge logic - Never fake verification
  const isVerified = opportunity.verificationStatus === 'VERIFIED';
  const isUnderReview = opportunity.verificationStatus === 'UNDER_REVIEW';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 card-hover p-6 flex flex-col justify-between relative shadow-sm">
      {/* Top Header: Industry, Match Score, Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {opportunity.industry}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {opportunity.businessStage}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCompareClick}
              className={`p-1.5 rounded-lg border text-xs transition ${
                isCompared
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleWatchlistClick}
              disabled={saving}
              className={`p-1.5 rounded-lg border text-xs transition ${
                saved
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title={saved ? 'Remove from saved watchlist' : 'Save to private research watchlist'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Company Title & Location */}
        <Link href={`/opportunity/${opportunity.id}`} className="group block mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
            {opportunity.companyName}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {opportunity.city}, {opportunity.country} • {opportunity.yearsOperating} yrs operating
          </p>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {opportunity.businessDescription}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 text-xs mb-4">
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-400 font-medium">Funding Sought</span>
            <span className="text-sm font-bold text-slate-900">
              ₹{opportunity.fundingRequirement.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-400 font-medium">Revenue Posture</span>
            <span className="text-xs font-semibold text-slate-800 truncate block">
              {opportunity.revenueStatus}
            </span>
          </div>
        </div>

        {/* Source-Verified Revenue Detail Note */}
        {opportunity.revenueDetails && (
          <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 mb-3 flex items-start gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 italic">{opportunity.revenueDetails}</span>
          </div>
        )}

        {/* Verification Status Badge */}
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-[11px] text-slate-400 font-medium">Verification Status:</span>
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> Information Verified
            </span>
          ) : isUnderReview ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Clock className="w-3 h-3" /> Pending Review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Self-Reported
            </span>
          )}
        </div>

        {/* Risk Indicators Tag if present */}
        {opportunity.riskFlags && opportunity.riskFlags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.riskFlags.slice(0, 1).map((flag, i) => (
              <span
                key={i}
                className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/70 px-2 py-0.5 rounded-md flex items-center gap-1 line-clamp-1"
                title={flag.description}
              >
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                {flag.category}: {flag.description}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer: Match Score Badge & Research CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <MatchScoreBadge
          score={opportunity.matchScore ?? 65}
          breakdown={opportunity.matchBreakdown}
          summaryExplanation={opportunity.matchSummary}
          size="sm"
        />

        <Link
          href={`/opportunity/${opportunity.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Research <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

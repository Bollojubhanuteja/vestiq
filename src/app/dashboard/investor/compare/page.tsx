'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MatchScoreBadge } from '@/components/MatchScoreBadge';
import {
  Scale,
  ShieldCheck,
  AlertCircle,
  Building2,
  Trash2,
  Plus,
  ArrowRight,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = (searchParams.get('ids') || '')
    .split(',')
    .filter((id) => id.trim().length > 0);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [comparisonItems, setComparisonItems] = useState<any[]>([]);
  const [allOpportunities, setAllOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all opportunities to allow adding items to compare
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch('/api/opportunities');
        if (res.ok) {
          const data = await res.json();
          setAllOpportunities(data.opportunities || []);
          // If no initial ids, pick first 2
          if (initialIds.length === 0 && data.opportunities?.length > 1) {
            setSelectedIds([data.opportunities[0].id, data.opportunities[1].id]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Fetch comparison matrix whenever selectedIds change
  useEffect(() => {
    async function fetchComparison() {
      if (selectedIds.length === 0) {
        setComparisonItems([]);
        return;
      }

      try {
        const res = await fetch('/api/investor/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds }),
        });
        if (res.ok) {
          const data = await res.json();
          setComparisonItems(data.comparison || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchComparison();
  }, [selectedIds]);

  const handleRemoveItem = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleAddOpportunity = (id: string) => {
    if (selectedIds.length >= 3) {
      alert('You can compare a maximum of 3 opportunities at once.');
      return;
    }
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Preparing comparison matrix...</p>
      </div>
    );
  }

  const availableToAdd = allOpportunities.filter((o) => !selectedIds.includes(o.id));

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Factual Benchmarking
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Compare Opportunities Side-by-Side
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Evaluate structured business metrics, funding requests, and stated operational risks across up to 3 ventures.
            </p>
          </div>

          {/* Add Opportunity Dropdown */}
          {selectedIds.length < 3 && availableToAdd.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Add to Compare:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddOpportunity(e.target.value);
                  e.target.value = '';
                }}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Opportunity...</option>
                {availableToAdd.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.companyName} ({opp.industry})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Clear Mandatory Disclaimer Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Objective Comparison Notice: </strong>
            "Compare information and conduct your own research. Vestiq does not calculate an artificial 'best investment' recommendation."
          </p>
        </div>

        {comparisonItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No opportunities selected</h3>
            <p className="text-xs text-slate-500 mb-6">
              Select 2 or 3 opportunities to benchmark funding requirements, traction, and risk profiles.
            </p>
            <Link
              href="/explore"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Select from Explore
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 w-48 font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                      Comparison Dimension
                    </th>
                    {comparisonItems.map((item) => (
                      <th key={item.id} className="p-4 min-w-[260px] font-bold text-slate-900 align-top">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            href={`/opportunity/${item.id}`}
                            className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition"
                          >
                            {item.companyName}
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <MatchScoreBadge
                          score={item.preferenceMatchScore}
                          breakdown={item.preferenceBreakdown}
                          size="sm"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* 1. Industry */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Industry</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4 font-bold text-slate-900">
                        {item.industry}
                      </td>
                    ))}
                  </tr>

                  {/* 2. Stage */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Business Stage</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-[11px] border border-blue-100">
                          {item.businessStage}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 3. Location */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Location</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4 text-slate-800">
                        {item.location}
                      </td>
                    ))}
                  </tr>

                  {/* 4. Funding Requirement */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Funding Requirement</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4 text-sm font-extrabold text-blue-600">
                        {item.fundingFormatted}
                      </td>
                    ))}
                  </tr>

                  {/* 5. Revenue Status & Provenance */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Revenue Posture &amp; Note</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4">
                        <span className="font-bold text-slate-900 block mb-0.5">{item.revenueStatus}</span>
                        <span className="text-[11px] text-slate-500 italic block">{item.revenueDetails}</span>
                      </td>
                    ))}
                  </tr>

                  {/* 6. Profitability */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Profitability Status</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-slate-800">
                        {item.profitabilityStatus}
                      </td>
                    ))}
                  </tr>

                  {/* 7. Age & Team */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Age &amp; Team Size</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4">
                        {item.businessAge} operating • {item.teamSize}
                      </td>
                    ))}
                  </tr>

                  {/* 8. Traction */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Reported Traction</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4 leading-relaxed text-slate-600">
                        {item.customerTraction}
                      </td>
                    ))}
                  </tr>

                  {/* 9. Funding Use */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Planned Use of Funds</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4 leading-relaxed text-slate-600">
                        {item.intendedUseOfFunds}
                      </td>
                    ))}
                  </tr>

                  {/* 10. Risk Indicators */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Known Risk Factors</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4">
                        {item.riskIndicators && item.riskIndicators.length > 0 ? (
                          <ul className="space-y-1 text-[11px] text-amber-900">
                            {item.riskIndicators.map((risk: string, i: number) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-amber-500">•</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400 italic">Standard early-stage risks</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 11. Verification */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/30">Verification Status</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4">
                        {item.verificationStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" /> Information Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 12. Actions */}
                  <tr className="bg-slate-50/60">
                    <td className="p-4 font-semibold text-slate-500">Diligence Next Step</td>
                    {comparisonItems.map((item) => (
                      <td key={item.id} className="p-4">
                        <Link
                          href={`/opportunity/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Open Dossier &amp; Diligence <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <p className="text-xs text-slate-500">Loading comparison matrix...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}


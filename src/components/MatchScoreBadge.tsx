'use client';

import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { FactorBreakdown } from '@/lib/matching';

interface MatchScoreBadgeProps {
  score: number;
  breakdown?: FactorBreakdown[];
  summaryExplanation?: string;
  size?: 'sm' | 'md' | 'lg';
  showExplainButton?: boolean;
}

export function MatchScoreBadge({
  score,
  breakdown = [],
  summaryExplanation,
  size = 'md',
  showExplainButton = true,
}: MatchScoreBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Color gradient based on compatibility level
  let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  let dotColor = 'bg-blue-500';
  if (score >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (score < 50) {
    badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-xs font-semibold px-3 py-1.5',
    lg: 'text-sm font-semibold px-3.5 py-2',
  };

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-full border ${badgeColor} ${sizeClasses[size]} hover:shadow-sm transition cursor-pointer`}
          title="Click to see transparent breakdown of this preference match"
        >
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span>Preference Match: {score}%</span>
          {showExplainButton && (
            <HelpCircle className="w-3.5 h-3.5 opacity-70 hover:opacity-100 ml-0.5" />
          )}
        </button>
      </div>

      {/* Explanation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {score}%
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Preference Compatibility Breakdown
                </h3>
                <p className="text-xs text-slate-500">Transparent Rule-Based Calculation</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Important:</strong> This score represents compatibility with your saved investment preferences. It is <strong>NOT</strong> an investment recommendation, success probability, or prediction of financial return.
              </p>
            </div>

            {summaryExplanation && (
              <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {summaryExplanation}
              </p>
            )}

            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Factor Weight Breakdown
              </h4>

              {breakdown && breakdown.length > 0 ? (
                breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-medium mb-1">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        {item.matched ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        {item.factor}
                      </span>
                      <span className="text-slate-600 font-semibold">
                        {item.pointsEarned} / {item.maxPoints} pts ({item.weightPct}% weight)
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.scorePct >= 80
                            ? 'bg-emerald-500'
                            : item.scorePct >= 50
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(5, item.scorePct)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.explanation}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-lg text-center">
                  Standard baseline calculation. Sign in and set your investor preferences in your profile to customize this score.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

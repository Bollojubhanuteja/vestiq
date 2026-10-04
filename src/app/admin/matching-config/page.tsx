'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sliders, Save, CheckCircle2, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminMatchingConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [industryWeight, setIndustryWeight] = useState(25);
  const [amountWeight, setAmountWeight] = useState(20);
  const [stageWeight, setStageWeight] = useState(15);
  const [geoWeight, setGeoWeight] = useState(10);
  const [horizonWeight, setHorizonWeight] = useState(15);
  const [riskWeight, setRiskWeight] = useState(15);

  const total =
    industryWeight + amountWeight + stageWeight + geoWeight + horizonWeight + riskWeight;

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/matching-config');
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            const c = data.config;
            setIndustryWeight(Math.round(c.industryWeight * 100));
            setAmountWeight(Math.round(c.amountWeight * 100));
            setStageWeight(Math.round(c.stageWeight * 100));
            setGeoWeight(Math.round(c.geoWeight * 100));
            setHorizonWeight(Math.round(c.horizonWeight * 100));
            setRiskWeight(Math.round(c.riskWeight * 100));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/matching-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryWeight: industryWeight / 100,
          amountWeight: amountWeight / 100,
          stageWeight: stageWeight / 100,
          geoWeight: geoWeight / 100,
          horizonWeight: horizonWeight / 100,
          riskWeight: riskWeight / 100,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Matching weights updated and committed to audit log. Discovery ranking updated.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading matching configuration...</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 inline-block">
            &larr; Admin Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
              Executive Portfolio: BOLLOJU BHANU TEJA (Founder &amp; Chief Platform Architect)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Matching Engine Weight Calibration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the deterministic weights applied by the preference calculation engine across the entire platform.
          </p>
        </div>

        {/* Legal Reminder Box */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Regulatory Standard: </strong>
            Matching weights only adjust preference alignment indexes. The system must never claim that weights predict company returns, financial solvency, or investment success.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Factor Calibration (Percentage Weights)
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                total === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              Total Weight: {total}% {total !== 100 && '(Normalizes proportionally)'}
            </span>
          </div>

          <div className="space-y-5 text-xs">
            {/* 1. Industry */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>1. Industry Alignment Weight</span>
                <span>{industryWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={industryWeight}
                onChange={(e) => setIndustryWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Measures exact overlap with investor target sectors.</p>
            </div>

            {/* 2. Amount */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>2. Ticket Size &amp; Amount Compatibility</span>
                <span>{amountWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={amountWeight}
                onChange={(e) => setAmountWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Checks if startup funding request fits investor ticket envelope.</p>
            </div>

            {/* 3. Stage */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>3. Business Stage Alignment</span>
                <span>{stageWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={stageWeight}
                onChange={(e) => setStageWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Seed, Early Stage, Growth, Expansion stage fit.</p>
            </div>

            {/* 4. Geography */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>4. Geographic Alignment</span>
                <span>{geoWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={geoWeight}
                onChange={(e) => setGeoWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Country and regional jurisdiction alignment.</p>
            </div>

            {/* 5. Horizon */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>5. Investment Horizon Compatibility</span>
                <span>{horizonWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={horizonWeight}
                onChange={(e) => setHorizonWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Correlates venture maturity with investor liquidity timeframe.</p>
            </div>

            {/* 6. Risk Profile */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>6. Stated Risk Tolerance Fit</span>
                <span>{riskWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={riskWeight}
                onChange={(e) => setRiskWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Evaluates operational uncertainty against stated tolerance.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Updating...' : 'Save & Deploy Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

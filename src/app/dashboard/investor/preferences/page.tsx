'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, CheckCircle2, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';

const INDUSTRIES_LIST = [
  'Technology',
  'AI',
  'Agriculture',
  'Healthcare',
  'Education',
  'FinTech',
  'E-commerce',
  'SaaS',
  'Manufacturing',
  'Energy',
  'Climate',
  'Logistics',
  'Other',
];

const HORIZONS_LIST = ['<1 year', '1–3 years', '3–5 years', '5+ years'];
const STAGES_LIST = ['Pre-seed', 'Seed', 'Early Stage', 'Growth', 'Expansion', 'Mature'];

export default function PreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [minInvestment, setMinInvestment] = useState(250000);
  const [maxInvestment, setMaxInvestment] = useState(5000000);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>(['India']);
  const [selectedHorizons, setSelectedHorizons] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState<'LOWER' | 'MODERATE' | 'HIGHER'>('MODERATE');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [revenuePreference, setRevenuePreference] = useState('ANY');
  const [profitabilityPreference, setProfitabilityPreference] = useState('ANY');

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch('/api/investor/preferences');
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            const p = data.preferences;
            setMinInvestment(p.minInvestment);
            setMaxInvestment(p.maxInvestment);
            setSelectedIndustries(p.industries || []);
            setSelectedGeographies(p.geographies || ['India']);
            setSelectedHorizons(p.horizons || []);
            setRiskTolerance(p.riskTolerance || 'MODERATE');
            setSelectedStages(p.stages || []);
            setRevenuePreference(p.revenuePreference || 'ANY');
            setProfitabilityPreference(p.profitabilityPreference || 'ANY');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPrefs();
  }, []);

  const toggleIndustry = (ind: string) => {
    if (selectedIndustries.includes(ind)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== ind));
    } else {
      setSelectedIndustries([...selectedIndustries, ind]);
    }
  };

  const toggleHorizon = (h: string) => {
    if (selectedHorizons.includes(h)) {
      setSelectedHorizons(selectedHorizons.filter((item) => item !== h));
    } else {
      setSelectedHorizons([...selectedHorizons, h]);
    }
  };

  const toggleStage = (s: string) => {
    if (selectedStages.includes(s)) {
      setSelectedStages(selectedStages.filter((item) => item !== s));
    } else {
      setSelectedStages([...selectedStages, s]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/investor/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minInvestment,
          maxInvestment,
          industries: selectedIndustries,
          geographies: selectedGeographies,
          horizons: selectedHorizons,
          riskTolerance,
          stages: selectedStages,
          revenuePreference,
          profitabilityPreference,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Preferences updated! Preference match scores across the platform have been re-indexed.');
      } else {
        setErrorMsg('Failed to update preferences.');
      }
    } catch {
      setErrorMsg('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Matching Configuration
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Investor Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updating your parameters recalibrates the Preference Match score on all opportunities.
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Transparent Alignment Notice: </strong>
            "Your profile helps us organize opportunities according to your stated preferences. A match does not mean an opportunity is suitable or profitable."
          </p>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Ticket Size Range */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">1. Preferred Ticket Size Range</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Min Ticket (₹)</label>
                <input
                  type="number"
                  step="50000"
                  value={minInvestment}
                  onChange={(e) => setMinInvestment(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Max Ticket (₹)</label>
                <input
                  type="number"
                  step="100000"
                  value={maxInvestment}
                  onChange={(e) => setMaxInvestment(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Target Industries */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-2">2. Target Focus Industries</h2>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES_LIST.map((ind) => {
                const isSelected = selectedIndustries.includes(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => toggleIndustry(ind)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-2">3. Preferred Company Stages</h2>
            <div className="flex flex-wrap gap-2">
              {STAGES_LIST.map((stg) => {
                const isSelected = selectedStages.includes(stg);
                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => toggleStage(stg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {stg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizon & Risk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-2">4. Investment Horizon</h2>
              <div className="grid grid-cols-2 gap-2">
                {HORIZONS_LIST.map((h) => {
                  const isSelected = selectedHorizons.includes(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => toggleHorizon(h)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-2">5. Risk Tolerance</h2>
              <div className="grid grid-cols-3 gap-2">
                {(['LOWER', 'MODERATE', 'HIGHER'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRiskTolerance(r)}
                    className={`p-2 rounded-xl text-xs font-semibold border text-center transition ${
                      riskTolerance === r
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r === 'LOWER' ? 'Lower' : r === 'MODERATE' ? 'Moderate' : 'Higher'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              {saving ? 'Updating...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

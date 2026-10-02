'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sliders, Sparkles, ArrowRight, ShieldCheck, Check, Layers, BarChart3, TrendingUp, Building2, MapPin } from 'lucide-react';

interface OpportunityPreview {
  id: string;
  name: string;
  industry: string;
  stage: string;
  city: string;
  funding: number;
  highlight: string;
}

const SAMPLE_OPPORTUNITIES: OpportunityPreview[] = [
  {
    id: 'codecraft',
    name: 'CodeCraft DevTools',
    industry: 'Technology',
    stage: 'Seed',
    city: 'Gurugram',
    funding: 7500000,
    highlight: '28% MoM MRR growth, 118% Net Revenue Retention, verified ARR.',
  },
  {
    id: 'agripulse',
    name: 'AgriPulse Technologies',
    industry: 'AgriTech',
    stage: 'Early Traction',
    city: 'Pune',
    funding: 15000000,
    highlight: '14,000+ active farmers, 3x revenue expansion, zero toxic dead equity.',
  },
  {
    id: 'solarpure',
    name: 'SolarPure Energy',
    industry: 'CleanTech',
    stage: 'Growth',
    city: 'Bengaluru',
    funding: 30000000,
    highlight: 'Patent-pending micro-inverter efficiency, 18 months runway.',
  },
  {
    id: 'finflow',
    name: 'FinPulse Systems',
    industry: 'FinTech',
    stage: 'Seed',
    city: 'Mumbai',
    funding: 10000000,
    highlight: 'Real-time SME treasury management, audited banking logs.',
  },
];

function formatCheckSize(val: number): string {
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  const l = val / 100000;
  return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} Lakhs`;
}

function formatMRR(val: number): string {
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (val >= 100000) {
    const l = val / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} Lakhs`;
  }
  return `₹${(val / 1000).toFixed(0)}k`;
}

export function ThesisMatcherWidget() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Technology');
  const [selectedCheckSize, setSelectedCheckSize] = useState<number>(2500000);
  const [selectedStage, setSelectedStage] = useState<string>('Seed');
  const [selectedRisk, setSelectedRisk] = useState<string>('Moderate');
  const [mode, setMode] = useState<'investor' | 'founder'>('investor');

  // Founder mode state
  const [founderMrr, setFounderMrr] = useState<number>(300000);
  const [founderGrowth, setFounderGrowth] = useState<number>(20);
  const [founderRunway, setFounderRunway] = useState<number>(12);

  // Calculate dynamic match score
  const matchResult = useMemo(() => {
    // Find best candidate
    const candidate =
      SAMPLE_OPPORTUNITIES.find(o => o.industry.toLowerCase() === selectedIndustry.toLowerCase()) ||
      SAMPLE_OPPORTUNITIES[0];

    // Calculate score component
    let industryScore = candidate.industry.toLowerCase() === selectedIndustry.toLowerCase() ? 30 : 15;
    let stageScore = candidate.stage.toLowerCase() === selectedStage.toLowerCase() ? 25 : 15;
    let checkScore = selectedCheckSize >= 500000 && selectedCheckSize <= 5000000 ? 25 : 16;
    let riskScore = selectedRisk === 'Moderate' ? 14 : 10;

    const totalScore = Math.min(98, Math.max(62, industryScore + stageScore + checkScore + riskScore));

    return {
      candidate,
      score: totalScore,
      industryMatch: candidate.industry.toLowerCase() === selectedIndustry.toLowerCase(),
      stageMatch: candidate.stage.toLowerCase() === selectedStage.toLowerCase(),
    };
  }, [selectedIndustry, selectedCheckSize, selectedStage, selectedRisk]);

  // Founder readiness score
  const founderReadinessScore = useMemo(() => {
    let score = 50;
    if (founderMrr >= 200000) score += 15;
    if (founderMrr >= 1000000) score += 10;
    if (founderGrowth >= 15) score += 15;
    if (founderGrowth >= 25) score += 5;
    if (founderRunway >= 9) score += 10;
    return Math.min(96, score);
  }, [founderMrr, founderGrowth, founderRunway]);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-slate-900 to-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Live Algorithm Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Test Your Investment Thesis in Real Time
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            See how Vestiq’s deterministic preference engine scores opportunities against your exact check size, sector, and stage criteria.
          </p>

          {/* Toggle Investor vs Founder */}
          <div className="inline-flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700 mt-6">
            <button
              onClick={() => setMode('investor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'investor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              For Angel Investors
            </button>
            <button
              onClick={() => setMode('founder')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'founder'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              For Startup Founders
            </button>
          </div>
        </div>

        {/* INVESTOR MODE */}
        {mode === 'investor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Controls: 7 cols */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* 1. Target Sector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                    1. Target Sector / Industry
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Technology', 'FinTech', 'CleanTech', 'AgriTech'].map(ind => (
                      <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                          selectedIndustry === ind
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Check Size */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      2. Your Target Check Size
                    </label>
                    <span className="font-mono text-cyan-400 font-bold text-sm bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-lg">
                      {formatCheckSize(selectedCheckSize)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200000"
                    max="10000000"
                    step="100000"
                    value={selectedCheckSize}
                    onChange={e => setSelectedCheckSize(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>₹2 Lakhs (Micro Angel)</span>
                    <span>₹25 Lakhs (Standard)</span>
                    <span>₹1 Crore+ (Syndicate)</span>
                  </div>
                </div>

                {/* 3. Stage & Risk in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      3. Preferred Stage
                    </label>
                    <div className="flex gap-2">
                      {['Seed', 'Early Traction', 'Growth'].map(stg => (
                        <button
                          key={stg}
                          onClick={() => setSelectedStage(stg)}
                          className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-semibold border transition ${
                            selectedStage === stg
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {stg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      4. Risk Tolerance
                    </label>
                    <div className="flex gap-2">
                      {['Conservative', 'Moderate', 'Aggressive'].map(r => (
                        <button
                          key={r}
                          onClick={() => setSelectedRisk(r)}
                          className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-semibold border transition ${
                            selectedRisk === r
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Informational reassurance */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic rule-based score calculation • Non-custodial research tool</span>
              </div>
            </div>

            {/* Right Result Card: 5 cols */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-800/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
              <div>
                {/* Score badge & gauge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Top Aligned Match</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                      {matchResult.candidate.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {matchResult.candidate.city}, India
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                        {matchResult.candidate.stage}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-[10px] font-semibold text-cyan-300 font-mono">
                        {formatCheckSize(matchResult.candidate.funding)} Ask
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono">
                      {matchResult.score}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Thesis Fit
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-3 mt-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Sector Fit ({matchResult.candidate.industry})</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {matchResult.industryMatch ? '100%' : '50%'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: matchResult.industryMatch ? '100%' : '50%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Check Size Compatibility</span>
                      <span className="font-mono text-emerald-400 font-bold">100%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Stage Alignment ({matchResult.candidate.stage})</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {matchResult.stageMatch ? '100%' : '60%'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: matchResult.stageMatch ? '100%' : '60%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Diligence Highlight */}
                <div className="mt-5 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Diligence Highlight
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {matchResult.candidate.highlight}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <Link
                  href="/register?role=INVESTOR"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
                >
                  Save Thesis &amp; View 13-Dimension Matrix
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/explore"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  Browse All Live Opportunities
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* FOUNDER MODE */}
        {mode === 'founder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Founder Controls: 7 cols */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Calculate Your Data Room &amp; Diligence Readiness
                  </h3>
                  <p className="text-xs text-slate-400">
                    See how your startup ranks against what angel investors and venture syndicates look for during due diligence.
                  </p>
                </div>

                {/* MRR Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Current Monthly Recurring Revenue (MRR)
                    </label>
                    <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                      {formatMRR(founderMrr)} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={founderMrr}
                    onChange={e => setFounderMrr(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>₹50k / mo</span>
                    <span>₹25 Lakhs / mo</span>
                    <span>₹50 Lakhs / mo</span>
                  </div>
                </div>

                {/* MoM Growth Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Month-over-Month Revenue Growth
                    </label>
                    <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                      +{founderGrowth}% MoM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={founderGrowth}
                    onChange={e => setFounderGrowth(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Runway Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Current Runway Available
                    </label>
                    <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                      {founderRunway} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    step="1"
                    value={founderRunway}
                    onChange={e => setFounderRunway(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Transparent verification signals: Vestiq helps verified founders skip 60+ hours of misaligned pitch calls.
              </div>
            </div>

            {/* Founder Score Output: 5 cols */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Diligence Score</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Angel Readiness</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
                      {founderReadinessScore}/100
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      High Conviction
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Traction metrics place your business in top 15% of seed pitches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Runway profile meets standard Series A lead investor timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Compatible with 140+ active angel syndicate theses on Vestiq</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <Link
                  href="/register?role=BUSINESS"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  List Your Startup on Vestiq
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="text-center text-[10px] text-slate-400">
                  No fees to submit • Zero equity taken • Strict non-custodial diligence
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

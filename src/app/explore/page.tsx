'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OpportunityCard, OpportunityCardData } from '@/components/OpportunityCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Scale,
  X,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
  Percent,
  TrendingUp,
  Building2,
  Sparkles
} from 'lucide-react';

const INDUSTRIES = [
  'All',
  'Technology',
  'AI',
  'CleanTech',
  'HealthTech',
  'AgriTech',
  'Logistics',
  'Manufacturing',
  'FinTech',
  'Robotics',
  'DevSecOps',
  'Other',
];

const STAGES = ['All', 'Seed', 'Early Stage', 'Growth', 'Expansion', 'Mature'];

const REVENUE_OPTIONS = [
  'All',
  'Pre-revenue',
  '₹1L - ₹10L/mo',
  '₹10L - ₹50L/mo',
  '₹50L+/mo',
];

const PROFITABILITY_OPTIONS = [
  'All',
  'Profitable',
  'Near Break-even',
  'Loss-making',
  'Early Stage',
];

const SORT_OPTIONS = [
  { value: 'match', label: 'Best Preference Match' },
  { value: 'returnDesc', label: 'Fixed Return: High to Low (% p.a.)' },
  { value: 'equityDesc', label: 'Equity Pool: High to Low (%)' },
  { value: 'newest', label: 'Newest Submissions' },
  { value: 'fundingAsc', label: 'Funding Requirement: Low to High' },
  { value: 'fundingDesc', label: 'Funding Requirement: High to Low' },
  { value: 'industry', label: 'Industry Name' },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get('model') || 'ALL';

  const [opportunities, setOpportunities] = useState<OpportunityCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedRevenue, setSelectedRevenue] = useState('All');
  const [selectedProfitability, setSelectedProfitability] = useState('All');
  const [selectedVerification, setSelectedVerification] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [hasPersonalizedMatches, setHasPersonalizedMatches] = useState(false);

  useEffect(() => {
    const urlModel = searchParams.get('model');
    if (urlModel) {
      setSelectedModel(urlModel);
    }
  }, [searchParams]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedModel && selectedModel !== 'ALL') params.set('model', selectedModel);
      if (selectedIndustry !== 'All') params.set('industry', selectedIndustry);
      if (selectedStage !== 'All') params.set('stage', selectedStage);
      if (selectedRevenue !== 'All') params.set('revenueStatus', selectedRevenue);
      if (selectedProfitability !== 'All') params.set('profitabilityStatus', selectedProfitability);
      if (selectedVerification !== 'All') params.set('verificationStatus', selectedVerification);
      params.set('sortBy', sortBy);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
        setHasPersonalizedMatches(data.hasPersonalizedMatches || false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [
    selectedModel,
    selectedIndustry,
    selectedStage,
    selectedRevenue,
    selectedProfitability,
    selectedVerification,
    sortBy,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleToggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 opportunities simultaneously.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedModel('ALL');
    setSelectedIndustry('All');
    setSelectedStage('All');
    setSelectedRevenue('All');
    setSelectedProfitability('All');
    setSelectedVerification('All');
    setSortBy('match');
  };

  // Counts for tabs
  const fixedCount = opportunities.filter((o) => o.investmentModel === 'FIXED_RETURN').length;
  const equityCount = opportunities.filter((o) => o.investmentModel === 'EQUITY').length;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Institutional Diligence Discovery
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Business Opportunities
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Filter verified businesses in India across Fixed Return funding (14%–18% p.a.) and Direct Equity partnerships.
              </p>
            </div>

            {/* Legal match notice */}
            <div className="text-xs text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 shadow-sm">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                {hasPersonalizedMatches
                  ? 'Scores reflect compatibility with your saved investor preferences.'
                  : 'Scores shown are baseline estimates. Log in as an investor to personalize.'}
              </span>
            </div>
          </div>
        </div>

        {/* Investment Model Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setSelectedModel('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedModel === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Models
          </button>

          <button
            onClick={() => setSelectedModel('FIXED_RETURN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedModel === 'FIXED_RETURN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            Fixed Return Funding (14%–18% p.a.)
          </button>

          <button
            onClick={() => setSelectedModel('EQUITY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedModel === 'EQUITY'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Equity &amp; Direct Partnership
          </button>
        </div>

        {/* Search & Main Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by company name, keywords, problem, tech stack, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
              title="Reset all filters"
            >
              Reset
            </button>
          </form>

          {/* Quick Filter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100 text-xs">
            {/* Industry */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            {/* Revenue */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Revenue Posture</label>
              <select
                value={selectedRevenue}
                onChange={(e) => setSelectedRevenue(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                {REVENUE_OPTIONS.map((rev) => (
                  <option key={rev} value={rev}>
                    {rev}
                  </option>
                ))}
              </select>
            </div>

            {/* Profitability */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Profitability</label>
              <select
                value={selectedProfitability}
                onChange={(e) => setSelectedProfitability(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                {PROFITABILITY_OPTIONS.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Verification Status</label>
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="VERIFIED">ROC &amp; MCA Verified</option>
                <option value="UNDER_REVIEW">Pending Review</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sort Results By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid / Empty State */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No matching opportunities found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try switching your investment model filter or clearing keyword search to see more verified businesses.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
              <span>Showing {opportunities.length} approved opportunity profiles</span>
              <span>Sorted by {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedIds.includes(opp.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Floating Side-by-Side Comparison Drawer */}
        {comparedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold">
                {comparedIds.length} / 3 Opportunities Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/investor/compare?ids=${comparedIds.join(',')}`}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                Compare Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setComparedIds([])}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Clear comparison"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading discovery engine...</p>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}

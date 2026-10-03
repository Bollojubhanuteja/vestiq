'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OpportunityCard, OpportunityCardData } from '@/components/OpportunityCard';
import {
  Compass,
  Bookmark,
  Send,
  Scale,
  Sparkles,
  Sliders,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<OpportunityCardData[]>([]);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [interestsCount, setInterestsCount] = useState(0);
  const [totalIntended, setTotalIntended] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meRes, oppRes, wlRes, reqRes, intRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/opportunities?sortBy=match'),
          fetch('/api/investor/watchlist'),
          fetch('/api/investor/requests'),
          fetch('/api/investor/interests'),
        ]);

        if (!meRes.ok) {
          router.push('/login?redirect=/dashboard/investor');
          return;
        }

        const meData = await meRes.json();
        if (meData.user?.role !== 'INVESTOR' && meData.user?.role !== 'ADMIN') {
          router.push('/');
          return;
        }
        setUser(meData.user);

        if (oppRes.ok) {
          const oppData = await oppRes.json();
          setOpportunities(oppData.opportunities || []);
        }

        if (wlRes.ok) {
          const wlData = await wlRes.json();
          setWatchlistCount(wlData.watchlist?.length || 0);
        }

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequestsCount(reqData.requests?.length || 0);
        }

        if (intRes.ok) {
          const intData = await intRes.json();
          setInterestsCount(intData.interests?.length || 0);
          const total = (intData.interests || []).reduce((acc: number, curr: any) => acc + (curr.intendedAmount || 0), 0);
          setTotalIntended(total);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading your investor workspace...</p>
      </div>
    );
  }

  // Count opportunities with strong preference alignment (> 75%)
  const matchedOpps = opportunities.filter((o) => (o.matchScore ?? 0) >= 75);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Investor Workspace
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {user?.name || 'Investor'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Discover opportunities organized by your stated criteria and manage your diligence pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/investor/preferences"
              className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" /> Adjust Match Criteria
            </Link>
            <Link
              href="/explore"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" /> Explore All
            </Link>
          </div>
        </div>

        {/* Real Metrics Cards - Strictly NO fake financial returns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/dashboard/investor/requests"
            className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 shadow-sm hover:border-blue-400 transition block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900">Active Interests &amp; Deals</span>
              <Send className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-950">{interestsCount}</div>
            <p className="text-[11px] text-blue-700 font-medium mt-1">
              ₹{(totalIntended / 100000).toFixed(totalIntended % 100000 === 0 ? 0 : 1)}L total check allocation &rarr;
            </p>
          </Link>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Matching Preferences</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{matchedOpps.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Opportunities with &ge;75% match</p>
          </div>

          <Link
            href="/dashboard/investor/watchlist"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Saved in Watchlist</span>
              <Bookmark className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{watchlistCount}</div>
            <p className="text-[11px] text-blue-600 font-medium mt-1">View saved dossiers &rarr;</p>
          </Link>

          <Link
            href="/dashboard/investor/requests"
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Diligence Inquiries</span>
              <Send className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{requestsCount}</div>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Track founder replies &rarr;</p>
          </Link>
        </div>

        {/* Preference Compatibility Notice */}
        <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl mb-8 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <strong>Note on Compatibility Scores: </strong>
            Scores reflect rule-based compatibility with your specified ticket size, sectors, and stage. A high score is not an investment recommendation or indication of future profitability.
          </p>
        </div>

        {/* Top Matched Opportunities */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recommended by Preference Alignment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sorted by highest alignment with your investment parameters.
              </p>
            </div>
            <Link
              href="/explore?sortBy=match"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View full discovery directory &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.slice(0, 6).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

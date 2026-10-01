import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { calculatePreferenceMatch, DEFAULT_WEIGHTS } from '@/lib/matching';
import { trackEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 3) {
      return NextResponse.json(
        { error: 'You can compare between 1 and 3 opportunities.' },
        { status: 400 }
      );
    }

    // Fetch investor preferences if logged in
    let investorPrefs: any = null;
    if (session?.role === 'INVESTOR') {
      const profile = await db.investorProfile.findUnique({
        where: { userId: session.userId },
        include: { preferences: true },
      });
      if (profile?.preferences) {
        investorPrefs = {
          minInvestment: profile.preferences.minInvestment,
          maxInvestment: profile.preferences.maxInvestment,
          industries: JSON.parse(profile.preferences.industries || '[]'),
          geographies: JSON.parse(profile.preferences.geographies || '[]'),
          horizons: JSON.parse(profile.preferences.horizons || '[]'),
          riskTolerance: profile.preferences.riskTolerance,
          stages: JSON.parse(profile.preferences.stages || '[]'),
        };
      }
    }

    const opportunities = await db.businessProfile.findMany({
      where: {
        id: { in: ids },
        status: 'APPROVED',
        isPublished: true,
      },
      include: {
        riskFlags: {
          where: { isPublic: true },
        },
      },
    });

    const comparisonItems = opportunities.map(opp => {
      const match = calculatePreferenceMatch(investorPrefs, opp, DEFAULT_WEIGHTS);
      return {
        id: opp.id,
        companyName: opp.companyName,
        founderName: opp.founderName,
        industry: opp.industry,
        businessStage: opp.businessStage,
        location: `${opp.city}, ${opp.country}`,
        fundingRequirement: opp.fundingRequirement,
        fundingFormatted: `₹${opp.fundingRequirement.toLocaleString('en-IN')}`,
        revenueStatus: opp.revenueStatus,
        revenueDetails: opp.revenueDetails || 'Self-reported by founder',
        profitabilityStatus: opp.profitabilityStatus,
        businessAge: `${opp.yearsOperating} years`,
        teamSize: `${opp.teamSize} members`,
        customerTraction: opp.customerTraction || 'Information disclosed during diligence',
        intendedUseOfFunds: opp.intendedUseOfFunds,
        riskIndicators: opp.riskFlags.map(r => `${r.category}: ${r.description}`),
        verificationStatus: opp.verificationStatus,
        preferenceMatchScore: match.score,
        preferenceBreakdown: match.breakdown,
      };
    });

    if (session?.userId) {
      await trackEvent('COMPARISON_USE', session.userId, null, { count: ids.length });
    }

    return NextResponse.json({
      comparison: comparisonItems,
      legalDisclaimer:
        'Compare factual information and conduct your own independent research. Vestiq does not calculate an artificial "best investment".',
    });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

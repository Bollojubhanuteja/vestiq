import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { calculatePreferenceMatch, MatchingWeights, DEFAULT_WEIGHTS } from '@/lib/matching';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const industry = searchParams.get('industry');
    const stage = searchParams.get('stage');
    const location = searchParams.get('location');
    const revenueStatus = searchParams.get('revenueStatus');
    const profitabilityStatus = searchParams.get('profitabilityStatus');
    const verificationStatus = searchParams.get('verificationStatus');
    const sortBy = searchParams.get('sortBy') || 'match';

    // Current session
    const session = await getSessionFromRequest(req);

    // Fetch active weights
    let weights: MatchingWeights = DEFAULT_WEIGHTS;
    try {
      const config = await db.matchingConfig.findUnique({ where: { id: 'default-config' } });
      if (config) {
        weights = {
          industryWeight: config.industryWeight,
          amountWeight: config.amountWeight,
          stageWeight: config.stageWeight,
          geoWeight: config.geoWeight,
          horizonWeight: config.horizonWeight,
          riskWeight: config.riskWeight,
        };
      }
    } catch {}

    // Fetch investor preferences & watchlist if logged in as investor
    let investorPrefs: any = null;
    let savedIds = new Set<string>();

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
          revenuePreference: profile.preferences.revenuePreference,
          profitabilityPreference: profile.preferences.profitabilityPreference,
        };
      }

      const watchlistItems = await db.watchlist.findMany({
        where: { userId: session.userId },
        select: { businessProfileId: true },
      });
      savedIds = new Set(watchlistItems.map(w => w.businessProfileId));
    }

    // Build Prisma query - STRICTLY APPROVED and PUBLISHED for public discovery
    const whereClause: any = {
      status: 'APPROVED',
      isPublished: true,
    };

    if (q) {
      whereClause.OR = [
        { companyName: { contains: q } },
        { industry: { contains: q } },
        { businessDescription: { contains: q } },
        { problem: { contains: q } },
        { solution: { contains: q } },
        { city: { contains: q } },
      ];
    }

    if (industry && industry !== 'All') {
      whereClause.industry = industry;
    }

    if (stage && stage !== 'All') {
      whereClause.businessStage = stage;
    }

    if (location && location !== 'All') {
      whereClause.country = { contains: location };
    }

    if (revenueStatus && revenueStatus !== 'All') {
      whereClause.revenueStatus = revenueStatus;
    }

    if (profitabilityStatus && profitabilityStatus !== 'All') {
      whereClause.profitabilityStatus = profitabilityStatus;
    }

    if (verificationStatus && verificationStatus !== 'All') {
      whereClause.verificationStatus = verificationStatus;
    }

    const opportunities = await db.businessProfile.findMany({
      where: whereClause,
      include: {
        riskFlags: {
          where: { isPublic: true },
          select: { category: true, description: true, severity: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute preference match score for each opportunity
    const computed = opportunities.map(opp => {
      const match = calculatePreferenceMatch(investorPrefs, opp, weights);
      return {
        id: opp.id,
        companyName: opp.companyName,
        industry: opp.industry,
        city: opp.city,
        country: opp.country,
        businessStage: opp.businessStage,
        fundingRequirement: opp.fundingRequirement,
        revenueStatus: opp.revenueStatus,
        revenueDetails: opp.revenueDetails,
        profitabilityStatus: opp.profitabilityStatus,
        yearsOperating: opp.yearsOperating,
        teamSize: opp.teamSize,
        businessDescription: opp.businessDescription,
        verificationStatus: opp.verificationStatus,
        verificationNotes: opp.verificationNotes,
        createdAt: opp.createdAt,
        updatedAt: opp.updatedAt,
        matchScore: match.score,
        matchBreakdown: match.breakdown,
        matchSummary: match.summaryExplanation,
        riskFlags: opp.riskFlags,
        isSaved: savedIds.has(opp.id),
      };
    });

    // Sorting
    if (sortBy === 'match') {
      computed.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    } else if (sortBy === 'newest') {
      computed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'fundingAsc') {
      computed.sort((a, b) => a.fundingRequirement - b.fundingRequirement);
    } else if (sortBy === 'fundingDesc') {
      computed.sort((a, b) => b.fundingRequirement - a.fundingRequirement);
    } else if (sortBy === 'industry') {
      computed.sort((a, b) => a.industry.localeCompare(b.industry));
    } else if (sortBy === 'updated') {
      computed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    return NextResponse.json({
      opportunities: computed,
      total: computed.length,
      hasPersonalizedMatches: !!investorPrefs,
    });
  } catch (error: any) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

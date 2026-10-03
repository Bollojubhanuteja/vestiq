import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { calculatePreferenceMatch, MatchingWeights, DEFAULT_WEIGHTS } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const model = searchParams.get('model'); // "ALL", "FIXED_RETURN", "EQUITY"
    const industry = searchParams.get('industry');
    const stage = searchParams.get('stage');
    const location = searchParams.get('location');
    const riskLevel = searchParams.get('riskLevel');
    const minAmount = searchParams.get('minAmount') ? Number(searchParams.get('minAmount')) : null;
    const maxAmount = searchParams.get('maxAmount') ? Number(searchParams.get('maxAmount')) : null;
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

    if (model && model !== 'ALL' && model !== 'All') {
      whereClause.investmentModel = model;
    }

    if (industry && industry !== 'All') {
      whereClause.industry = industry;
    }

    if (stage && stage !== 'All') {
      whereClause.businessStage = stage;
    }

    if (location && location !== 'All') {
      whereClause.OR = [
        ...(whereClause.OR || []),
        { city: { contains: location } },
        { country: { contains: location } },
      ];
    }

    if (riskLevel && riskLevel !== 'All') {
      whereClause.riskLevel = riskLevel;
    }

    if (minAmount !== null) {
      whereClause.fundingRequirement = { ...whereClause.fundingRequirement, gte: minAmount };
    }

    if (maxAmount !== null) {
      whereClause.fundingRequirement = { ...whereClause.fundingRequirement, lte: maxAmount };
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

    // Compute preference match score and enrich each opportunity
    const computed = opportunities.map(opp => {
      const match = calculatePreferenceMatch(investorPrefs, opp, weights);
      return {
        id: opp.id,
        companyName: opp.companyName,
        founderName: opp.founderName,
        industry: opp.industry,
        city: opp.city,
        country: opp.country,
        businessStage: opp.businessStage,
        fundingRequirement: opp.fundingRequirement,
        investmentModel: opp.investmentModel,
        minimumInvestment: opp.minimumInvestment,

        // Fixed Return Model Fields
        proposedReturnRate: opp.proposedReturnRate,
        investmentTenureMonths: opp.investmentTenureMonths,
        expectedRepaymentAmount: opp.expectedRepaymentAmount,
        repaymentFrequency: opp.repaymentFrequency,
        collateralDetails: opp.collateralDetails,

        // Equity Model Fields
        valuation: opp.valuation,
        equityOffered: opp.equityOffered,
        preMoneyValuation: opp.preMoneyValuation,
        postMoneyValuation: opp.postMoneyValuation,
        investorOwnershipPercentage: opp.investorOwnershipPercentage,
        investorRights: opp.investorRights,

        // Operational & Risk Metrics
        revenueStatus: opp.revenueStatus,
        revenueDetails: opp.revenueDetails,
        profitabilityStatus: opp.profitabilityStatus,
        yearsOperating: opp.yearsOperating,
        teamSize: opp.teamSize,
        businessDescription: opp.businessDescription,
        growthMetrics: opp.growthMetrics,
        riskLevel: opp.riskLevel,
        fundingStatus: opp.fundingStatus,
        amountCommitted: opp.amountCommitted,
        investorCount: opp.investorCount,
        agreementStatus: opp.agreementStatus,
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
    } else if (sortBy === 'returnDesc') {
      computed.sort((a, b) => (b.proposedReturnRate ?? 0) - (a.proposedReturnRate ?? 0));
    } else if (sortBy === 'equityDesc') {
      computed.sort((a, b) => (b.equityOffered ?? 0) - (a.equityOffered ?? 0));
    } else if (sortBy === 'industry') {
      computed.sort((a, b) => a.industry.localeCompare(b.industry));
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

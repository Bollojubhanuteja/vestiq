import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { calculatePreferenceMatch, DEFAULT_WEIGHTS } from '@/lib/matching';
import { generateDiligenceQuestions, generateFactualExecutiveSummary } from '@/lib/ai';
import { trackEvent } from '@/lib/analytics';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getSessionFromRequest(req);

    const opportunity = await db.businessProfile.findUnique({
      where: { id },
      include: {
        documents: {
          select: {
            id: true,
            title: true,
            docType: true,
            fileSize: true,
            verificationStatus: true,
            sourceClaim: true,
            createdAt: true,
          },
        },
        riskFlags: {
          where: { isPublic: true },
          select: { id: true, category: true, description: true, severity: true },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Access control: If not approved or not published, only business owner or admin can view
    const isOwner = session?.userId === opportunity.userId;
    const isAdmin = session?.role === 'ADMIN';

    if ((opportunity.status !== 'APPROVED' || !opportunity.isPublished) && !isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'This opportunity is currently under private review and not accessible.' },
        { status: 403 }
      );
    }

    // Track view event
    await trackEvent('OPPORTUNITY_VIEW', session?.userId, opportunity.id, {
      companyName: opportunity.companyName,
    });

    // Check investor preferences if investor
    let matchResult: any = null;
    let isSaved = false;

    if (session?.role === 'INVESTOR') {
      const profile = await db.investorProfile.findUnique({
        where: { userId: session.userId },
        include: { preferences: true },
      });

      if (profile?.preferences) {
        const prefs = {
          minInvestment: profile.preferences.minInvestment,
          maxInvestment: profile.preferences.maxInvestment,
          industries: JSON.parse(profile.preferences.industries || '[]'),
          geographies: JSON.parse(profile.preferences.geographies || '[]'),
          horizons: JSON.parse(profile.preferences.horizons || '[]'),
          riskTolerance: profile.preferences.riskTolerance,
          stages: JSON.parse(profile.preferences.stages || '[]'),
        };
        matchResult = calculatePreferenceMatch(prefs, opportunity, DEFAULT_WEIGHTS);
      }

      const saved = await db.watchlist.findUnique({
        where: {
          userId_businessProfileId: {
            userId: session.userId,
            businessProfileId: opportunity.id,
          },
        },
      });
      isSaved = !!saved;
    }

    // Generate safe factual assistive diligence aids
    const diligenceQuestions = generateDiligenceQuestions({
      industry: opportunity.industry,
      businessStage: opportunity.businessStage,
      fundingRequirement: opportunity.fundingRequirement,
      revenueStatus: opportunity.revenueStatus,
      profitabilityStatus: opportunity.profitabilityStatus,
    });

    const factualSummary = generateFactualExecutiveSummary({
      companyName: opportunity.companyName,
      industry: opportunity.industry,
      businessStage: opportunity.businessStage,
      fundingRequirement: opportunity.fundingRequirement,
      problem: opportunity.problem,
      solution: opportunity.solution,
      businessModel: opportunity.businessModel,
      revenueStatus: opportunity.revenueStatus,
      customerTraction: opportunity.customerTraction,
    });

    return NextResponse.json({
      opportunity,
      matchResult,
      isSaved,
      diligenceQuestions,
      factualSummary,
      isOwner,
      isAdmin,
    });
  } catch (error) {
    console.error('Error fetching opportunity detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

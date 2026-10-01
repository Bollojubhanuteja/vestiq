import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { calculatePreferenceMatch, DEFAULT_WEIGHTS } from '@/lib/matching';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    // Fetch user preferences for matching
    const profile = await db.investorProfile.findUnique({
      where: { userId: session.userId },
      include: { preferences: true },
    });

    let investorPrefs: any = null;
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

    const items = await db.watchlist.findMany({
      where: { userId: session.userId },
      include: {
        businessProfile: {
          include: {
            riskFlags: {
              where: { isPublic: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = items.map(item => {
      const match = calculatePreferenceMatch(investorPrefs, item.businessProfile, DEFAULT_WEIGHTS);
      return {
        id: item.id,
        businessProfileId: item.businessProfileId,
        privateNotes: item.privateNotes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        opportunity: {
          ...item.businessProfile,
          matchScore: match.score,
          matchBreakdown: match.breakdown,
          matchSummary: match.summaryExplanation,
          isSaved: true,
        },
      };
    });

    return NextResponse.json({ watchlist: enriched });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const body = await req.json();
    const { businessProfileId, privateNotes } = body;

    if (!businessProfileId) {
      return NextResponse.json({ error: 'businessProfileId is required' }, { status: 400 });
    }

    const watchlistItem = await db.watchlist.upsert({
      where: {
        userId_businessProfileId: {
          userId: session.userId,
          businessProfileId,
        },
      },
      update: {
        privateNotes: privateNotes !== undefined ? privateNotes : undefined,
      },
      create: {
        userId: session.userId,
        businessProfileId,
        privateNotes: privateNotes || '',
      },
    });

    await trackEvent('WATCHLIST_ADD', session.userId, businessProfileId);

    return NextResponse.json({ success: true, item: watchlistItem });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const body = await req.json();
    const { businessProfileId } = body;

    if (!businessProfileId) {
      return NextResponse.json({ error: 'businessProfileId is required' }, { status: 400 });
    }

    await db.watchlist.deleteMany({
      where: {
        userId: session.userId,
        businessProfileId,
      },
    });

    await trackEvent('WATCHLIST_REMOVE', session.userId, businessProfileId);

    return NextResponse.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Unauthorized: Investor access required' }, { status: 401 });
    }

    const body = await req.json();
    const { businessProfileId, privateNotes } = body;

    const updated = await db.watchlist.update({
      where: {
        userId_businessProfileId: {
          userId: session.userId,
          businessProfileId,
        },
      },
      data: {
        privateNotes,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

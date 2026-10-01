import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin portal requires elevated privileges' }, { status: 403 });
    }

    // REAL database counts - strictly no fake numbers
    const [
      totalInvestors,
      totalBusinesses,
      approvedOpportunities,
      pendingReviews,
      totalRequests,
      totalAudits,
    ] = await Promise.all([
      db.user.count({ where: { role: 'INVESTOR' } }),
      db.businessProfile.count(),
      db.businessProfile.count({ where: { status: 'APPROVED', isPublished: true } }),
      db.businessProfile.count({
        where: {
          status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO'] },
        },
      }),
      db.informationRequest.count(),
      db.auditLog.count(),
    ]);

    return NextResponse.json({
      metrics: {
        totalInvestors,
        totalBusinesses,
        approvedOpportunities,
        pendingReviews,
        totalRequests,
        totalAudits,
      },
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

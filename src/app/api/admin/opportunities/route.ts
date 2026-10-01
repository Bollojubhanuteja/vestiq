import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const opportunities = await db.businessProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        riskFlags: true,
        adminNotes: {
          include: { author: { select: { name: true } } },
        },
        documents: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Error fetching admin opportunities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

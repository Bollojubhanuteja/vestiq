import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const config = await db.matchingConfig.findUnique({
      where: { id: 'default-config' },
    });

    return NextResponse.json({
      config: config || {
        industryWeight: 0.25,
        amountWeight: 0.20,
        stageWeight: 0.15,
        geoWeight: 0.10,
        horizonWeight: 0.15,
        riskWeight: 0.15,
      },
    });
  } catch (error) {
    console.error('Error fetching matching config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await req.json();

    const current = await db.matchingConfig.findUnique({
      where: { id: 'default-config' },
    });

    const updated = await db.matchingConfig.upsert({
      where: { id: 'default-config' },
      update: {
        industryWeight: parseFloat(body.industryWeight),
        amountWeight: parseFloat(body.amountWeight),
        stageWeight: parseFloat(body.stageWeight),
        geoWeight: parseFloat(body.geoWeight),
        horizonWeight: parseFloat(body.horizonWeight),
        riskWeight: parseFloat(body.riskWeight),
      },
      create: {
        id: 'default-config',
        industryWeight: parseFloat(body.industryWeight),
        amountWeight: parseFloat(body.amountWeight),
        stageWeight: parseFloat(body.stageWeight),
        geoWeight: parseFloat(body.geoWeight),
        horizonWeight: parseFloat(body.horizonWeight),
        riskWeight: parseFloat(body.riskWeight),
      },
    });

    await createAuditLog({
      adminId: session.userId,
      action: 'UPDATE_MATCHING_WEIGHTS',
      entityType: 'CONFIG',
      entityId: 'default-config',
      previousValue: current,
      newValue: updated,
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    console.error('Error updating matching config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

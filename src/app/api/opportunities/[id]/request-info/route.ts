import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';
import { z } from 'zod';

const requestSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (session.role !== 'INVESTOR') {
      return NextResponse.json(
        { error: 'Only registered investors can submit information requests' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const opportunity = await db.businessProfile.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const request = await db.informationRequest.create({
      data: {
        investorUserId: session.userId,
        businessProfileId: opportunity.id,
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: 'PENDING',
      },
    });

    await trackEvent('INFO_REQUEST', session.userId, opportunity.id, {
      subject: parsed.data.subject,
    });

    return NextResponse.json({
      success: true,
      message: 'Information request submitted to founder successfully.',
      request,
    });
  } catch (error) {
    console.error('Error submitting info request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const current = await db.businessProfile.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.verificationStatus !== undefined) updateData.verificationStatus = body.verificationStatus;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    if (body.verificationNotes !== undefined) updateData.verificationNotes = body.verificationNotes;
    if (body.verificationStatus === 'VERIFIED') updateData.verifiedAt = new Date();

    const updated = await db.businessProfile.update({
      where: { id },
      data: updateData,
    });

    // If an internal admin note was provided, save it
    if (body.adminNote && body.adminNote.trim()) {
      await db.adminNote.create({
        data: {
          businessProfileId: id,
          authorId: session.userId,
          note: body.adminNote.trim(),
        },
      });
    }

    // Record immutable audit log
    await createAuditLog({
      adminId: session.userId,
      action: 'UPDATE_OPPORTUNITY_STATUS',
      entityType: 'BUSINESS_PROFILE',
      entityId: id,
      previousValue: {
        status: current.status,
        verificationStatus: current.verificationStatus,
        isPublished: current.isPublished,
      },
      newValue: {
        status: updated.status,
        verificationStatus: updated.verificationStatus,
        isPublished: updated.isPublished,
      },
    });

    return NextResponse.json({ success: true, opportunity: updated });
  } catch (error) {
    console.error('Error updating opportunity by admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

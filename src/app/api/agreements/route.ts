import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const interestId = searchParams.get('interestId');

    const where: any = {};
    if (id) where.id = id;
    if (interestId) where.interestId = interestId;

    if (session.role === 'INVESTOR') {
      where.investorUserId = session.userId;
    } else if (session.role === 'BUSINESS') {
      const business = await db.businessProfile.findUnique({
        where: { userId: session.userId },
        select: { id: true },
      });
      if (!business) return NextResponse.json({ agreements: [] });
      where.businessProfileId = business.id;
    } else if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    const agreements = await db.investmentAgreement.findMany({
      where,
      include: {
        businessProfile: {
          select: {
            id: true,
            companyName: true,
            founderName: true,
            city: true,
            industry: true,
            investmentModel: true,
            collateralDetails: true,
            repaymentFrequency: true,
            proposedReturnRate: true,
            investmentTenureMonths: true,
            expectedRepaymentAmount: true,
            valuation: true,
            equityOffered: true,
            investorRights: true,
          },
        },
        investorUser: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
          },
        },
        interest: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ agreements });
  } catch (error: any) {
    console.error('Error fetching agreements:', error);
    return NextResponse.json({ error: 'Failed to fetch agreements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      interestId,
      agreementType,
      principalOrAmount,
      indicativeTerms,
      repaymentSchedule,
      equityPercentage,
      valuation,
      rightsAndCovenants,
    } = body;

    if (!interestId || !principalOrAmount) {
      return NextResponse.json({ error: 'interestId and principalOrAmount are required' }, { status: 400 });
    }

    const interest = await db.investmentInterest.findUnique({
      where: { id: interestId },
      include: { businessProfile: true },
    });

    if (!interest) {
      return NextResponse.json({ error: 'Interest record not found' }, { status: 404 });
    }

    // Must be either the investor or the business owner
    const isOwner = interest.businessProfile.userId === session.userId;
    const isInvestor = interest.investorUserId === session.userId;
    if (!isOwner && !isInvestor && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to generate agreement for this interest' }, { status: 403 });
    }

    // Default institutional indicative terms if not provided
    const defaultTerms = indicativeTerms || (agreementType === 'FIXED_RETURN_DEBT'
      ? `INDICATIVE TERM SHEET: FIXED RETURN FACILITY\n1. Principal: ₹${principalOrAmount.toLocaleString('en-IN')}\n2. Proposed Coupon / Return: ${interest.businessProfile.proposedReturnRate || 16}% p.a.\n3. Tenure: ${interest.businessProfile.investmentTenureMonths || 24} Months\n4. Frequency: ${interest.businessProfile.repaymentFrequency || 'MONTHLY'}\n5. Security / Collateral: ${interest.businessProfile.collateralDetails || 'Charge on company commercial receivables'}\n6. Regulatory Note: This agreement sets forth agreed funding terms, repayment schedules, and covenants between the parties.`
      : `INDICATIVE TERM SHEET: DIRECT EQUITY PARTNERSHIP\n1. Investment Check: ₹${principalOrAmount.toLocaleString('en-IN')}\n2. Pre-Money Valuation: ₹${(valuation || interest.businessProfile.valuation || 100000000).toLocaleString('en-IN')}\n3. Equity Offered: ${equityPercentage || interest.businessProfile.equityOffered || 10}%\n4. Governance Rights: ${rightsAndCovenants || interest.businessProfile.investorRights || 'Information rights, quarterly P&L audit reports, pro-rata subscription rights'}\n5. Closing Terms: Final consummation subject to customary SHA execution, allotment, and MCA ROC filing.`);

    const agreement = await db.investmentAgreement.create({
      data: {
        interestId,
        investorUserId: interest.investorUserId,
        businessProfileId: interest.businessProfileId,
        agreementType: agreementType || (interest.investmentModel === 'FIXED_RETURN' ? 'FIXED_RETURN_DEBT' : 'EQUITY_PARTNERSHIP'),
        principalOrAmount: Number(principalOrAmount),
        indicativeTerms: defaultTerms,
        repaymentSchedule: repaymentSchedule ? (typeof repaymentSchedule === 'string' ? repaymentSchedule : JSON.stringify(repaymentSchedule)) : null,
        equityPercentage: equityPercentage ? Number(equityPercentage) : interest.businessProfile.equityOffered,
        valuation: valuation ? Number(valuation) : interest.businessProfile.valuation,
        rightsAndCovenants: rightsAndCovenants || interest.businessProfile.investorRights,
        disclosuresAcknowledged: true,
        status: 'DRAFT_INDICATIVE',
      },
    });

    // Advance interest status to AGREEMENT
    await db.investmentInterest.update({
      where: { id: interestId },
      data: { status: 'AGREEMENT' },
    });

    // Notify counterpart
    const notifyUserId = isOwner ? interest.investorUserId : interest.businessProfile.userId;
    await db.notification.create({
      data: {
        userId: notifyUserId,
        title: `Indicative Term Sheet Drafted`,
        message: `An indicative agreement has been prepared for ${interest.businessProfile.companyName} (₹${principalOrAmount.toLocaleString('en-IN')}).`,
        type: 'AGREEMENT',
        link: '/dashboard/investor/requests',
      },
    });

    return NextResponse.json({ success: true, agreement });
  } catch (error: any) {
    console.error('Error creating agreement:', error);
    return NextResponse.json({ error: 'Failed to create indicative agreement' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { agreementId, action } = body; // action: "SIGN" | "EXECUTE" | "REVISE"

    if (!agreementId) {
      return NextResponse.json({ error: 'agreementId is required' }, { status: 400 });
    }

    const agreement = await db.investmentAgreement.findUnique({
      where: { id: agreementId },
      include: {
        businessProfile: true,
        investorUser: true,
      },
    });

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    const isInvestor = agreement.investorUserId === session.userId;
    const isOwner = agreement.businessProfile.userId === session.userId;

    if (!isInvestor && !isOwner && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    let updateData: any = {};
    const now = new Date();

    if (action === 'SIGN') {
      if (isInvestor) {
        updateData.investorSignedAt = now;
        if (agreement.businessSignedAt) {
          updateData.status = 'EXECUTED';
        } else {
          updateData.status = 'PENDING_FOUNDER_SIGN';
        }
      } else if (isOwner) {
        updateData.businessSignedAt = now;
        if (agreement.investorSignedAt) {
          updateData.status = 'EXECUTED';
        } else {
          updateData.status = 'PENDING_INVESTOR_SIGN';
        }
      }
    }

    const updated = await db.investmentAgreement.update({
      where: { id: agreementId },
      data: updateData,
    });

    // If fully executed, advance interest to COMPLETED and update businessProfile committed amount
    if (updated.status === 'EXECUTED') {
      await db.investmentInterest.update({
        where: { id: agreement.interestId },
        data: { status: 'COMPLETED' },
      });

      await db.businessProfile.update({
        where: { id: agreement.businessProfileId },
        data: {
          amountCommitted: { increment: agreement.principalOrAmount },
          investorCount: { increment: 1 },
        },
      });

      // Dispatch notifications to both
      await db.notification.createMany({
        data: [
          {
            userId: agreement.investorUserId,
            title: `Agreement Executed: ${agreement.businessProfile.companyName}`,
            message: `Indicative agreement successfully executed with ${agreement.businessProfile.companyName}. Proceed with mutual closing formalities.`,
            type: 'AGREEMENT',
            link: '/dashboard/investor/requests',
          },
          {
            userId: agreement.businessProfile.userId,
            title: `Agreement Executed with ${agreement.investorUser.name}`,
            message: `${agreement.investorUser.name} executed the indicative agreement for ₹${agreement.principalOrAmount.toLocaleString('en-IN')}.`,
            type: 'AGREEMENT',
            link: '/dashboard/business/requests',
          },
        ],
      });
    }

    return NextResponse.json({ success: true, agreement: updated });
  } catch (error: any) {
    console.error('Error updating agreement:', error);
    return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 });
  }
}

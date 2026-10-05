import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import crypto from 'crypto';
import {
  generateIndicativeTermSheet,
  generateFormalLoanDebentureDeed,
  generateShareholdersAgreement,
} from '@/lib/legal-templates';
import { requestAadhaarOtp, verifyAadhaarOtpAndSign } from '@/lib/aadhaar-esign';
import { executeEscrowDeposit, executeEscrowRelease } from '@/lib/escrow-banking';

export const dynamic = 'force-dynamic';

function computeSignatureHash(
  agreementId: string,
  signerName: string,
  panOrId: string,
  timestamp: Date
): string {
  const payload = `${agreementId}|${signerName.trim().toUpperCase()}|${panOrId.trim().toUpperCase()}|${timestamp.toISOString()}`;
  return crypto.createHash('sha256').update(payload).digest('hex').toUpperCase();
}

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
            userId: true,
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
            intendedUseOfFunds: true,
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
      directPromoteToDeed,
    } = body;

    if (!interestId || !principalOrAmount) {
      return NextResponse.json(
        { error: 'interestId and principalOrAmount are required' },
        { status: 400 }
      );
    }

    const interest = await db.investmentInterest.findUnique({
      where: { id: interestId },
      include: {
        businessProfile: true,
        investorUser: true,
      },
    });

    if (!interest) {
      return NextResponse.json({ error: 'Interest record not found' }, { status: 404 });
    }

    // Must be either the investor or the business owner
    const isOwner = interest.businessProfile.userId === session.userId;
    const isInvestor = interest.investorUserId === session.userId;
    if (!isOwner && !isInvestor && session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized to generate agreement for this interest' },
        { status: 403 }
      );
    }

    const resolvedAgreementType =
      agreementType ||
      (interest.investmentModel === 'FIXED_RETURN' ? 'FIXED_RETURN_DEBT' : 'EQUITY_PARTNERSHIP');

    // Generate clean Indicative Term Sheet
    const terms =
      indicativeTerms ||
      generateIndicativeTermSheet(
        resolvedAgreementType,
        interest.businessProfile,
        Number(principalOrAmount)
      );

    let agreementStage = 'INDICATIVE_TERM_SHEET';
    let formalDeedType: string | null = null;
    let formalDeedContent: string | null = null;
    let initialStatus = 'DRAFT_INDICATIVE';

    const tempId = `VST-${Date.now().toString(36).toUpperCase()}`;

    if (directPromoteToDeed) {
      agreementStage = 'FORMAL_DEED';
      initialStatus = 'PENDING_INVESTOR_SIGN';
      if (resolvedAgreementType === 'FIXED_RETURN_DEBT') {
        formalDeedType = 'LOAN_DEBENTURE_DEED';
        formalDeedContent = generateFormalLoanDebentureDeed({
          deedId: `VST-DEED-${tempId}`,
          companyName: interest.businessProfile.companyName,
          companyCity: interest.businessProfile.city,
          founderName: interest.businessProfile.founderName,
          investorName: interest.investorUser.name,
          investorCity: interest.investorUser.city || 'India',
          principalAmount: Number(principalOrAmount),
          couponRatePercent: interest.businessProfile.proposedReturnRate || 16.0,
          tenureMonths: interest.businessProfile.investmentTenureMonths || 24,
          repaymentFrequency: interest.businessProfile.repaymentFrequency || 'MONTHLY',
          collateralDescription:
            interest.businessProfile.collateralDetails ||
            'First charge on company commercial machinery and revenue receivables',
          intendedUseOfFunds: interest.businessProfile.intendedUseOfFunds,
        });
      } else {
        formalDeedType = 'SHAREHOLDERS_AGREEMENT';
        formalDeedContent = generateShareholdersAgreement({
          deedId: `VST-SHA-${tempId}`,
          companyName: interest.businessProfile.companyName,
          companyCity: interest.businessProfile.city,
          founderName: interest.businessProfile.founderName,
          investorName: interest.investorUser.name,
          investorCity: interest.investorUser.city || 'India',
          investmentAmount: Number(principalOrAmount),
          preMoneyValuation:
            valuation || interest.businessProfile.valuation || Number(principalOrAmount) * 10,
          equityOfferedPercent:
            equityPercentage || interest.businessProfile.equityOffered || 10,
          investorRights:
            rightsAndCovenants || interest.businessProfile.investorRights || undefined,
          intendedUseOfFunds: interest.businessProfile.intendedUseOfFunds,
        });
      }
    }

    const agreement = await db.investmentAgreement.create({
      data: {
        interestId,
        investorUserId: interest.investorUserId,
        businessProfileId: interest.businessProfileId,
        agreementType: resolvedAgreementType,
        principalOrAmount: Number(principalOrAmount),
        indicativeTerms: terms,
        repaymentSchedule: repaymentSchedule
          ? typeof repaymentSchedule === 'string'
            ? repaymentSchedule
            : JSON.stringify(repaymentSchedule)
          : null,
        equityPercentage: equityPercentage
          ? Number(equityPercentage)
          : interest.businessProfile.equityOffered,
        valuation: valuation ? Number(valuation) : interest.businessProfile.valuation,
        rightsAndCovenants: rightsAndCovenants || interest.businessProfile.investorRights,
        disclosuresAcknowledged: true,
        agreementStage,
        formalDeedType,
        formalDeedContent,
        status: initialStatus,
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
        title: directPromoteToDeed ? 'Formal Deed Prepared' : 'Indicative Term Sheet Drafted',
        message: directPromoteToDeed
          ? `A formal ${formalDeedType === 'LOAN_DEBENTURE_DEED' ? 'Loan / Debenture Deed' : 'Shareholders Agreement (SHA)'} has been drafted for ${interest.businessProfile.companyName} (₹${Number(principalOrAmount).toLocaleString('en-IN')}).`
          : `An indicative agreement has been prepared for ${interest.businessProfile.companyName} (₹${Number(principalOrAmount).toLocaleString('en-IN')}).`,
        type: 'AGREEMENT',
        link: isOwner ? '/dashboard/investor/requests' : '/dashboard/business/requests',
      },
    });

    return NextResponse.json({ success: true, agreement });
  } catch (error: any) {
    console.error('Error creating agreement:', error);
    return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      agreementId,
      action, // "PROMOTE_TO_FORMAL_DEED" | "SIGN_ONLINE" | "SIGN" (legacy)
      legalName,
      panOrId,
      designation,
      customDeedClauses,
    } = body;

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

    const now = new Date();
    const updateData: any = {};

    // -------------------------------------------------------------------------
    // ACTION 1: PROMOTE INDICATIVE TERM SHEET -> FORMAL LEGAL DEED
    // -------------------------------------------------------------------------
    if (action === 'PROMOTE_TO_FORMAL_DEED') {
      const deedId = `VST-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      if (agreement.agreementType === 'FIXED_RETURN_DEBT') {
        updateData.formalDeedType = 'LOAN_DEBENTURE_DEED';
        updateData.formalDeedContent =
          customDeedClauses ||
          generateFormalLoanDebentureDeed({
            deedId,
            companyName: agreement.businessProfile.companyName,
            companyCity: agreement.businessProfile.city,
            founderName: agreement.businessProfile.founderName,
            investorName: agreement.investorUser.name,
            investorCity: agreement.investorUser.city || 'India',
            principalAmount: agreement.principalOrAmount,
            couponRatePercent: agreement.businessProfile.proposedReturnRate || 16.0,
            tenureMonths: agreement.businessProfile.investmentTenureMonths || 24,
            repaymentFrequency: agreement.businessProfile.repaymentFrequency || 'MONTHLY',
            collateralDescription:
              agreement.businessProfile.collateralDetails ||
              'Exclusive first charge on commercial machinery and revenue receivables',
            intendedUseOfFunds: agreement.businessProfile.intendedUseOfFunds,
          });
      } else {
        updateData.formalDeedType = 'SHAREHOLDERS_AGREEMENT';
        updateData.formalDeedContent =
          customDeedClauses ||
          generateShareholdersAgreement({
            deedId,
            companyName: agreement.businessProfile.companyName,
            companyCity: agreement.businessProfile.city,
            founderName: agreement.businessProfile.founderName,
            investorName: agreement.investorUser.name,
            investorCity: agreement.investorUser.city || 'India',
            investmentAmount: agreement.principalOrAmount,
            preMoneyValuation:
              agreement.valuation ||
              agreement.businessProfile.valuation ||
              agreement.principalOrAmount * 10,
            equityOfferedPercent:
              agreement.equityPercentage || agreement.businessProfile.equityOffered || 10,
            investorRights:
              agreement.rightsAndCovenants ||
              agreement.businessProfile.investorRights ||
              undefined,
            intendedUseOfFunds: agreement.businessProfile.intendedUseOfFunds,
          });
      }

      updateData.agreementStage = 'FORMAL_DEED';
      updateData.status = 'PENDING_INVESTOR_SIGN';

      // Reset any previous signatures if promoting
      updateData.investorSignedAt = null;
      updateData.businessSignedAt = null;
      updateData.investorSignatureHash = null;
      updateData.businessSignatureHash = null;

      const updated = await db.investmentAgreement.update({
        where: { id: agreementId },
        data: updateData,
      });

      // Dispatch alert to counterparty
      const notifyUserId = isOwner ? agreement.investorUserId : agreement.businessProfile.userId;
      await db.notification.create({
        data: {
          userId: notifyUserId,
          title: `Formal Deed Generated: ${updateData.formalDeedType === 'LOAN_DEBENTURE_DEED' ? 'Loan / Debenture Deed' : 'Shareholders Agreement (SHA)'}`,
          message: `The indicative term sheet for ${agreement.businessProfile.companyName} has been converted into a formal binding deed. Complete your online digital signature.`,
          type: 'AGREEMENT',
          link: isOwner ? '/dashboard/investor/requests' : '/dashboard/business/requests',
        },
      });

      return NextResponse.json({ success: true, agreement: updated });
    }

    // -------------------------------------------------------------------------
    // ACTION 2: ONLINE DIGITAL SIGNING CEREMONY (FORMAL E-SIGN)
    // -------------------------------------------------------------------------
    if (action === 'SIGN_ONLINE') {
      const signerLegalName = legalName || session.name || (isInvestor ? agreement.investorUser.name : agreement.businessProfile.founderName);
      const signerPan = panOrId || 'INDIVIDUAL/VERIFIED';
      const signerDesignation = designation || (isInvestor ? 'Qualified Investor / Capital Partner' : 'Founder & Managing Director');
      const sigHash = computeSignatureHash(agreementId, signerLegalName, signerPan, now);

      if (isInvestor) {
        updateData.investorSignedAt = now;
        updateData.investorLegalName = signerLegalName;
        updateData.investorPan = signerPan;
        updateData.investorDesignation = signerDesignation;
        updateData.investorSignatureHash = sigHash;

        if (agreement.businessSignedAt) {
          updateData.status = 'EXECUTED';
          updateData.executionCertificateId = `VST-EXEC-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        } else {
          updateData.status = 'PENDING_FOUNDER_SIGN';
        }
      } else if (isOwner) {
        updateData.businessSignedAt = now;
        updateData.businessLegalName = signerLegalName;
        updateData.businessPan = signerPan;
        updateData.businessDesignation = signerDesignation;
        updateData.businessSignatureHash = sigHash;

        if (agreement.investorSignedAt) {
          updateData.status = 'EXECUTED';
          updateData.executionCertificateId = `VST-EXEC-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        } else {
          updateData.status = 'PENDING_INVESTOR_SIGN';
        }
      }
    }

    // -------------------------------------------------------------------------
    // ACTION 3: LEGACY QUICK SIGN (COMPATIBILITY)
    // -------------------------------------------------------------------------
    if (action === 'SIGN') {
      if (isInvestor) {
        updateData.investorSignedAt = now;
        updateData.investorLegalName = agreement.investorUser.name;
        updateData.investorSignatureHash = computeSignatureHash(agreementId, agreement.investorUser.name, 'VERIFIED', now);
        if (agreement.businessSignedAt) {
          updateData.status = 'EXECUTED';
          updateData.executionCertificateId = `VST-EXEC-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        } else {
          updateData.status = 'PENDING_FOUNDER_SIGN';
        }
      } else if (isOwner) {
        updateData.businessSignedAt = now;
        updateData.businessLegalName = agreement.businessProfile.founderName;
        updateData.businessSignatureHash = computeSignatureHash(agreementId, agreement.businessProfile.founderName, 'VERIFIED', now);
        if (agreement.investorSignedAt) {
          updateData.status = 'EXECUTED';
          updateData.executionCertificateId = `VST-EXEC-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        } else {
          updateData.status = 'PENDING_INVESTOR_SIGN';
        }
      }
    }

    // -------------------------------------------------------------------------
    // ACTION 4: REQUEST AADHAAR OTP (UIDAI SIMULATION & LIVE ESP HOOK)
    // -------------------------------------------------------------------------
    if (action === 'REQUEST_AADHAAR_OTP') {
      const { aadhaarNumber } = body;
      const otpRes = await requestAadhaarOtp(aadhaarNumber || '');
      if (!otpRes.success) {
        return NextResponse.json({ error: otpRes.error || 'Failed to generate Aadhaar OTP' }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        transactionId: otpRes.transactionId,
        maskedMobile: otpRes.maskedMobile,
      });
    }

    // -------------------------------------------------------------------------
    // ACTION 5: SIGN VIA AADHAAR OTP & DIGILOCKER
    // -------------------------------------------------------------------------
    if (action === 'SIGN_AADHAAR_OTP') {
      const { aadhaarNumber, otp, transactionId } = body;
      const signerLegalName = legalName || session.name || (isInvestor ? agreement.investorUser.name : agreement.businessProfile.founderName);

      const signResult = await verifyAadhaarOtpAndSign({
        transactionId: transactionId || `UIDAI-TXN-${Date.now().toString(36).toUpperCase()}`,
        otp: otp || '123456',
        aadhaarNumber: aadhaarNumber || '999999999999',
        agreementId,
        signerLegalName,
      });

      if (!signResult.success) {
        return NextResponse.json({ error: signResult.error || 'Aadhaar eSign verification failed' }, { status: 400 });
      }

      const cleanLast4 = (aadhaarNumber || '').replace(/\s+/g, '').slice(-4) || '9999';

      if (isInvestor) {
        updateData.investorSignedAt = now;
        updateData.investorLegalName = signerLegalName;
        updateData.investorAadhaarLast4 = cleanLast4;
        updateData.investorEsignMethod = 'AADHAAR_OTP';
        updateData.investorSignatureHash = signResult.signatureHash;

        if (agreement.businessSignedAt) {
          updateData.status = 'EXECUTED';
          updateData.executionCertificateId = `VST-EXEC-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        } else {
          updateData.status = 'PENDING_FOUNDER_SIGN';
        }
      } else if (isOwner) {
        updateData.businessSignedAt = now;
        updateData.businessLegalName = signerLegalName;
        updateData.businessAadhaarLast4 = cleanLast4;
        updateData.businessEsignMethod = 'AADHAAR_OTP';
        updateData.businessSignatureHash = signResult.signatureHash;

        if (agreement.investorSignedAt) {
          updateData.status = 'EXECUTED';
          updateData.executionCertificateId = `VST-EXEC-${agreement.id.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        } else {
          updateData.status = 'PENDING_INVESTOR_SIGN';
        }
      }
    }

    // -------------------------------------------------------------------------
    // ACTION 6: ESCROW DEPOSIT (INVESTOR FUNDS VIRTUAL ESCROW ACCOUNT)
    // -------------------------------------------------------------------------
    if (action === 'ESCROW_DEPOSIT') {
      const { amount, paymentMethod } = body;
      const depositAmount = Number(amount) || agreement.principalOrAmount;
      const method = (paymentMethod || 'UPI') as 'UPI' | 'NETBANKING' | 'NEFT_RTGS';

      const depositRes = await executeEscrowDeposit({
        agreementId,
        companyName: agreement.businessProfile.companyName,
        amount: depositAmount,
        paymentMethod: method,
        investorName: agreement.investorUser.name,
      });

      if (!depositRes.success) {
        return NextResponse.json({ error: depositRes.error || 'Failed to deposit to escrow' }, { status: 400 });
      }

      updateData.escrowStatus = 'HELD_IN_ESCROW';
      updateData.escrowAmount = depositAmount;
      updateData.escrowPaymentMethod = method;
      updateData.escrowTransactionId = depositRes.transactionId;
      updateData.escrowVirtualAccount = depositRes.virtualAccount.accountNumber;
      updateData.escrowFundedAt = now;

      await db.notification.createMany({
        data: [
          {
            userId: agreement.businessProfile.userId,
            title: `Escrow Funded: ₹${depositAmount.toLocaleString('en-IN')}`,
            message: `Investor ${agreement.investorUser.name} deposited ₹${depositAmount.toLocaleString('en-IN')} into Vestiq Trustee Escrow for ${agreement.businessProfile.companyName}. Funds held in secure escrow.`,
            type: 'PAYMENT',
            link: '/dashboard/business/requests',
          },
          {
            userId: agreement.investorUserId,
            title: `Escrow Deposit Confirmed: ₹${depositAmount.toLocaleString('en-IN')}`,
            message: `Your deposit of ₹${depositAmount.toLocaleString('en-IN')} is safely held in Vestiq Neutral Trustee Escrow (Txn: ${depositRes.transactionId}).`,
            type: 'PAYMENT',
            link: '/dashboard/investor/requests',
          },
        ],
      });
    }

    // -------------------------------------------------------------------------
    // ACTION 7: ESCROW RELEASE (FUNDS DISBURSED TO BUSINESS)
    // -------------------------------------------------------------------------
    if (action === 'ESCROW_RELEASE') {
      if (agreement.status !== 'EXECUTED') {
        return NextResponse.json(
          { error: 'Cannot release escrow funds until both parties have executed the legal deed.' },
          { status: 400 }
        );
      }

      const releaseAmount = agreement.escrowAmount || agreement.principalOrAmount;
      const releaseRes = await executeEscrowRelease({
        agreementId,
        transactionId: agreement.escrowTransactionId || `VST-ESC-${agreement.id.slice(-6).toUpperCase()}`,
        amount: releaseAmount,
        founderName: agreement.businessProfile.founderName,
        companyName: agreement.businessProfile.companyName,
      });

      updateData.escrowStatus = 'RELEASED';
      updateData.escrowUtrNumber = releaseRes.utrNumber;
      updateData.escrowReleasedAt = now;

      await db.notification.createMany({
        data: [
          {
            userId: agreement.businessProfile.userId,
            title: `Escrow Funds Disbursed: ₹${releaseAmount.toLocaleString('en-IN')}`,
            message: `Capital of ₹${releaseAmount.toLocaleString('en-IN')} has been disbursed to your current account. RBI UTR: ${releaseRes.utrNumber}.`,
            type: 'PAYMENT',
            link: '/dashboard/business/requests',
          },
          {
            userId: agreement.investorUserId,
            title: `Escrow Disbursed to ${agreement.businessProfile.companyName}`,
            message: `Capital has been successfully disbursed upon legal compliance verification. Official UTR: ${releaseRes.utrNumber}.`,
            type: 'PAYMENT',
            link: '/dashboard/investor/requests',
          },
        ],
      });
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

      // Audit Log for Legal Execution
      await db.auditLog.create({
        data: {
          adminId: session.userId,
          action: 'AGREEMENT_EXECUTED_ONLINE',
          entityType: 'AGREEMENT',
          entityId: agreement.id,
          newValue: JSON.stringify({
            certificateId: updated.executionCertificateId,
            amount: agreement.principalOrAmount,
            type: updated.formalDeedType || updated.agreementType,
            investorSignedAt: updated.investorSignedAt,
            businessSignedAt: updated.businessSignedAt,
          }),
        },
      });

      // Dispatch notifications to both parties
      await db.notification.createMany({
        data: [
          {
            userId: agreement.investorUserId,
            title: `Deed Executed Online: ${agreement.businessProfile.companyName}`,
            message: `The ${updated.formalDeedType === 'LOAN_DEBENTURE_DEED' ? 'Loan / Debenture Deed' : 'Shareholders Agreement'} with ${agreement.businessProfile.companyName} has been fully executed online. View/download your official legal deed certificate.`,
            type: 'AGREEMENT',
            link: '/dashboard/investor/requests',
          },
          {
            userId: agreement.businessProfile.userId,
            title: `Deed Executed Online with ${agreement.investorUser.name}`,
            message: `The ${updated.formalDeedType === 'LOAN_DEBENTURE_DEED' ? 'Loan / Debenture Deed' : 'Shareholders Agreement'} with ${agreement.investorUser.name} has been fully executed online (₹${agreement.principalOrAmount.toLocaleString('en-IN')}).`,
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

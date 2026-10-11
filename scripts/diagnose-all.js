const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

async function runDiagnostics() {
  console.log('=== VESTIQ FULL PLATFORM DIAGNOSTICS ===\n');

  let passed = 0;
  let failed = 0;
  const errors = [];

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${name} ${details ? ': ' + details : ''}`);
      failed++;
      errors.push({ name, details });
    }
  }

  try {
    // 1. Database Connectivity
    const userCount = await db.user.count();
    assert('DB Connection & User Count', true, `Found ${userCount} users`);

    // 2. Admin Accounts
    const founder = await db.user.findUnique({ where: { email: 'vestiq21@gmail.com' } });
    assert('Founder Admin Account (vestiq21@gmail.com)', !!founder && founder.role === 'ADMIN');

    const cofounder = await db.user.findUnique({ where: { email: 'bhavana@vestiq.com' } });
    assert('Co-Founder Admin Account (bhavana@vestiq.com)', !!cofounder && cofounder.role === 'ADMIN');

    // 3. Matching Config Table
    let config = await db.matchingConfig.findUnique({ where: { id: 'default-config' } });
    if (!config) {
      config = await db.matchingConfig.create({
        data: {
          id: 'default-config',
          industryWeight: 0.25,
          amountWeight: 0.20,
          stageWeight: 0.15,
          geoWeight: 0.10,
          horizonWeight: 0.15,
          riskWeight: 0.15,
        }
      });
    }
    assert('Matching Config Record Exists', !!config);

    // 4. Test Ephemeral Business Account Creation
    const testBizEmail = `test_biz_${Date.now()}@test.com`;
    const hash = await bcrypt.hash('TestPassword123!', 10);
    const bizUser = await db.user.create({
      data: {
        name: 'Test Startup Founder',
        email: testBizEmail,
        passwordHash: hash,
        role: 'BUSINESS',
        phone: '9876543210',
        city: 'Hyderabad',
        country: 'India',
      }
    });

    const bizProfile = await db.businessProfile.create({
      data: {
        userId: bizUser.id,
        companyName: 'Apex Robotics Pvt Ltd',
        founderName: bizUser.name,
        email: bizUser.email,
        phone: bizUser.phone,
        city: 'Hyderabad',
        country: 'India',
        industry: 'Technology',
        businessStage: 'Seed',
        businessDescription: 'Industrial automation robots',
        problem: 'High manufacturing costs',
        solution: 'Automated warehouse robotics',
        businessModel: 'B2B Hardware + SaaS',
        fundingRequirement: 5000000,
        intendedUseOfFunds: 'Product expansion and engineering talent',
        revenueStatus: 'Pre-revenue',
        profitabilityStatus: 'Early Stage',
        investmentModel: 'EQUITY',
        valuation: 30000000,
        equityOffered: 15.0,
        status: 'SUBMITTED',
        verificationStatus: 'UNDER_REVIEW',
        isPublished: false,
      }
    });
    assert('Business User & Profile Creation', !!bizProfile && bizProfile.id.length > 0);

    // 5. Test Admin Opportunity Queries
    const adminOpps = await db.businessProfile.findMany({
      where: { id: bizProfile.id },
      include: { user: true, riskFlags: true, documents: true, adminNotes: true }
    });
    assert('Admin Opportunity Fetch with Relations', adminOpps.length === 1);

    // 6. Test Admin Opportunity Approval Workflow
    const approvedOpp = await db.businessProfile.update({
      where: { id: bizProfile.id },
      data: { status: 'APPROVED', verificationStatus: 'VERIFIED', isPublished: true, verifiedAt: new Date() }
    });
    assert('Admin Approval & Publishing', approvedOpp.status === 'APPROVED' && approvedOpp.isPublished === true);

    // 7. Test Public Explore / Opportunities Query
    const publicOpps = await db.businessProfile.findMany({
      where: { status: 'APPROVED', isPublished: true },
      include: { riskFlags: { where: { isPublic: true } } }
    });
    assert('Public Explore Query (Approved only)', publicOpps.some(o => o.id === bizProfile.id));

    // 8. Test Ephemeral Investor Account Creation
    const testInvEmail = `test_inv_${Date.now()}@test.com`;
    const invUser = await db.user.create({
      data: {
        name: 'Test Angel Investor',
        email: testInvEmail,
        passwordHash: hash,
        role: 'INVESTOR',
        city: 'Mumbai',
        country: 'India',
      }
    });

    const invProfile = await db.investorProfile.create({
      data: {
        userId: invUser.id,
        experienceLevel: 'INTERMEDIATE',
        onboardingCompleted: true,
      }
    });

    const invPref = await db.investorPreference.create({
      data: {
        investorProfileId: invProfile.id,
        minInvestment: 500000,
        maxInvestment: 10000000,
        industries: JSON.stringify(['Technology']),
        geographies: JSON.stringify(['India']),
        horizons: JSON.stringify(['3–5 years']),
        riskTolerance: 'MODERATE',
        stages: JSON.stringify(['Seed', 'Growth']),
      }
    });
    assert('Investor Profile & Preferences Creation', !!invPref);

    // 9. Test Watchlist Workflow
    const watchItem = await db.watchlist.create({
      data: {
        userId: invUser.id,
        businessProfileId: bizProfile.id,
        privateNotes: 'Promising technology and team',
      }
    });
    assert('Investor Watchlist Item Creation', !!watchItem);

    const userWatchlist = await db.watchlist.findMany({
      where: { userId: invUser.id },
      include: { businessProfile: true }
    });
    assert('Investor Watchlist Query', userWatchlist.length === 1);

    // 10. Test Information Request Workflow
    const infoReq = await db.informationRequest.create({
      data: {
        investorUserId: invUser.id,
        businessProfileId: bizProfile.id,
        subject: 'Due Diligence on Revenue Projections',
        message: 'Could you share customer acquisition cost breakdowns?',
        status: 'PENDING',
      }
    });
    assert('Information Request Creation', !!infoReq);

    const bizReqs = await db.informationRequest.findMany({
      where: { businessProfileId: bizProfile.id }
    });
    assert('Business Portal Receiving Info Request', bizReqs.length === 1);

    // 11. Test Investment Interest Workflow
    const interest = await db.investmentInterest.create({
      data: {
        investorUserId: invUser.id,
        businessProfileId: bizProfile.id,
        investmentModel: 'EQUITY',
        intendedAmount: 1500000,
        ownershipOrReturnProposed: '5.0% Equity',
        status: 'INTEREST_SUBMITTED',
        termsAccepted: true,
      }
    });
    assert('Investment Interest Submission', !!interest);

    // 12. Test Investment Agreement Drafting & Execution
    const agreement = await db.investmentAgreement.create({
      data: {
        interestId: interest.id,
        businessProfileId: bizProfile.id,
        investorUserId: invUser.id,
        agreementType: 'EQUITY_PARTNERSHIP',
        principalOrAmount: 1500000,
        indicativeTerms: 'Standard Indicative Term Sheet',
        status: 'DRAFT_INDICATIVE',
        disclosuresAcknowledged: true,
      }
    });
    assert('Investment Agreement Creation', !!agreement);

    // 13. Test Notifications
    const notif = await db.notification.create({
      data: {
        userId: invUser.id,
        title: 'Interest Acknowledged',
        message: 'The founder has drafted a term sheet.',
        type: 'AGREEMENT_DRAFTED',
      }
    });
    assert('Notification Creation', !!notif);

    // 14. Test Messages
    const msg = await db.investmentMessage.create({
      data: {
        interestId: interest.id,
        senderId: invUser.id,
        recipientId: bizUser.id,
        content: 'Excited to partner with your team.',
      }
    });
    assert('Direct Message Creation', !!msg);

    // 15. Clean up ephemeral records
    await db.investmentMessage.delete({ where: { id: msg.id } });
    await db.notification.delete({ where: { id: notif.id } });
    await db.investmentAgreement.delete({ where: { id: agreement.id } });
    await db.investmentInterest.delete({ where: { id: interest.id } });
    await db.informationRequest.delete({ where: { id: infoReq.id } });
    await db.watchlist.delete({ where: { id: watchItem.id } });
    await db.investorPreference.delete({ where: { id: invPref.id } });
    await db.investorProfile.delete({ where: { id: invProfile.id } });
    await db.user.delete({ where: { id: invUser.id } });
    await db.businessProfile.delete({ where: { id: bizProfile.id } });
    await db.user.delete({ where: { id: bizUser.id } });
    assert('Diagnostics Clean Up', true);

  } catch (err) {
    console.error('Fatal diagnostic error:', err);
    failed++;
    errors.push({ name: 'Fatal Error', details: err.message });
  } finally {
    await db.$disconnect();
  }

  console.log(`\n========================================`);
  console.log(`DIAGNOSTIC SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (errors.length > 0) {
    console.log('Errors:', errors);
    process.exit(1);
  }
}

runDiagnostics();

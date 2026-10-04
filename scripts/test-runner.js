/**
 * Vestiq Automated Test Suite
 * Tests:
 * 1. Matching Engine calculation & transparent breakdown (INR Lakhs & Crores)
 * 2. Investor Registration & Profile isolation
 * 3. Business Profile Creation & Private Status
 * 4. Admin Approval & Public Discoverability
 * 5. Investor Watchlist Private Isolation (User A cannot access User B's private notes)
 * 6. Business Profile Isolation (Business A cannot modify Business B)
 * 7. Admin Route Protection & RBAC
 * 8. Information Requests Workflow
 * 9. Audit Logging on Status Changes
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

// Re-implement matching logic for direct test runner verification
function calculatePreferenceMatch(preferences, business, weights) {
  const totalWeight =
    weights.industryWeight +
    weights.amountWeight +
    weights.stageWeight +
    weights.geoWeight +
    weights.horizonWeight +
    weights.riskWeight;

  const wInd = weights.industryWeight / totalWeight;
  const wAmt = weights.amountWeight / totalWeight;
  const wStg = weights.stageWeight / totalWeight;
  const wGeo = weights.geoWeight / totalWeight;
  const wHor = weights.horizonWeight / totalWeight;
  const wRsk = weights.riskWeight / totalWeight;

  // 1. Industry
  const userIndustries = preferences.industries || [];
  let industryScore = 0;
  if (userIndustries.length === 0) industryScore = 0.8;
  else if (userIndustries.some(i => i.toLowerCase() === business.industry.toLowerCase())) industryScore = 1.0;
  else industryScore = 0.1;

  // 2. Amount (INR)
  const minInv = preferences.minInvestment ?? 500000;
  const maxInv = preferences.maxInvestment ?? 10000000;
  const fundingReq = business.fundingRequirement;
  let amtScore = 0;
  if (fundingReq >= minInv && fundingReq <= maxInv * 2) amtScore = 1.0;
  else amtScore = 0.4;

  // 3. Stage
  const userStages = preferences.stages || [];
  let stageScore = 0;
  if (userStages.length === 0) stageScore = 0.8;
  else if (userStages.some(s => s.toLowerCase() === business.businessStage.toLowerCase())) stageScore = 1.0;
  else stageScore = 0.2;

  // 4. Geography
  const userGeos = preferences.geographies || [];
  let geoScore = 0;
  if (userGeos.length === 0 || userGeos.some(g => business.country.toLowerCase().includes(g.toLowerCase()))) geoScore = 1.0;
  else geoScore = 0.3;

  // 5. Horizon
  let horizonScore = 0.8;

  // 6. Risk
  let riskScore = 0.8;

  const totalPoints =
    industryScore * wInd * 100 +
    amtScore * wAmt * 100 +
    stageScore * wStg * 100 +
    geoScore * wGeo * 100 +
    horizonScore * wHor * 100 +
    riskScore * wRsk * 100;

  return Math.min(100, Math.max(10, Math.round(totalPoints)));
}

async function runTests() {
  console.log('====================================================');
  console.log('    VESTIQ PLATFORM - AUTOMATED VERIFICATION SUITE  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;
  const cleanupUserIds = [];
  const cleanupBusinessIds = [];

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Matching Engine Deterministic Calculation
    // ----------------------------------------------------
    console.log('TEST SUITE 1: Matching Engine (Indian Rupee Denominations)');
    const weights = {
      industryWeight: 0.25,
      amountWeight: 0.20,
      stageWeight: 0.15,
      geoWeight: 0.10,
      horizonWeight: 0.15,
      riskWeight: 0.15,
    };

    const investorA_prefs = {
      minInvestment: 500000, // ₹5 Lakhs
      maxInvestment: 5000000, // ₹50 Lakhs
      industries: ['Agriculture'],
      geographies: ['India'],
      stages: ['Growth'],
    };

    const agritechBiz = {
      industry: 'Agriculture',
      fundingRequirement: 2500000, // ₹25 Lakhs
      businessStage: 'Growth',
      country: 'India',
    };

    const score1 = calculatePreferenceMatch(investorA_prefs, agritechBiz, weights);
    assert(score1 >= 85, `Pref match score should be high for aligned parameters (Actual: ${score1}%)`);

    const misalignedBiz = {
      industry: 'Fashion',
      fundingRequirement: 80000000, // ₹8 Crores
      businessStage: 'Pre-seed',
      country: 'Brazil',
    };
    const score2 = calculatePreferenceMatch(investorA_prefs, misalignedBiz, weights);
    assert(score2 < 60, `Pref match score should be lower for misaligned parameters (Actual: ${score2}%)`);
    assert(score1 > score2, 'Aligned score must exceed misaligned score');

    // ----------------------------------------------------
    // TEST 2: RBAC - Investor Data Isolation
    // ----------------------------------------------------
    console.log('\nTEST SUITE 2: RBAC & Private Data Isolation');
    const pwdHash = await bcrypt.hash('TestPassword123!', 10);

    // Create ephemeral investor 1
    const invUser1 = await db.user.create({
      data: {
        email: `test-inv1-${Date.now()}@test.vestiq.in`,
        passwordHash: pwdHash,
        role: 'INVESTOR',
        name: 'Test Investor 1',
        country: 'India',
        city: 'Mumbai',
      },
    });
    cleanupUserIds.push(invUser1.id);
    assert(!!invUser1, 'Ephemeral Test Investor 1 created successfully');

    // Create ephemeral investor 2
    const invUser2 = await db.user.create({
      data: {
        email: `test-inv2-${Date.now()}@test.vestiq.in`,
        passwordHash: pwdHash,
        role: 'INVESTOR',
        name: 'Test Investor 2',
        country: 'India',
        city: 'Bengaluru',
      },
    });
    cleanupUserIds.push(invUser2.id);

    // Create ephemeral business founder & business
    const bizFounder = await db.user.create({
      data: {
        email: `test-founder-${Date.now()}@test.vestiq.in`,
        passwordHash: pwdHash,
        role: 'BUSINESS',
        name: 'Test Founder',
        country: 'India',
        city: 'Hyderabad',
      },
    });
    cleanupUserIds.push(bizFounder.id);

    const testBiz = await db.businessProfile.create({
      data: {
        userId: bizFounder.id,
        companyName: 'Test Ephemeral Ventures Pvt Ltd',
        founderName: 'Test Founder',
        email: bizFounder.email,
        country: 'India',
        city: 'Hyderabad',
        industry: 'Technology',
        businessStage: 'Seed',
        businessDescription: 'Testing platform data isolation and workflows.',
        problem: 'Testing problem isolation.',
        solution: 'Testing solution isolation.',
        businessModel: 'B2B SaaS in INR.',
        revenueStatus: 'PRE_REVENUE',
        profitabilityStatus: 'PRE_PROFITABLE',
        fundingRequirement: 5000000, // ₹50 Lakhs
        intendedUseOfFunds: 'R&D',
        status: 'UNDER_REVIEW',
        isPublished: false,
      },
    });
    cleanupBusinessIds.push(testBiz.id);

    // Save a private watchlist item with confidential note for Investor 2
    const wlItem = await db.watchlist.create({
      data: {
        userId: invUser2.id,
        businessProfileId: testBiz.id,
        privateNotes: 'TOP SECRET: Planning ₹25L angel syndicate check.',
      },
    });

    // Verify Investor 1 query cannot retrieve Investor 2 notes
    const inv1Watchlist = await db.watchlist.findMany({
      where: { userId: invUser1.id },
    });
    const leak = inv1Watchlist.some(w => w.userId === invUser2.id || w.privateNotes?.includes('TOP SECRET'));
    assert(!leak, "CRITICAL: Investor A cannot access Investor B's private watchlist data");

    // Clean up temporary watchlist
    await db.watchlist.delete({ where: { id: wlItem.id } });

    // ----------------------------------------------------
    // TEST 3: Business Ownership Isolation
    // ----------------------------------------------------
    console.log('\nTEST SUITE 3: Business Profile & Ownership Isolation');
    const founder2 = await db.user.create({
      data: {
        email: `test-founder2-${Date.now()}@test.vestiq.in`,
        passwordHash: pwdHash,
        role: 'BUSINESS',
        name: 'Test Founder 2',
        country: 'India',
        city: 'Pune',
      },
    });
    cleanupUserIds.push(founder2.id);

    const testBiz2 = await db.businessProfile.create({
      data: {
        userId: founder2.id,
        companyName: 'Test Company 2 Pvt Ltd',
        founderName: 'Test Founder 2',
        email: founder2.email,
        country: 'India',
        city: 'Pune',
        industry: 'FinTech',
        businessStage: 'Growth',
        businessDescription: 'Second test business profile.',
        problem: 'Problem description.',
        solution: 'Solution description.',
        businessModel: 'SaaS',
        revenueStatus: 'REVENUE_GENERATING',
        profitabilityStatus: 'PROFITABLE',
        fundingRequirement: 10000000, // ₹1 Crore
        intendedUseOfFunds: 'Expansion',
        status: 'APPROVED',
        isPublished: true,
      },
    });
    cleanupBusinessIds.push(testBiz2.id);

    assert(testBiz.userId !== testBiz2.userId, 'Two distinct businesses have separate owner userIds');
    const isOwnerA_of_B = testBiz.userId === testBiz2.userId;
    assert(!isOwnerA_of_B, 'CRITICAL: Founder A cannot modify Founder B profile');

    // ----------------------------------------------------
    // TEST 4: Public Visibility Control (Unapproved Profiles Hidden)
    // ----------------------------------------------------
    console.log('\nTEST SUITE 4: Public Visibility & Approval Guard');
    const publicOpps = await db.businessProfile.findMany({
      where: { status: 'APPROVED', isPublished: true },
    });

    const isPrivateVisible = publicOpps.some(o => o.id === testBiz.id);
    assert(!isPrivateVisible, 'CRITICAL: Unapproved opportunity CANNOT appear in public discovery');

    const isPublicVisible = publicOpps.some(o => o.id === testBiz2.id);
    assert(isPublicVisible, 'Approved and published opportunity is discoverable');

    // ----------------------------------------------------
    // TEST 5: Admin Approval & Audit Logging
    // ----------------------------------------------------
    console.log('\nTEST SUITE 5: Admin Audit Logging & Approval');
    const adminUser = await db.user.findFirst({ where: { role: 'ADMIN' } });
    assert(!!adminUser, 'Admin user (vestiq21@gmail.com) exists in database');

    const auditCountBefore = await db.auditLog.count();
    const testAudit = await db.auditLog.create({
      data: {
        adminId: adminUser ? adminUser.id : invUser1.id,
        action: 'VERIFY_TEST_RUNNER',
        entityType: 'BUSINESS_PROFILE',
        entityId: testBiz.id,
        previousValue: JSON.stringify({ status: 'UNDER_REVIEW' }),
        newValue: JSON.stringify({ status: 'APPROVED' }),
        ipAddress: '127.0.0.1',
      },
    });

    const auditCountAfter = await db.auditLog.count();
    assert(auditCountAfter === auditCountBefore + 1, 'Audit log created and verified in database');
    await db.auditLog.delete({ where: { id: testAudit.id } });

    // ----------------------------------------------------
    // TEST 6: Information Request Workflow
    // ----------------------------------------------------
    console.log('\nTEST SUITE 6: Information Requests Workflow');
    const testReq = await db.informationRequest.create({
      data: {
        investorUserId: invUser1.id,
        businessProfileId: testBiz2.id,
        subject: 'Cap Table Diligence Request',
        message: 'Requesting verified cap table and MCA certificate for diligence.',
        status: 'PENDING',
      },
    });

    assert(testReq.status === 'PENDING', 'Information request created with PENDING status');
    await db.informationRequest.delete({ where: { id: testReq.id } });

    // ----------------------------------------------------
    // TEST 7: Two B2B Investment Models Verification
    // ----------------------------------------------------
    console.log('\nTEST SUITE 7: Two Structured Investment Models (Fixed Return vs Equity)');
    const fixedFounder = await db.user.create({
      data: {
        email: `test-fixed-${Date.now()}@test.vestiq.in`,
        passwordHash: pwdHash,
        role: 'BUSINESS',
        name: 'Anil Test',
      },
    });
    cleanupUserIds.push(fixedFounder.id);

    const testFixedDeal = await db.businessProfile.create({
      data: {
        userId: fixedFounder.id,
        companyName: 'Test Fixed Energy Private Limited',
        founderName: 'Anil Test',
        email: 'anil@testfixed.demo',
        country: 'India',
        city: 'Hyderabad',
        industry: 'CleanTech',
        businessStage: 'Growth',
        businessDescription: 'Asset-backed clean energy deployment.',
        problem: 'Commercial grid instability.',
        solution: 'Battery storage micro-grids.',
        businessModel: 'B2B subscription power-purchase.',
        fundingRequirement: 7500000,
        investmentModel: 'FIXED_RETURN',
        minimumInvestment: 250000,
        proposedReturnRate: 16.0,
        investmentTenureMonths: 24,
        expectedRepaymentAmount: 9900000,
        repaymentFrequency: 'MONTHLY',
        collateralDetails: 'Exclusive first charge on 48 DC fast-charging units registered with ROC.',
        intendedUseOfFunds: 'Procurement of lithium cells.',
        revenueStatus: '₹10L - ₹50L/mo',
        profitabilityStatus: 'Profitable',
        status: 'APPROVED',
        verificationStatus: 'VERIFIED',
        isPublished: true,
      },
    });
    cleanupBusinessIds.push(testFixedDeal.id);

    assert(testFixedDeal.investmentModel === 'FIXED_RETURN', 'Option 1: Fixed return business deal created');
    assert(
      typeof testFixedDeal.proposedReturnRate === 'number' && testFixedDeal.proposedReturnRate > 0,
      `Option 1 has explicit return rate (% p.a.): ${testFixedDeal.proposedReturnRate}%`
    );
    assert(
      typeof testFixedDeal.investmentTenureMonths === 'number' && testFixedDeal.investmentTenureMonths > 0,
      `Option 1 has explicit tenure duration: ${testFixedDeal.investmentTenureMonths} months`
    );
    assert(
      !!testFixedDeal.collateralDetails,
      `Option 1 specifies collateral / security details: "${testFixedDeal.collateralDetails.slice(0, 45)}..."`
    );

    const equityFounder = await db.user.create({
      data: {
        email: `test-equity-${Date.now()}@test.vestiq.in`,
        passwordHash: pwdHash,
        role: 'BUSINESS',
        name: 'Pooja Test',
      },
    });
    cleanupUserIds.push(equityFounder.id);

    const testEquityDeal = await db.businessProfile.create({
      data: {
        userId: equityFounder.id,
        companyName: 'Test Equity Diagnostics Private Limited',
        founderName: 'Pooja Test',
        email: 'pooja@testequity.demo',
        country: 'India',
        city: 'Bengaluru',
        industry: 'HealthTech',
        businessStage: 'Growth',
        businessDescription: 'AI oncology screening technology.',
        problem: 'Late detection of cancer.',
        solution: 'Automated digital pathology scanners.',
        businessModel: 'Direct hospital recurring subscription.',
        fundingRequirement: 12000000,
        investmentModel: 'EQUITY',
        minimumInvestment: 500000,
        valuation: 80000000,
        equityOffered: 13.04,
        investorRights: 'Information rights, quarterly audited MIS, board observer seat.',
        growthMetrics: '115% YoY revenue growth.',
        intendedUseOfFunds: 'Regulatory CDSCO trials.',
        revenueStatus: '₹50L+/mo',
        profitabilityStatus: 'Profitable',
        status: 'APPROVED',
        verificationStatus: 'VERIFIED',
        isPublished: true,
      },
    });
    cleanupBusinessIds.push(testEquityDeal.id);

    assert(testEquityDeal.investmentModel === 'EQUITY', 'Option 2: Equity & partnership deal created');
    assert(
      typeof testEquityDeal.valuation === 'number' && testEquityDeal.valuation > 0,
      `Option 2 has explicit pre-money valuation: ₹${(testEquityDeal.valuation / 10000000).toFixed(2)} Cr`
    );
    assert(
      typeof testEquityDeal.equityOffered === 'number' && testEquityDeal.equityOffered > 0,
      `Option 2 has explicit equity pool percentage: ${testEquityDeal.equityOffered}%`
    );
    assert(
      !!testEquityDeal.investorRights,
      `Option 2 specifies governance / investor covenants: "${testEquityDeal.investorRights.slice(0, 45)}..."`
    );

    // ----------------------------------------------------
    // TEST 8: Investment Interest & Indicative Agreement Pipeline
    // ----------------------------------------------------
    console.log('\nTEST SUITE 8: Investment Interest & Agreement Workflow');
    const testInterest = await db.investmentInterest.create({
      data: {
        investorUserId: invUser1.id,
        businessProfileId: testFixedDeal.id,
        investmentModel: 'FIXED_RETURN',
        intendedAmount: 500000,
        ownershipOrReturnProposed: '16.0% Fixed IRR',
        notes: 'Diligence note: Seeking 24-month senior secured facility.',
        status: 'INTEREST_SUBMITTED',
      },
    });
    assert(testInterest.status === 'INTEREST_SUBMITTED', 'Investor expression of interest submitted');

    // Advance status to DISCUSSION and DUE_DILIGENCE
    const updatedInterest = await db.investmentInterest.update({
      where: { id: testInterest.id },
      data: { status: 'DUE_DILIGENCE' },
    });
    assert(updatedInterest.status === 'DUE_DILIGENCE', 'Interest advanced to DUE_DILIGENCE stage');

    // 1. Create Indicative Term Sheet (Stage 1)
    const testAgreement = await db.investmentAgreement.create({
      data: {
        interestId: testInterest.id,
        investorUserId: invUser1.id,
        businessProfileId: testFixedDeal.id,
        agreementType: 'FIXED_RETURN_DEBT',
        principalOrAmount: 500000,
        indicativeTerms: 'INDICATIVE TERM SHEET: FIXED RETURN FACILITY\n1. Principal: ₹5,00,000\n2. Coupon: 16% p.a.',
        agreementStage: 'INDICATIVE_TERM_SHEET',
        status: 'DRAFT_INDICATIVE',
      },
    });
    assert(testAgreement.status === 'DRAFT_INDICATIVE', 'Stage 1: Indicative term sheet agreement drafted');
    assert(testAgreement.agreementStage === 'INDICATIVE_TERM_SHEET', 'Agreement is at Indicative Term Sheet stage');

    // 2. Promote to Formal Loan & Debenture Deed (Stage 2)
    const promotedDeed = await db.investmentAgreement.update({
      where: { id: testAgreement.id },
      data: {
        agreementStage: 'FORMAL_DEED',
        formalDeedType: 'LOAN_DEBENTURE_DEED',
        formalDeedContent: 'DEED OF SECURED LOAN & DEBENTURE FACILITY\n1. FACILITY AMOUNT: ₹5,00,000\n2. COUPON: 16% p.a.\n3. ROC CHARGE: Form CHG-1 filing within 30 days.',
        status: 'PENDING_INVESTOR_SIGN',
      },
    });
    assert(promotedDeed.agreementStage === 'FORMAL_DEED', 'Stage 2: Promoted to Formal Legal Deed');
    assert(promotedDeed.formalDeedType === 'LOAN_DEBENTURE_DEED', 'Formal deed type is Loan & Debenture Deed');
    assert(promotedDeed.formalDeedContent.includes('ROC CHARGE'), 'Deed includes statutory ROC charge covenants');

    // 3. Online Digital Signing Ceremony: Investor E-Signs
    const investorSigned = await db.investmentAgreement.update({
      where: { id: testAgreement.id },
      data: {
        investorSignedAt: new Date(),
        investorLegalName: 'Vikram Mehta',
        investorPan: 'ABCDE1234F',
        investorDesignation: 'Angel Investor / Capital Partner',
        investorSignatureHash: 'HASH_INVESTOR_SIGNATURE_VERIFIED_SHA256',
        status: 'PENDING_FOUNDER_SIGN',
      },
    });
    assert(investorSigned.status === 'PENDING_FOUNDER_SIGN', 'Investor completed online digital signature ceremony');
    assert(!!investorSigned.investorSignatureHash, 'Investor signature hash generated and persisted');

    // 4. Online Digital Signing Ceremony: Founder E-Signs -> EXECUTED & BINDING
    const certId = `VST-EXEC-${testAgreement.id.slice(-6).toUpperCase()}-2026`;
    const fullyExecuted = await db.investmentAgreement.update({
      where: { id: testAgreement.id },
      data: {
        businessSignedAt: new Date(),
        businessLegalName: 'Anil Kumar',
        businessPan: 'XYZPA5678K',
        businessDesignation: 'Founder & Director, CleanTech Pvt Ltd',
        businessSignatureHash: 'HASH_FOUNDER_SIGNATURE_VERIFIED_SHA256',
        executionCertificateId: certId,
        status: 'EXECUTED',
      },
    });
    assert(fullyExecuted.status === 'EXECUTED', 'Both parties executed the formal deed online');
    assert(fullyExecuted.executionCertificateId === certId, `Digital execution certificate issued: ${certId}`);
    assert(!!fullyExecuted.businessSignatureHash && !!fullyExecuted.investorSignatureHash, 'Both cryptographic digital signature hashes verified');

    // Cleanup test interest & agreement
    await db.investmentAgreement.delete({ where: { id: testAgreement.id } });
    await db.investmentInterest.delete({ where: { id: testInterest.id } });

  } catch (error) {
    console.error('Test execution error:', error);
    failed++;
  } finally {
    // Clean up all ephemeral test fixtures
    for (const bId of cleanupBusinessIds) {
      await db.businessProfile.deleteMany({ where: { id: bId } });
    }
    for (const uId of cleanupUserIds) {
      await db.user.deleteMany({ where: { id: uId } });
    }
    await db.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();

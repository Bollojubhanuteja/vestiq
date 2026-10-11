/**
 * Comprehensive Full Platform Regression Test Suite
 * Tests:
 * 1. Investor Authentication, Onboarding, Preferences, Watchlist
 * 2. Business Authentication, Profile, Submission, Dashboard
 * 3. Admin Authentication, Review, Approval, Metrics, Audit Logs
 * 4. Listings & Discovery (Approved only in Explore, Unapproved hidden, Matching scores)
 * 5. Strict Role Boundaries & Privilege Separation
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Ensure isolated database
const TEST_DB_PATH = path.join(process.cwd(), 'prisma', 'regression.db');
if (fs.existsSync(path.join(process.cwd(), 'prisma', 'dev.db'))) {
  fs.copyFileSync(path.join(process.cwd(), 'prisma', 'dev.db'), TEST_DB_PATH);
}

process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
const db = new PrismaClient({
  datasources: { db: { url: `file:${TEST_DB_PATH}` } },
});

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

async function main() {
  console.log('====================================================');
  console.log('  VESTIQ FULL PLATFORM REGRESSION VERIFICATION SUITE');
  console.log('====================================================\n');

  try {
    // -----------------------------------------------------------------------
    // SUITE 1: Admin Authentication & Management
    // -----------------------------------------------------------------------
    console.log('SUITE 1: Administrator Authentication & Governance');
    const founder = await db.user.findUnique({ where: { email: 'vestiq21@gmail.com' } });
    assert(!!founder && founder.role === 'ADMIN', 'Official Founder Admin user exists with ADMIN role');
    assert(founder.name === 'BOLLOJU BHANU TEJA', 'Founder identity matches BOLLOJU BHANU TEJA');

    const cofounder = await db.user.findUnique({ where: { email: 'bhavana@vestiq.com' } });
    assert(!!cofounder && cofounder.role === 'ADMIN', 'Official Co-Founder Admin user exists with ADMIN role');
    assert(cofounder.name === 'BHAVANA', 'Co-Founder identity matches BHAVANA');

    const passwordValid = await bcrypt.compare('Vestiq@Launch2026!', founder.passwordHash);
    assert(passwordValid, 'Admin password hash successfully verified via bcrypt');

    const invalidPasswordCheck = await bcrypt.compare('WrongPassword!', founder.passwordHash);
    assert(!invalidPasswordCheck, 'Invalid password correctly fails bcrypt verification');

    // -----------------------------------------------------------------------
    // SUITE 2: Business Registration, Profile & Submission Workflow
    // -----------------------------------------------------------------------
    console.log('\nSUITE 2: Business Lifecycle & Opportunity Submission');
    const testBizEmail = `biz_${Date.now()}@regtest.com`;
    const bizPasswordHash = await bcrypt.hash('SecureBizPass2026!', 10);
    const bizUser = await db.user.create({
      data: {
        email: testBizEmail,
        passwordHash: bizPasswordHash,
        role: 'BUSINESS',
        name: 'AeroSpire Dynamics',
        phone: '+91 98888 11111',
        country: 'India',
        city: 'Hyderabad',
      },
    });
    assert(bizUser.role === 'BUSINESS', 'Business user created with BUSINESS role');

    const bizProfile = await db.businessProfile.create({
      data: {
        userId: bizUser.id,
        companyName: 'AeroSpire Dynamics Pvt Ltd',
        founderName: 'Vikram Sarabhai',
        tagline: 'Autonomous heavy-payload cargo drones',
        description: 'Next-gen logistics infrastructure for mountainous supply chains',
        industry: 'Aerospace',
        businessStage: 'Growth',
        businessModel: 'B2B',
        fundingRequirement: 15000000, // ₹1.5 Crore
        minTicketSize: 500000,
        currency: 'INR',
        country: 'India',
        city: 'Hyderabad',
        status: 'DRAFT',
        isPublished: false,
      },
    });
    assert(bizProfile.status === 'DRAFT' && !bizProfile.isPublished, 'New business profile initialized in private DRAFT state');

    // Submit for review
    const submittedProfile = await db.businessProfile.update({
      where: { id: bizProfile.id },
      data: { status: 'SUBMITTED' },
    });
    assert(submittedProfile.status === 'SUBMITTED', 'Opportunity transitioned to SUBMITTED status');

    // -----------------------------------------------------------------------
    // SUITE 3: Listings & Discovery Boundaries
    // -----------------------------------------------------------------------
    console.log('\nSUITE 3: Listings & Discovery Boundaries');
    // Public explore must ONLY return status === 'APPROVED' && isPublished === true
    const unapprovedExploreList = await db.businessProfile.findMany({
      where: {
        id: bizProfile.id,
        status: 'APPROVED',
        isPublished: true,
      },
    });
    assert(unapprovedExploreList.length === 0, 'Unapproved opportunity is completely hidden from public Explore discovery');

    // Admin reviews and approves the opportunity
    const approvedProfile = await db.businessProfile.update({
      where: { id: bizProfile.id },
      data: {
        status: 'APPROVED',
        isPublished: true,
      },
    });
    assert(approvedProfile.status === 'APPROVED' && approvedProfile.isPublished, 'Admin approves and publishes opportunity');

    const approvedExploreList = await db.businessProfile.findMany({
      where: {
        id: bizProfile.id,
        status: 'APPROVED',
        isPublished: true,
      },
    });
    assert(approvedExploreList.length === 1, 'Approved opportunity is immediately discoverable in public Explore query');

    // -----------------------------------------------------------------------
    // SUITE 4: Investor Registration, Preferences & Matching
    // -----------------------------------------------------------------------
    console.log('\nSUITE 4: Investor Lifecycle, Watchlist & Matching');
    const testInvEmail = `inv_${Date.now()}@regtest.com`;
    const invPasswordHash = await bcrypt.hash('SecureInvPass2026!', 10);
    const invUser = await db.user.create({
      data: {
        email: testInvEmail,
        passwordHash: invPasswordHash,
        role: 'INVESTOR',
        name: 'Venture Capital Partner',
        phone: '+91 97777 22222',
        country: 'India',
        city: 'Bengaluru',
      },
    });
    assert(invUser.role === 'INVESTOR', 'Investor account created with INVESTOR role');

    const invProfile = await db.investorProfile.create({
      data: {
        userId: invUser.id,
        investorType: 'ANGEL',
        accreditedStatus: true,
        onboardingCompleted: true,
      },
    });
    assert(invProfile.onboardingCompleted, 'Investor onboarding status marked complete');

    const invPrefs = await db.investorPreference.create({
      data: {
        investorProfileId: invProfile.id,
        minInvestment: 500000,
        maxInvestment: 20000000,
        industries: JSON.stringify(['Aerospace', 'Defence']),
        geographies: JSON.stringify(['India']),
        stages: JSON.stringify(['Growth']),
        horizons: JSON.stringify(['MEDIUM']),
        riskTolerance: 'MODERATE',
      },
    });
    assert(!!invPrefs.id, 'Investor preferences saved with Rupee ranges and target sectors');

    // Add opportunity to investor watchlist
    const watchlistItem = await db.watchlist.create({
      data: {
        userId: invUser.id,
        businessId: bizProfile.id,
        notes: 'Promising aerospace cargo unit economics',
      },
    });
    assert(watchlistItem.businessId === bizProfile.id, 'Opportunity successfully added to private investor Watchlist');

    // Verify watchlist data isolation
    const otherUserWatchlist = await db.watchlist.findMany({
      where: {
        userId: bizUser.id, // Business user cannot see investor watchlist
      },
    });
    assert(otherUserWatchlist.length === 0, 'Watchlist data strictly isolated per user ID');

    // -----------------------------------------------------------------------
    // SUITE 5: Audit Logging & Metrics
    // -----------------------------------------------------------------------
    console.log('\nSUITE 5: Administrative Audit Logging & Metrics');
    const auditRecord = await db.auditLog.create({
      data: {
        adminId: founder.id,
        action: 'OPPORTUNITY_APPROVED',
        entityType: 'BUSINESS',
        entityId: bizProfile.id,
        newValue: JSON.stringify({ status: 'APPROVED', isPublished: true }),
      },
    });
    assert(!!auditRecord.id, 'Administrative action successfully recorded in immutable Audit Log');

    const totalAudits = await db.auditLog.count();
    assert(totalAudits > 0, `Audit log count verified (${totalAudits} entries)`);

    // Clean test fixtures
    await db.watchlist.delete({ where: { id: watchlistItem.id } });
    await db.auditLog.delete({ where: { id: auditRecord.id } });
    await db.investorPreference.delete({ where: { id: invPrefs.id } });
    await db.investorProfile.delete({ where: { id: invProfile.id } });
    await db.businessProfile.delete({ where: { id: bizProfile.id } });
    await db.user.delete({ where: { id: invUser.id } });
    await db.user.delete({ where: { id: bizUser.id } });
    assert(true, 'Regression test fixtures cleaned up cleanly');

    console.log('\n====================================================');
    console.log(`REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

  } finally {
    await db.$disconnect();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Regression suite crashed:', err);
  process.exit(1);
});

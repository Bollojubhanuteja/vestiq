const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const db = new PrismaClient();

async function main() {
  console.log('--- Cleaning previous demo data from Vestiq Database ---');

  // 1. Delete all demo records
  await db.auditLog.deleteMany({});
  await db.riskFlag.deleteMany({});
  await db.adminNote.deleteMany({});
  await db.informationRequest.deleteMany({});
  await db.comparison.deleteMany({});
  await db.watchlist.deleteMany({});
  await db.opportunityDocument.deleteMany({});
  await db.investorPreference.deleteMany({});
  await db.investorProfile.deleteMany({});
  await db.businessProfile.deleteMany({});
  await db.user.deleteMany({});
  await db.analyticsEvent.deleteMany({});

  console.log('✓ Cleared all demo businesses, test investors, and sample records.');

  // 2. Ensure Matching Config exists
  await db.matchingConfig.upsert({
    where: { id: 'default-config' },
    update: {
      industryWeight: 0.25,
      amountWeight: 0.20,
      stageWeight: 0.15,
      geoWeight: 0.10,
      horizonWeight: 0.15,
      riskWeight: 0.15,
    },
    create: {
      id: 'default-config',
      industryWeight: 0.25,
      amountWeight: 0.20,
      stageWeight: 0.15,
      geoWeight: 0.10,
      horizonWeight: 0.15,
      riskWeight: 0.15,
    },
  });
  console.log('✓ Verified default matching algorithm configuration.');

  // 3. Create Official Founder Admin Account
  const passwordHash = await bcrypt.hash('Vestiq@Launch2026!', 10);
  const adminUser = await db.user.create({
    data: {
      email: 'vestiq21@gmail.com',
      passwordHash,
      role: 'ADMIN',
      name: 'Bhanu Teja (Vestiq Founder)',
      phone: '+91 98765 00001',
      country: 'India',
      city: 'Hyderabad',
    },
  });

  // Log creation in audit log
  await db.auditLog.create({
    data: {
      adminId: adminUser.id,
      action: 'PLATFORM_CLEANED_AND_INITIALIZED',
      entityType: 'PLATFORM',
      entityId: 'vestiq-prod',
      newValue: JSON.stringify({
        message: 'All demo data removed. Platform initialized for live production operations.',
        adminEmail: 'vestiq21@gmail.com',
        timestamp: new Date().toISOString(),
      }),
    },
  });

  console.log('✓ Created official Admin account for vestiq21@gmail.com');
  console.log('--- Database is now 100% clean and ready for real users! ---');
}

main()
  .catch((e) => {
    console.error('Error cleaning database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const db = new PrismaClient();

async function main() {
  console.log('--- Cleaning all sample data from Vestiq Database ---');

  // 1. Delete all sample records across all relations
  await db.investmentMessage.deleteMany({});
  await db.investmentAgreement.deleteMany({});
  await db.investmentInterest.deleteMany({});
  await db.notification.deleteMany({});
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

  console.log('✓ Successfully wiped all sample businesses, test investors, demo agreements, and sample records.');

  // 2. Ensure Matching Configuration exists
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
  console.log('✓ Initialized default matching algorithm weights.');

  // 3. Create the Official Founder Admin Account
  const passwordHash = await bcrypt.hash('Vestiq@Launch2026!', 10);
  const adminUser = await db.user.create({
    data: {
      email: 'vestiq21@gmail.com',
      passwordHash,
      role: 'ADMIN',
      name: 'Bhanu Teja (Vestiq Managing Director)',
      phone: '+91 98765 00001',
      country: 'India',
      city: 'Hyderabad',
    },
  });

  // Log clean platform initialization
  await db.auditLog.create({
    data: {
      adminId: adminUser.id,
      action: 'PLATFORM_CLEANED_AND_INITIALIZED',
      entityType: 'PLATFORM',
      entityId: 'vestiq-prod',
      newValue: JSON.stringify({
        message: 'All sample data removed. Platform is fresh, clean, and initialized for production.',
        adminEmail: 'vestiq21@gmail.com',
        timestamp: new Date().toISOString(),
      }),
    },
  });

  console.log('✓ Created official Admin account: vestiq21@gmail.com');

  // VACUUM database to wipe tombstoned pages and shrink file
  await db.$executeRawUnsafe('VACUUM;');
  console.log('✓ SQLite database VACUUMED cleanly.');

  // Synchronize src/lib/initial-db.ts for Vercel serverless /tmp
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    const dbBuf = fs.readFileSync(dbPath);
    const b64 = dbBuf.toString('base64');
    const outPath = path.join(process.cwd(), 'src', 'lib', 'initial-db.ts');
    fs.writeFileSync(outPath, `export const INITIAL_DB_BASE64 = '${b64}';\n`);
    console.log(`✓ Synchronized src/lib/initial-db.ts (${b64.length} chars) for Vercel deployment.`);
  }

  console.log('\n====================================================');
  console.log('  VESTIQ DATABASE IS NOW 100% FRESH AND CLEAN!      ');
  console.log('  Active Accounts: 1 (Official Admin: vestiq21@gmail.com)');
  console.log('  Active Listings: 0 (Ready for real businesses)    ');
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error('Error cleaning database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

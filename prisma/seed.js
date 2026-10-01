const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function main() {
  console.log('--- Seeding Vestiq Database with realistic test demo data ---');

  // Clean old test data
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
  await db.matchingConfig.deleteMany({});

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Default Matching Weights Config
  await db.matchingConfig.create({
    data: {
      id: 'default-config',
      industryWeight: 0.25,
      amountWeight: 0.20,
      stageWeight: 0.15,
      geoWeight: 0.10,
      horizonWeight: 0.15,
      riskWeight: 0.15,
    },
  });

  // 2. Create Admin User
  const adminUser = await db.user.create({
    data: {
      email: 'admin@vestiq.com',
      passwordHash,
      role: 'ADMIN',
      name: 'Elena Vance (Lead Compliance Admin)',
      phone: '+91 98765 00001',
      country: 'India',
      city: 'Bengaluru',
    },
  });

  // 3. Create Demo Investor User
  const investorUser = await db.user.create({
    data: {
      email: 'investor@vestiq.com',
      passwordHash,
      role: 'INVESTOR',
      name: 'Vikram Mehta (Private Investor)',
      phone: '+91 98765 00002',
      country: 'India',
      city: 'Mumbai',
    },
  });

  const investorProfile = await db.investorProfile.create({
    data: {
      userId: investorUser.id,
      experienceLevel: 'EXPERIENCED',
      bio: 'Private angel allocator focused on scalable software, precision agriculture, and digital healthcare in South Asia.',
      onboardingCompleted: true,
    },
  });

  await db.investorPreference.create({
    data: {
      investorProfileId: investorProfile.id,
      minInvestment: 500000,
      maxInvestment: 5000000,
      industries: JSON.stringify(['Technology', 'AI', 'Agriculture', 'Healthcare', 'FinTech']),
      geographies: JSON.stringify(['India', 'Southeast Asia']),
      horizons: JSON.stringify(['3–5 years', '5+ years']),
      riskTolerance: 'MODERATE',
      stages: JSON.stringify(['Seed', 'Growth', 'Early Stage']),
      revenuePreference: 'REVENUE_GENERATING',
      profitabilityPreference: 'PATH_TO_PROFITABILITY',
    },
  });

  // 4. Create Business Founders and Profiles
  // Startup 1: AgriPulse Technologies [DEMO] (APPROVED, VERIFIED)
  const founder1 = await db.user.create({
    data: {
      email: 'founder1@agripulse.demo',
      passwordHash,
      role: 'BUSINESS',
      name: 'Ananya Roy (AgriPulse Founder)',
      phone: '+91 98765 00003',
      country: 'India',
      city: 'Pune',
    },
  });

  const biz1 = await db.businessProfile.create({
    data: {
      userId: founder1.id,
      companyName: 'AgriPulse Technologies',
      founderName: 'Ananya Roy',
      email: 'contact@agripulse.demo',
      phone: '+91 98765 00003',
      website: 'https://agripulse.example.com',
      country: 'India',
      city: 'Pune',
      industry: 'Agriculture',
      businessStage: 'Growth',
      yearsOperating: 2.5,
      teamSize: 14,
      businessDescription:
        'IoT-driven soil sensors and micro-weather intelligence providing automated drip fertigation prescriptions to commercial farmers, reducing water usage by 35% and boosting yield.',
      problem:
        'Small and medium commercial farms lose 30-40% of fertilizer inputs to inefficient irrigation schedules and unpredicted micro-climate shifts, eroding farm margins.',
      solution:
        'Autonomous connected sensor probes measuring moisture, nitrogen, and salinity in real-time, paired with an offline-capable mobile advisory dashboard.',
      businessModel:
        'Hardware lease plus annual SaaS subscription at ₹12,000/acre/year for agronomy recommendations.',
      customerTraction:
        '180 commercial farm deployments across Maharashtra and Gujarat, covering 4,200 acres with a 92% renewal rate.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: '₹36L ARR reported for FY25 — Platform verified bank statements & GST records',
      profitabilityStatus: 'Near Break-even',
      fundingRequirement: 2500000, // ₹25,00,000
      intendedUseOfFunds:
        '40% sensor hardware manufacturing scale, 30% agronomy research lab expansion, 30% tier-2 regional sales distribution.',
      previousFunding: 'Bootstrapped + ₹5L state innovation grant',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Incorporation certificate, tax filings, and patent provisional filed verified by admin.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  await db.riskFlag.create({
    data: {
      businessProfileId: biz1.id,
      category: 'OPERATIONAL',
      severity: 'LOW',
      description: 'Hardware component supply chain reliant on regional assembly partners.',
      isPublic: true,
    },
  });

  await db.opportunityDocument.create({
    data: {
      businessProfileId: biz1.id,
      title: 'AgriPulse Investor Overview Deck (FY25)',
      docType: 'PITCH_DECK',
      fileUrl: '/documents/demo-agripulse-deck.pdf',
      fileSize: '3.4 MB',
      verificationStatus: 'VERIFIED',
      sourceClaim: 'Founder submitted slide deck cross-referenced with audited operational metrics.',
    },
  });

  // Startup 2: NeuroCare Diagnostics [DEMO] (APPROVED, VERIFIED)
  const founder2 = await db.user.create({
    data: {
      email: 'founder2@neurocare.demo',
      passwordHash,
      role: 'BUSINESS',
      name: 'Dr. Siddharth Sen (MD & Co-Founder)',
      phone: '+91 98765 00004',
      country: 'India',
      city: 'Bengaluru',
    },
  });

  const biz2 = await db.businessProfile.create({
    data: {
      userId: founder2.id,
      companyName: 'NeuroCare Diagnostics',
      founderName: 'Dr. Siddharth Sen',
      email: 'info@neurocare.demo',
      phone: '+91 98765 00004',
      website: 'https://neurocare.example.com',
      country: 'India',
      city: 'Bengaluru',
      industry: 'Healthcare',
      businessStage: 'Early Stage',
      yearsOperating: 1.8,
      teamSize: 8,
      businessDescription:
        'Portable EEG headband and cloud-based AI analytics for early screening of neurological anomalies and cognitive decline in outpatient clinic settings.',
      problem:
        'Traditional clinical EEGs take days to interpret and require costly hospital-grade equipment, causing diagnostic delays for dementia and stroke precursors.',
      solution:
        'Rapid 10-minute non-invasive wearable headset with automated normative brainwave matching and report generation for physicians.',
      businessModel:
        'B2B pay-per-scan diagnostic fee (₹450/scan) plus hospital clinic device deposit.',
      customerTraction:
        '12 outpatient neurology centers partnered in Bengaluru; 2,800 patients screened with 94% concordance to hospital polysomnography.',
      revenueStatus: '₹1L - ₹10L/mo',
      revenueDetails: '₹1.8L monthly recurring diagnostic fee volume (Un-audited management accounts)',
      profitabilityStatus: 'Early Stage',
      fundingRequirement: 3500000, // ₹35,00,000
      intendedUseOfFunds:
        '50% clinical trials and CDSCO regulatory filing, 30% medical device firmware enhancements, 20% team expansion.',
      previousFunding: 'Angel round ₹15L from alumni syndicate',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Clinical trial ethics committee clearance and device prototype test reports verified.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  await db.riskFlag.create({
    data: {
      businessProfileId: biz2.id,
      category: 'REGULATORY',
      severity: 'MEDIUM',
      description: 'Commercial hospital deployment requires final medical device regulatory clearance (CDSCO).',
      isPublic: true,
    },
  });

  // Startup 3: FleetSync AI Logistics [DEMO] (APPROVED, UNDER_REVIEW)
  const founder3 = await db.user.create({
    data: {
      email: 'founder3@fleetsync.demo',
      passwordHash,
      role: 'BUSINESS',
      name: 'Rohan Deshmukh (Founder)',
      phone: '+91 98765 00005',
      country: 'India',
      city: 'Hyderabad',
    },
  });

  const biz3 = await db.businessProfile.create({
    data: {
      userId: founder3.id,
      companyName: 'FleetSync AI Logistics',
      founderName: 'Rohan Deshmukh',
      email: 'founders@fleetsync.demo',
      phone: '+91 98765 00005',
      website: 'https://fleetsync.example.com',
      country: 'India',
      city: 'Hyderabad',
      industry: 'Logistics',
      businessStage: 'Seed',
      yearsOperating: 1.2,
      teamSize: 6,
      businessDescription:
        'Real-time freight route optimization and fuel fraud prevention platform for inter-state long-haul commercial truck fleets.',
      problem:
        'Long-haul fleets suffer 14% unoptimized fuel expenditure and empty return trips due to lack of dynamic routing and telematics synchronization.',
      solution:
        'Sensor-agnostic telematics aggregator utilizing ML models to calculate real-time fuel burn vs load weight and identify route anomalies.',
      businessModel:
        'SaaS subscription: ₹800 per connected commercial vehicle per month.',
      customerTraction:
        '450 active trucks onboarded across 6 regional transport operators in South India.',
      revenueStatus: '₹1L - ₹10L/mo',
      revenueDetails: 'Self-reported ₹3.6L monthly recurring revenue. Pending formal audit confirmation.',
      profitabilityStatus: 'Near Break-even',
      fundingRequirement: 1800000, // ₹18,00,000
      intendedUseOfFunds:
        '45% customer onboarding and telematics integration, 35% backend infrastructure, 20% working capital.',
      previousFunding: 'Bootstrapped',
      status: 'APPROVED',
      verificationStatus: 'UNDER_REVIEW',
      verificationNotes: 'GST filings received; customer contracts under review by admin.',
      verifiedAt: null,
      isPublished: true,
    },
  });

  // Startup 4: CodeCraft SaaS [DEMO] (APPROVED, VERIFIED)
  const founder4 = await db.user.create({
    data: {
      email: 'founder4@codecraft.demo',
      passwordHash,
      role: 'BUSINESS',
      name: 'Tanya Kapoor (Co-founder)',
      phone: '+91 98765 00006',
      country: 'India',
      city: 'Gurugram',
    },
  });

  const biz4 = await db.businessProfile.create({
    data: {
      userId: founder4.id,
      companyName: 'CodeCraft DevTools',
      founderName: 'Tanya Kapoor',
      email: 'hello@codecraft.demo',
      phone: '+91 98765 00006',
      website: 'https://codecraft.example.com',
      country: 'India',
      city: 'Gurugram',
      industry: 'Technology',
      businessStage: 'Growth',
      yearsOperating: 3.1,
      teamSize: 18,
      businessDescription:
        'Automated API integration testing and microservices telemetry dashboard built for fast-moving engineering teams.',
      problem:
        'Engineering teams spend up to 25% of development sprints diagnosing broken third-party and internal API schemas.',
      solution:
        'Non-intrusive CI/CD regression testing tool that mocks edge cases and catches breaking schema drifts before production deployments.',
      businessModel:
        'Tiered monthly subscription from $99/mo (Team) to $499/mo (Enterprise).',
      customerTraction:
        '85 global tech companies actively subscribed; $24,000 MRR with 110% net dollar retention.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: 'Stripe verified revenue statements: ₹20L equivalent MRR.',
      profitabilityStatus: 'Profitable',
      fundingRequirement: 4000000, // ₹40,00,000
      intendedUseOfFunds:
        '50% North America enterprise outbound sales, 30% security compliance certifications (SOC2 Type II), 20% team hiring.',
      previousFunding: 'Seed round $120k from angel network',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Stripe merchant export and Delaware C-Corp registry verified.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  // Startup 5: CleanGrid MicroPower [DEMO] (UNDER_REVIEW - Not visible on public explore)
  const founder5 = await db.user.create({
    data: {
      email: 'founder5@cleangrid.demo',
      passwordHash,
      role: 'BUSINESS',
      name: 'Manoj Pillai (Founder)',
      phone: '+91 98765 00007',
      country: 'India',
      city: 'Kochi',
    },
  });

  await db.businessProfile.create({
    data: {
      userId: founder5.id,
      companyName: 'CleanGrid MicroPower',
      founderName: 'Manoj Pillai',
      email: 'founders@cleangrid.demo',
      phone: '+91 98765 00007',
      country: 'India',
      city: 'Kochi',
      industry: 'Energy',
      businessStage: 'Seed',
      yearsOperating: 0.9,
      teamSize: 4,
      businessDescription:
        'Decentralized solar-battery storage installations for rural cold-storage warehouses.',
      problem:
        'Frequent power grid outages spoil perishable agricultural produce before it can reach wholesale markets.',
      solution:
        'Containerized plug-and-play lithium iron phosphate storage coupled with rooftop solar arrays.',
      businessModel:
        'Energy-as-a-service model with monthly uptime SLA billing.',
      customerTraction: '2 pilot warehouse installations operating in Kerala.',
      revenueStatus: 'Pre-revenue',
      revenueDetails: 'Pre-commercialization pilot stage.',
      profitabilityStatus: 'Early Stage',
      fundingRequirement: 4500000,
      intendedUseOfFunds: 'Manufacturing 5 commercial container units and battery procurement.',
      previousFunding: 'Bootstrapped',
      status: 'UNDER_REVIEW',
      verificationStatus: 'UNDER_REVIEW',
      verificationNotes: 'Submitted for admin review on 28-Sep-2026. Pending land lease verification.',
      verifiedAt: null,
      isPublished: false, // NOT PUBLIC
    },
  });

  // 5. Seed an initial Watchlist and Information Request for Demo Investor
  await db.watchlist.create({
    data: {
      userId: investorUser.id,
      businessProfileId: biz1.id,
      privateNotes: 'Strong agronomy traction in Maharashtra. Review sensor bill of materials and renewal churn in Q3.',
    },
  });

  await db.watchlist.create({
    data: {
      userId: investorUser.id,
      businessProfileId: biz4.id,
      privateNotes: 'High net retention (110%) and profitable operations. Evaluate enterprise customer concentration.',
    },
  });

  await db.informationRequest.create({
    data: {
      investorUserId: investorUser.id,
      businessProfileId: biz1.id,
      subject: 'Inquiry regarding hardware gross margins and warranty provisioning',
      message:
        'Hi Ananya, I am reviewing your AgriPulse profile on Vestiq. Could you share details regarding your sensor hardware replacement rates and current per-unit bill of materials?',
      status: 'RESPONDED',
      businessReply:
        'Thank you Vikram. Our current field replacement rate is 2.8% annually, covered by our warranty reserve. Our BoM per unit has decreased 22% over the last 12 months as we scaled to tier-1 manufacturing batches.',
      repliedAt: new Date(),
    },
  });

  // 6. Seed Admin Audit Log
  await db.auditLog.create({
    data: {
      adminId: adminUser.id,
      action: 'APPROVE_AND_VERIFY',
      entityType: 'BUSINESS_PROFILE',
      entityId: biz1.id,
      previousValue: JSON.stringify({ status: 'UNDER_REVIEW', verificationStatus: 'UNDER_REVIEW' }),
      newValue: JSON.stringify({ status: 'APPROVED', verificationStatus: 'VERIFIED' }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('Demo Credentials:');
  console.log('  Admin:    admin@vestiq.com / Password123!');
  console.log('  Investor: investor@vestiq.com / Password123!');
  console.log('  Startup:  contact@agripulse.demo / Password123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

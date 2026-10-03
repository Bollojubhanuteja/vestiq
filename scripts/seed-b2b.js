const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const db = new PrismaClient();

async function main() {
  console.log('--- Seeding Institutional B2B Investment Platform Data ---');

  // 1. Clean previous records cleanly
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

  const defaultPasswordHash = await bcrypt.hash('Vestiq@Launch2026!', 10);
  const investorPasswordHash = await bcrypt.hash('Investor@2026!', 10);

  // 2. Official Admin User
  const adminUser = await db.user.create({
    data: {
      email: 'vestiq21@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      name: 'Bhanu Teja (Vestiq Managing Director)',
      phone: '+91 98765 00001',
      country: 'India',
      city: 'Hyderabad',
    },
  });

  // 3. Matching Configuration
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

  // 4. Create Institutional Investors
  const investor1 = await db.user.create({
    data: {
      email: 'investor@vestiq.com',
      passwordHash: investorPasswordHash,
      role: 'INVESTOR',
      name: 'Vikramaditya Mehta',
      phone: '+91 98200 11223',
      country: 'India',
      city: 'Mumbai',
    },
  });

  const inv1Profile = await db.investorProfile.create({
    data: {
      userId: investor1.id,
      experienceLevel: 'EXPERIENCED',
      bio: 'Family office principal and angel allocator focused on asset-backed fixed yield and high-growth B2B enterprise tech in India.',
      onboardingCompleted: true,
      preferences: {
        create: {
          minInvestment: 500000,
          maxInvestment: 5000000,
          industries: JSON.stringify(['CleanTech', 'Technology', 'Manufacturing', 'HealthTech']),
          geographies: JSON.stringify(['India']),
          horizons: JSON.stringify(['1–3 years', '3–5 years']),
          riskTolerance: 'MODERATE',
          stages: JSON.stringify(['Seed', 'Growth', 'Early Stage']),
          revenuePreference: 'REVENUE_GENERATING',
          profitabilityPreference: 'ANY',
        },
      },
    },
  });

  const investor2 = await db.user.create({
    data: {
      email: 'allocator@apexcap.demo',
      passwordHash: investorPasswordHash,
      role: 'INVESTOR',
      name: 'Priya Ramanathan',
      phone: '+91 98450 33445',
      country: 'India',
      city: 'Bengaluru',
    },
  });

  await db.investorProfile.create({
    data: {
      userId: investor2.id,
      experienceLevel: 'EXPERIENCED',
      bio: 'Syndicate lead writing ₹15L–₹50L checks across healthcare, diagnostics, and climate hardware.',
      onboardingCompleted: true,
      preferences: {
        create: {
          minInvestment: 1000000,
          maxInvestment: 10000000,
          industries: JSON.stringify(['HealthTech', 'AgriTech', 'CleanTech']),
          geographies: JSON.stringify(['India']),
          horizons: JSON.stringify(['3–5 years', '5+ years']),
          riskTolerance: 'MODERATE',
          stages: JSON.stringify(['Growth', 'Early Stage']),
          revenuePreference: 'REVENUE_GENERATING',
          profitabilityPreference: 'PATH_TO_PROFITABILITY',
        },
      },
    },
  });

  // 5. Create Business Founders & Businesses
  // ----------------------------------------------------
  // BUSINESS 1: Zenith CleanEnergy (FIXED RETURN)
  // ----------------------------------------------------
  const founder1 = await db.user.create({
    data: {
      email: 'rajesh.patil@zenithenergy.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Rajesh Patil (Co-Founder & CEO)',
      phone: '+91 98220 55667',
      country: 'India',
      city: 'Pune',
    },
  });

  const biz1 = await db.businessProfile.create({
    data: {
      userId: founder1.id,
      companyName: 'Zenith CleanEnergy Systems Pvt Ltd',
      founderName: 'Rajesh Patil',
      email: founder1.email,
      phone: founder1.phone,
      website: 'https://zenithenergy.example.in',
      country: 'India',
      city: 'Pune',
      industry: 'CleanTech',
      businessStage: 'Growth',
      yearsOperating: 3.5,
      teamSize: 28,
      businessDescription: 'Industrial EV charging depot infrastructure and high-voltage fleet electrification systems for state transit operators and commercial freight hubs.',
      problem: 'Commercial electric truck and bus operators face 30%+ fleet downtime due to inadequate high-power DC fast-charging capacity and fragile local grid connections.',
      solution: 'Turnkey containerized microgrid-integrated charging stations equipped with dedicated battery energy storage, delivering guaranteed 240kW output with 99.4% uptime SLAs.',
      businessModel: 'Dual revenue model: (1) Long-term Take-or-Pay Power Purchase Agreements (PPAs) with commercial logistics operators, and (2) Monthly equipment lease and telemetry maintenance fees.',
      customerTraction: '14 operational high-voltage charging hubs in Maharashtra; long-term contracted pipeline with 3 state transport corporations and 2 blue-chip logistics fleets.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: 'Audited FY25 Revenue: ₹3.42 Crores | Operating EBITDA: 19.4% | GSTN & MCA verified',
      profitabilityStatus: 'Profitable',
      fundingRequirement: 7500000, // ₹75 Lakhs

      // Investment Model: FIXED RETURN
      investmentModel: 'FIXED_RETURN',
      minimumInvestment: 500000, // ₹5 Lakhs min ticket
      proposedReturnRate: 16.0, // 16.0% p.a.
      investmentTenureMonths: 24, // 2 Years
      expectedRepaymentAmount: 9900000, // Principal (₹75L) + 16% annualized return
      repaymentFrequency: 'QUARTERLY',
      collateralDetails: 'Exclusive first charge on 48 DC fast-charging units (asset value ₹1.45 Cr) + Escrow account routing monthly state PPA receivables directly to noteholders.',

      growthMetrics: '38% YoY revenue expansion; 88% commercial asset utilization; zero payment defaults across 14 quarters.',
      riskLevel: 'LOW',
      fundingStatus: 'LIVE',
      amountCommitted: 2500000,
      investorCount: 1,
      agreementStatus: 'INDICATIVE_TERMS',
      intendedUseOfFunds: 'Procuring 48 high-output DC charging modular rectifiers and substation transformers for 4 new Pune-Mumbai freight corridor hubs.',
      previousFunding: 'Bootstrapped ₹85L + Bank Working Capital ₹40L',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'MCA ROC filings, GST tax returns, asset purchase invoices, and state utility PPA agreements verified by Vestiq legal team on 28-Sep-2026.',
      verifiedAt: new Date(),
      isPublished: true,
      documents: {
        create: [
          {
            title: 'Audited Financial Statements FY24 & FY25',
            docType: 'FINANCIALS',
            fileUrl: '/docs/zenith_audited_financials_fy25.pdf',
            fileSize: '3.8 MB',
            verificationStatus: 'VERIFIED',
            sourceClaim: 'Certified by Haribhakti & Co. LLP Chartered Accountants',
          },
          {
            title: 'Equipment Hypothecation & Asset Registry',
            docType: 'REGISTRATION',
            fileUrl: '/docs/zenith_asset_hypothecation.pdf',
            fileSize: '1.9 MB',
            verificationStatus: 'VERIFIED',
            sourceClaim: 'CERSAI Security Interest Registry Verified',
          },
        ],
      },
      riskFlags: {
        create: [
          {
            category: 'MARKET',
            severity: 'LOW',
            description: 'State electricity board grid interconnect approvals may take 45–60 days during substation expansion.',
            isPublic: true,
          },
        ],
      },
    },
  });

  // ----------------------------------------------------
  // BUSINESS 2: AuraMed Diagnostics (EQUITY / PARTNERSHIP)
  // ----------------------------------------------------
  const founder2 = await db.user.create({
    data: {
      email: 'dr.sharma@auramed.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Dr. Siddharth Sharma (MD & Co-Founder)',
      phone: '+91 98490 77889',
      country: 'India',
      city: 'Hyderabad',
    },
  });

  const biz2 = await db.businessProfile.create({
    data: {
      userId: founder2.id,
      companyName: 'AuraMed Diagnostic & AI Pathology Ltd',
      founderName: 'Dr. Siddharth Sharma',
      email: founder2.email,
      phone: founder2.phone,
      website: 'https://auramed.example.in',
      country: 'India',
      city: 'Hyderabad',
      industry: 'HealthTech',
      businessStage: 'Growth',
      yearsOperating: 2.8,
      teamSize: 22,
      businessDescription: 'Tele-pathology platform utilizing proprietary edge-AI computer vision for 8-minute automated cancer biopsy and histopathology screenings in Tier-2/Tier-3 district hospitals.',
      problem: 'Over 80% of Indian district hospitals lack resident specialized histopathologists, causing diagnostic biopsy turnaround times of 14–21 days and delayed cancer treatments.',
      solution: 'Cloud-connected digital slide scanners coupled with AI assistive cell segmentation, providing sub-specialist tele-reporting within 90 minutes at 60% lower cost.',
      businessModel: 'Pay-per-scan B2B institutional SaaS (₹450 per standard pathology slide analysis) + annual hardware deployment and maintenance subscription.',
      customerTraction: '65 partnered hospitals across Telangana, Andhra Pradesh, and Karnataka; over 48,000 biopsy scans processed to date with 98.7% diagnostic concordance.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: 'Annualized Recurring Run-Rate: ₹2.15 Crores | 45% YoY growth | Bank & ROC verified',
      profitabilityStatus: 'Near Break-even',
      fundingRequirement: 12000000, // ₹1.2 Crores

      // Investment Model: EQUITY / PARTNERSHIP
      investmentModel: 'EQUITY',
      minimumInvestment: 1000000, // ₹10 Lakhs min ticket
      valuation: 80000000, // ₹8 Crores Pre-Money Valuation
      preMoneyValuation: 80000000, // ₹8.0 Cr
      postMoneyValuation: 92000000, // ₹9.2 Cr
      equityOffered: 13.04, // 13.04% equity for ₹1.2 Cr
      investorOwnershipPercentage: 1.08, // 1.08% per ₹10L check
      investorRights: 'Pre-emptive rights on future financing, quarterly audited financial access, standard tag-along rights, and a board observer seat for institutional checks of ₹25L+.',

      growthMetrics: '45% YoY patient scan growth; 72% gross margin; customer hospital churn under 2.1%.',
      riskLevel: 'MODERATE',
      fundingStatus: 'LIVE',
      amountCommitted: 2000000,
      investorCount: 1,
      agreementStatus: 'INDICATIVE_TERMS',
      intendedUseOfFunds: 'Regulatory clinical validation trials across 6 government medical colleges, scaling sales force in Tamil Nadu & Odisha, and hardware supply chain expansion.',
      previousFunding: 'Pre-seed Angel ₹60L from Hyderabad Angels syndicate',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'DPIIT Startup India certificate verified, CDSCO medical device registration and clinical trial compliance cleared by Vestiq legal review.',
      verifiedAt: new Date(),
      isPublished: true,
      documents: {
        create: [
          {
            title: 'CDSCO Medical Device Regulatory Registration',
            docType: 'REGISTRATION',
            fileUrl: '/docs/auramed_cdsco_certificate.pdf',
            fileSize: '1.2 MB',
            verificationStatus: 'VERIFIED',
            sourceClaim: 'Government of India CDSCO Portal Verified',
          },
          {
            title: '18-Month Independent Clinical Trial Efficacy Study',
            docType: 'BUSINESS_PLAN',
            fileUrl: '/docs/auramed_clinical_trial_summary.pdf',
            fileSize: '4.5 MB',
            verificationStatus: 'VERIFIED',
            sourceClaim: 'Conducted at NIMS Hyderabad',
          },
        ],
      },
      riskFlags: {
        create: [
          {
            category: 'REGULATORY',
            severity: 'MEDIUM',
            description: 'AI medical diagnostic software guidelines are evolving in India; regular CDSCO compliance updates required.',
            isPublic: true,
          },
        ],
      },
    },
  });

  // ----------------------------------------------------
  // BUSINESS 3: HyperPrecision Robotics (FIXED RETURN)
  // ----------------------------------------------------
  const founder3 = await db.user.create({
    data: {
      email: 'arun.nair@hyperprecision.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Arun Nair (Managing Director)',
      phone: '+91 98451 22334',
      country: 'India',
      city: 'Bengaluru',
    },
  });

  const biz3 = await db.businessProfile.create({
    data: {
      userId: founder3.id,
      companyName: 'HyperPrecision Robotics & Automation Pvt Ltd',
      founderName: 'Arun Nair',
      email: founder3.email,
      phone: founder3.phone,
      website: 'https://hyperprecision.example.in',
      country: 'India',
      city: 'Bengaluru',
      industry: 'Manufacturing',
      businessStage: 'Growth',
      yearsOperating: 5.0,
      teamSize: 42,
      businessDescription: 'High-tolerance CNC multi-axis robotic machining and titanium aerospace component manufacturing supplying certified Indian defence & space vendors.',
      problem: 'Tier-1 defence and aerospace contractors suffer acute supplier shortages for AS9100D-certified precision components with sub-5 micron tolerances.',
      solution: 'Automated 5-axis robotic machining cells capable of lights-out 24/7 production, delivering aerospace components with zero defect escape rates.',
      businessModel: 'Contract manufacturing under 3-year Master Service Agreements (MSAs) with guaranteed minimum off-take volumes and monthly milestone billing.',
      customerTraction: 'AS9100D Rev D and ISO 9001:2015 certified; active approved vendor code for HAL, Bharat Electronics Ltd (BEL), and private satellite constellations.',
      revenueStatus: '₹50L+/mo',
      revenueDetails: 'FY25 Turnover: ₹5.85 Crores | Confirmed Order Book for FY26-27: ₹8.4 Crores | GST & Audit Verified',
      profitabilityStatus: 'Profitable',
      fundingRequirement: 15000000, // ₹1.5 Crores

      // Investment Model: FIXED RETURN
      investmentModel: 'FIXED_RETURN',
      minimumInvestment: 1500000, // ₹15 Lakhs min check
      proposedReturnRate: 15.0, // 15.0% p.a.
      investmentTenureMonths: 36, // 3 Years
      expectedRepaymentAmount: 21750000, // ₹2.175 Cr total payout
      repaymentFrequency: 'MONTHLY',
      collateralDetails: 'Exclusive first hypothecation charge on newly imported DMG Mori 5-axis machining equipment (invoice value ₹2.45 Cr) + corporate and personal founder guarantee.',

      growthMetrics: 'EBITDA margin of 22.8%; 100% on-time delivery metric over the last 18 months; zero debt defaults.',
      riskLevel: 'LOW',
      fundingStatus: 'LIVE',
      amountCommitted: 0,
      investorCount: 0,
      agreementStatus: 'INDICATIVE_TERMS',
      intendedUseOfFunds: 'Custom duty and commissioning payments for two imported 5-axis German machining centers to service new satellite bracket contracts.',
      previousFunding: 'Retained earnings + ₹1.1 Cr equipment term debt from SIDBI',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'AS9100D certification validated, defence vendor registration codes confirmed, audited ROC financials verified.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  // ----------------------------------------------------
  // BUSINESS 4: KisanSetu AgroLogistics (EQUITY)
  // ----------------------------------------------------
  const founder4 = await db.user.create({
    data: {
      email: 'sunil.deshmukh@kisansetu.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Sunil Deshmukh (Founder & CEO)',
      phone: '+91 98230 44556',
      country: 'India',
      city: 'Nashik',
    },
  });

  const biz4 = await db.businessProfile.create({
    data: {
      userId: founder4.id,
      companyName: 'KisanSetu AgroLogistics Pvt Ltd',
      founderName: 'Sunil Deshmukh',
      email: founder4.email,
      phone: founder4.phone,
      website: 'https://kisansetu.example.in',
      country: 'India',
      city: 'Nashik',
      industry: 'AgriTech',
      businessStage: 'Growth',
      yearsOperating: 3.2,
      teamSize: 34,
      businessDescription: 'Farmgate aggregation, IoT cold-storage monitoring, and direct B2B supply chain connecting FPOs (Farmer Producer Organizations) with enterprise supermarket chains and exporters.',
      problem: 'Post-harvest spoilage claims 25%+ of perishable onion, grape, and tomato harvests in Western India due to unmonitored transport and multiple intermediary markups.',
      solution: 'Solar-assisted cold storage aggregation hubs located within 15km of farms, offering real-time crate telemetry and direct dispatch to supermarket distribution centers.',
      businessModel: 'Gross margin spread on procured produce (8%–11%) + SaaS subscription fees for cold-chain crate temperature monitoring.',
      customerTraction: '18,500 onboarded farmers across 24 FPOs in Nashik, Pune, and Ahmednagar; preferred supplier to Reliance Fresh, DMart, and WayCool.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: 'FY25 Gross Revenue: ₹4.18 Crores | Operating Net Margin: 6.8% | ROC Verified',
      profitabilityStatus: 'Profitable',
      fundingRequirement: 8000000, // ₹80 Lakhs

      // Investment Model: EQUITY
      investmentModel: 'EQUITY',
      minimumInvestment: 500000, // ₹5 Lakhs min ticket
      valuation: 52000000, // ₹5.2 Cr Pre-Money
      preMoneyValuation: 52000000,
      postMoneyValuation: 60000000, // ₹6.0 Cr Post-Money
      equityOffered: 13.33,
      investorOwnershipPercentage: 0.83, // per ₹5 Lakhs
      investorRights: 'Information rights, pro-rata subscription rights, tag-along rights, and audited bi-annual reporting.',

      growthMetrics: '52% YoY produce volume expansion; zero inventory wastage on cold-chain routed crates.',
      riskLevel: 'MODERATE',
      fundingStatus: 'LIVE',
      amountCommitted: 0,
      investorCount: 0,
      agreementStatus: 'INDICATIVE_TERMS',
      intendedUseOfFunds: 'Constructing 3 new solar-hybrid precooling packhouses in Sangli and Solapur and expanding IoT crate fleet by 5,000 units.',
      previousFunding: 'Bootstrapped ₹45L + ₹25L Government NABARD subsidy',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'NABARD grant documentation verified, supermarket supplier master agreements confirmed by legal diligence team.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  // ----------------------------------------------------
  // BUSINESS 5: CloudFabric DevSecOps (EQUITY)
  // ----------------------------------------------------
  const founder5 = await db.user.create({
    data: {
      email: 'tanya.kapoor@cloudfabric.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Tanya Kapoor (Co-Founder & CTO)',
      phone: '+91 98110 66778',
      country: 'India',
      city: 'Gurugram',
    },
  });

  const biz5 = await db.businessProfile.create({
    data: {
      userId: founder5.id,
      companyName: 'CloudFabric DevSecOps Systems Ltd',
      founderName: 'Tanya Kapoor',
      email: founder5.email,
      phone: founder5.phone,
      website: 'https://cloudfabric.example.in',
      country: 'India',
      city: 'Gurugram',
      industry: 'Technology',
      businessStage: 'Growth',
      yearsOperating: 2.5,
      teamSize: 18,
      businessDescription: 'Continuous cloud security and Kubernetes compliance platform with automated policy enforcement for fast-scaling engineering teams.',
      problem: 'Rapid cloud deployments cause frequent security configuration drifts, resulting in 40+ days of audit friction and security exposure for regulated fintechs.',
      solution: 'Automated CI/CD security gatekeeper that scans Terraform, Helm charts, and cloud environments, preventing compliance violations before deployment.',
      businessModel: 'B2B SaaS tier from ₹35,000/mo (Team) to ₹2,50,000/mo (Enterprise) with annual prepaid contracts.',
      customerTraction: '42 mid-market tech and fintech clients across India, Singapore, and UAE; ₹30.3 Lakhs MRR (₹3.64 Cr ARR) with 124% Net Revenue Retention.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: 'Stripe & Razorpay verified ARR: ₹3.64 Crores | Net Revenue Retention: 124%',
      profitabilityStatus: 'Profitable',
      fundingRequirement: 20000000, // ₹2 Crores

      // Investment Model: EQUITY
      investmentModel: 'EQUITY',
      minimumInvestment: 2000000, // ₹20 Lakhs min check
      valuation: 140000000, // ₹14 Crores Pre-Money
      preMoneyValuation: 140000000,
      postMoneyValuation: 160000000, // ₹16 Crores Post-Money
      equityOffered: 12.5,
      investorOwnershipPercentage: 1.25, // per ₹20 Lakhs check
      investorRights: 'Observer seat for lead institutional check (₹50L+), standard pro-rata participation rights, information covenants.',

      growthMetrics: '118% MoM MRR growth over last 3 quarters; CAC payback in 4.8 months; zero core customer churn.',
      riskLevel: 'LOW',
      fundingStatus: 'LIVE',
      amountCommitted: 0,
      investorCount: 0,
      agreementStatus: 'INDICATIVE_TERMS',
      intendedUseOfFunds: 'Opening US enterprise sales office, achieving SOC2 Type II compliance renewal, and expanding AI automated remediation pipeline.',
      previousFunding: 'Pre-seed ₹1.2 Cr from angel network',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Stripe payment processor logs verified, SOC2 report inspected, ROC filings verified.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  // ----------------------------------------------------
  // BUSINESS 6: Veloce Urban Logistics (FIXED RETURN)
  // ----------------------------------------------------
  const founder6 = await db.user.create({
    data: {
      email: 'karthik.rajan@velocelogistics.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Karthik Rajan (Founder)',
      phone: '+91 98400 88990',
      country: 'India',
      city: 'Chennai',
    },
  });

  const biz6 = await db.businessProfile.create({
    data: {
      userId: founder6.id,
      companyName: 'Veloce Urban EV Logistics Pvt Ltd',
      founderName: 'Karthik Rajan',
      email: founder6.email,
      phone: founder6.phone,
      website: 'https://veloce.example.in',
      country: 'India',
      city: 'Chennai',
      industry: 'Logistics',
      businessStage: 'Growth',
      yearsOperating: 2.0,
      teamSize: 45,
      businessDescription: 'Dedicated commercial electric 3-wheeler fleet operations providing turnkey last-mile delivery services for India’s fastest-growing quick-commerce brands.',
      problem: 'Quick-commerce giants struggle to hit ESG zero-emission mandates while battling high operating fuel costs of conventional fossil-fuel delivery vehicles.',
      solution: 'Turnkey leased fleet of commercial EV 3-wheelers with smart battery swapping stations and telematics-trained delivery drivers.',
      businessModel: 'Fixed long-term master contracts billed per delivery trip (₹42/delivery) with monthly volume minimums and battery swap charges.',
      customerTraction: '180 active electric 3-wheelers deployed in Chennai & Bengaluru; exclusive delivery partner for Zepto, Blinkit, and BigBasket.',
      revenueStatus: '₹10L - ₹50L/mo',
      revenueDetails: 'FY25 Contract Revenue: ₹1.82 Crores | Operating Margin: 16.2% | Verified Bank Logs',
      profitabilityStatus: 'Profitable',
      fundingRequirement: 5000000, // ₹50 Lakhs

      // Investment Model: FIXED RETURN
      investmentModel: 'FIXED_RETURN',
      minimumInvestment: 500000, // ₹5 Lakhs min ticket
      proposedReturnRate: 17.5, // 17.5% p.a.
      investmentTenureMonths: 18, // 1.5 Years
      expectedRepaymentAmount: 6312500, // ₹63.12 Lakhs total return
      repaymentFrequency: 'MONTHLY',
      collateralDetails: 'Direct hypothecation of 50 new electric 3-wheelers (asset value ₹82 Lakhs) + corporate guarantee and battery remote-telematics immobilizers.',

      growthMetrics: '99.2% on-time delivery rate; fleet battery cost savings of 44% compared to ICE competitors.',
      riskLevel: 'MODERATE',
      fundingStatus: 'LIVE',
      amountCommitted: 0,
      investorCount: 0,
      agreementStatus: 'INDICATIVE_TERMS',
      intendedUseOfFunds: 'Down payments and battery lease deposits for 50 additional commercial 3-wheelers for Hyderabad hub rollout.',
      previousFunding: 'Bootstrapped ₹35L',
      status: 'APPROVED',
      verificationStatus: 'VERIFIED',
      verificationNotes: 'Vehicle RC books, quick-commerce client contracts, and bank statements verified on 29-Sep-2026.',
      verifiedAt: new Date(),
      isPublished: true,
    },
  });

  // ----------------------------------------------------
  // BUSINESS 7: PrimeBio Nutraceuticals (UNDER REVIEW - Not Published)
  // Demonstrates unapproved deals never leak to public view!
  // ----------------------------------------------------
  const founder7 = await db.user.create({
    data: {
      email: 'manish.patel@primebio.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      name: 'Manish Patel',
      phone: '+91 98250 11998',
      country: 'India',
      city: 'Ahmedabad',
    },
  });

  await db.businessProfile.create({
    data: {
      userId: founder7.id,
      companyName: 'PrimeBio Active Nutraceuticals Ltd',
      founderName: 'Manish Patel',
      email: founder7.email,
      phone: founder7.phone,
      country: 'India',
      city: 'Ahmedabad',
      industry: 'Healthcare',
      businessStage: 'Early Traction',
      yearsOperating: 1.5,
      teamSize: 12,
      businessDescription: 'Microbiome-focused organic enzyme extracts for chronic gut health.',
      problem: 'High dependence on imported digestive enzyme active pharmaceutical ingredients (APIs).',
      solution: 'Indigenous bacterial fermentation producing clinical-grade amylase and lactase.',
      businessModel: 'B2B supply to domestic pharmaceutical and OTC wellness formulation brands.',
      revenueStatus: '₹1L - ₹10L/mo',
      profitabilityStatus: 'Early Stage',
      fundingRequirement: 4000000,
      investmentModel: 'EQUITY',
      minimumInvestment: 500000,
      valuation: 25000000,
      equityOffered: 16.0,
      intendedUseOfFunds: 'FSSAI testing and packaging equipment.',
      status: 'UNDER_REVIEW',
      verificationStatus: 'UNDER_REVIEW',
      verificationNotes: 'Pending FSSAI manufacturing facility audit report.',
      isPublished: false, // Hidden from public discovery
    },
  });

  // 6. Create Active Investor Interests & Workflows
  // ----------------------------------------------------
  // Interest 1: Vikramaditya Mehta -> Zenith CleanEnergy (FIXED RETURN)
  // Status: AGREEMENT
  const interest1 = await db.investmentInterest.create({
    data: {
      investorUserId: investor1.id,
      businessProfileId: biz1.id,
      investmentModel: 'FIXED_RETURN',
      intendedAmount: 2500000, // ₹25 Lakhs
      ownershipOrReturnProposed: '16.0% p.a. Fixed IRR (Quarterly Repayment)',
      notes: 'Confirming ₹25 Lakhs allocation for 24-month secured debt note subject to equipment hypothecation deed review.',
      status: 'AGREEMENT',
      termsAccepted: true,
      messages: {
        create: [
          {
            senderId: investor1.id,
            recipientId: founder1.id,
            content: 'Hello Rajesh, we have completed our technical review of the 14 operational EV charging hubs. The 16.0% p.a. quarterly coupon structure meets our family office mandate. Please provide the CERSAI charge draft.',
          },
          {
            senderId: founder1.id,
            recipientId: investor1.id,
            content: 'Thank you Mr. Mehta. The CERSAI hypothecation deed has been uploaded and vetted by our legal counsel. We have generated the indicative term agreement for your sign-off.',
          },
        ],
      },
      agreements: {
        create: [
          {
            investorUserId: investor1.id,
            businessProfileId: biz1.id,
            agreementType: 'FIXED_RETURN_DEBT',
            principalOrAmount: 2500000,
            indicativeTerms: JSON.stringify({
              title: 'Indicative Secured Term Note Agreement',
              issuer: 'Zenith CleanEnergy Systems Pvt Ltd',
              subscriber: 'Vikramaditya Mehta',
              principal: 2500000,
              interestRate: '16.0% per annum',
              tenure: '24 Months',
              repaymentFrequency: 'Quarterly Amortization',
              quarterlyPayment: 387500,
              totalExpectedPayout: 3100000,
              collateral: 'First hypothecation charge on 16 DC charging stations + Escrow PPA receivables.',
              governingLaw: 'Laws of India, Jurisdiction: High Court of Bombay',
            }),
            repaymentSchedule: JSON.stringify([
              { quarter: 1, principalDue: 312500, interestDue: 100000, totalDue: 412500, status: 'UPCOMING' },
              { quarter: 2, principalDue: 312500, interestDue: 87500, totalDue: 400000, status: 'UPCOMING' },
              { quarter: 3, principalDue: 312500, interestDue: 75000, totalDue: 387500, status: 'UPCOMING' },
              { quarter: 4, principalDue: 312500, interestDue: 62500, totalDue: 375000, status: 'UPCOMING' },
              { quarter: 5, principalDue: 312500, interestDue: 50000, totalDue: 362500, status: 'UPCOMING' },
              { quarter: 6, principalDue: 312500, interestDue: 37500, totalDue: 350000, status: 'UPCOMING' },
              { quarter: 7, principalDue: 312500, interestDue: 25000, totalDue: 337500, status: 'UPCOMING' },
              { quarter: 8, principalDue: 312500, interestDue: 12500, totalDue: 325000, status: 'UPCOMING' },
            ]),
            rightsAndCovenants: 'Monthly telemetry uptime reporting, negative pledge on existing assets, escrow account waterfall mechanism.',
            disclosuresAcknowledged: true,
            status: 'PENDING_INVESTOR_SIGN',
          },
        ],
      },
    },
  });

  // Interest 2: Priya Ramanathan -> AuraMed Diagnostics (EQUITY)
  // Status: DUE_DILIGENCE
  const interest2 = await db.investmentInterest.create({
    data: {
      investorUserId: investor2.id,
      businessProfileId: biz2.id,
      investmentModel: 'EQUITY',
      intendedAmount: 2000000, // ₹20 Lakhs
      ownershipOrReturnProposed: '2.17% Equity Participation (₹8 Cr Pre-Money)',
      notes: 'Syndicate allocation for ₹20L. Requesting institutional cap table and CDSCO regulatory clearance copy.',
      status: 'DUE_DILIGENCE',
      termsAccepted: true,
      messages: {
        create: [
          {
            senderId: investor2.id,
            recipientId: founder2.id,
            content: 'Dr. Sharma, our syndicate members are very impressed with the 90-minute turnaround time on cancer biopsies. We would like to inspect the hospital SLA retention metrics.',
          },
          {
            senderId: founder2.id,
            recipientId: investor2.id,
            content: 'Thank you Priya. I have granted your team access to our verified clinical data room and historical hospital cohort retention tables.',
          },
        ],
      },
    },
  });

  // 7. In-App Notifications
  await db.notification.createMany({
    data: [
      {
        userId: investor1.id,
        title: 'Agreement Generated',
        message: 'Zenith CleanEnergy Systems has approved your interest and generated the Indicative Debt Note Agreement for ₹25 Lakhs.',
        type: 'AGREEMENT',
        link: '/dashboard/investor/agreements',
      },
      {
        userId: founder1.id,
        title: 'New Investor Interest Received',
        message: 'Vikramaditya Mehta submitted an interest of ₹25 Lakhs for your Fixed Return Note.',
        type: 'INTEREST',
        link: '/dashboard/business/interests',
      },
      {
        userId: founder2.id,
        title: 'Due Diligence Request',
        message: 'Priya Ramanathan advanced your equity opportunity to Due Diligence stage.',
        type: 'INTEREST',
        link: '/dashboard/business/interests',
      },
      {
        userId: adminUser.id,
        title: 'New Business Pending Verification',
        message: 'PrimeBio Active Nutraceuticals Ltd submitted documents for verification review.',
        type: 'VERIFICATION',
        link: '/admin/opportunities',
      },
    ],
  });

  // 8. Audit Logs
  await db.auditLog.createMany({
    data: [
      {
        adminId: adminUser.id,
        action: 'APPROVE_OPPORTUNITY',
        entityType: 'BUSINESS_PROFILE',
        entityId: biz1.id,
        newValue: JSON.stringify({ companyName: biz1.companyName, model: 'FIXED_RETURN', status: 'VERIFIED' }),
      },
      {
        adminId: adminUser.id,
        action: 'APPROVE_OPPORTUNITY',
        entityType: 'BUSINESS_PROFILE',
        entityId: biz2.id,
        newValue: JSON.stringify({ companyName: biz2.companyName, model: 'EQUITY', status: 'VERIFIED' }),
      },
    ],
  });

  console.log('✓ Seeded 6 verified live businesses (3 Fixed Return + 3 Equity).');
  console.log('✓ Seeded 1 pending business in Admin Review Queue.');
  console.log('✓ Seeded 2 verified institutional investors with active preferences.');
  console.log('✓ Seeded 2 active interest workflows and 1 indicative agreement.');

  // 9. VACUUM database and synchronize src/lib/initial-db.ts for Vercel
  await db.$executeRawUnsafe('VACUUM;');
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    const dbBuf = fs.readFileSync(dbPath);
    const b64 = dbBuf.toString('base64');
    const outPath = path.join(process.cwd(), 'src', 'lib', 'initial-db.ts');
    fs.writeFileSync(outPath, `export const INITIAL_DB_BASE64 = '${b64}';\n`);
    console.log(`✓ Synchronized src/lib/initial-db.ts (${b64.length} chars) for Vercel production.`);
  }

  console.log('--- Database Seed Complete! ---');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
